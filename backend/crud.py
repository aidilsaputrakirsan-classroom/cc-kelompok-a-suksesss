import secrets
import string
from datetime import datetime, timezone
from urllib.parse import quote

from sqlalchemy.orm import Session

from auth import hash_password, verify_password
from models import Consultation, ConsultationStatus, Place, SchoolClass, Student, TimeSlot, Topic, User, UserRole
from schemas import ConsultationGuestCreate, CounselorRegisterRequest, SeedCounselorItem


def _generate_tracking_code(length: int = 10) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "SS-" + "".join(secrets.choice(alphabet) for _ in range(length))


def _normalize_whatsapp_number(phone: str | None) -> str | None:
    if not phone:
        return None

    value = phone.strip()
    if value.startswith("+62"):
        digits = "".join(ch for ch in value if ch.isdigit())
        return digits if digits.startswith("62") else None

    digits = "".join(ch for ch in value if ch.isdigit())
    if digits.startswith("62"):
        return digits
    if digits.startswith("0"):
        return "62" + digits[1:]
    return None


def _build_whatsapp_link(
    phone: str | None,
    student_name: str,
    counselor_name: str,
    status: ConsultationStatus,
    rejection_reason: str | None = None,
) -> str | None:
    wa_number = _normalize_whatsapp_number(phone)
    if wa_number is None:
        return None

    if status == ConsultationStatus.ACCEPTED:
        message = (
            f"Halo {student_name}, saya {counselor_name} dari BK. "
            "Pengajuan konsultasi Anda diterima. Mari kita atur jadwal."
        )
    elif status == ConsultationStatus.REJECTED:
        reason = rejection_reason or "Belum dicantumkan"
        message = (
            f"Halo {student_name}, mohon maaf pengajuan konsultasi Anda tidak dapat diproses. "
            f"Alasan: {reason}"
        )
    else:
        return None

    return f"https://wa.me/{wa_number}?text={quote(message)}"


def create_counselor(db: Session, user_data: CounselorRegisterRequest) -> User | None:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        return None

    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role=UserRole.COUNSELOR,
        phone=user_data.phone,
        specialization=user_data.specialization,
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_counselor(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if user.role != UserRole.COUNSELOR:
        return None
    if not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_guest_consultation(db: Session, payload: ConsultationGuestCreate) -> Consultation:
    counselor = (
        db.query(User)
        .filter(
            User.id == payload.counselor_id,
            User.role == UserRole.COUNSELOR,
            User.is_active.is_(True),
        )
        .first()
    )
    if not counselor:
        raise ValueError("Guru BK tidak ditemukan atau tidak aktif")

    school_class = db.query(SchoolClass).filter(SchoolClass.id == payload.class_id, SchoolClass.active.is_(True)).first()
    if not school_class:
        raise ValueError("Kelas tidak valid")

    topic = db.query(Topic).filter(Topic.id == payload.topic_id, Topic.active.is_(True)).first()
    if not topic:
        raise ValueError("Topik tidak valid")

    time_slot = db.query(TimeSlot).filter(TimeSlot.id == payload.time_slot_id, TimeSlot.active.is_(True)).first()
    if not time_slot:
        raise ValueError("Waktu tidak valid")

    place = db.query(Place).filter(Place.id == payload.place_id, Place.active.is_(True)).first()
    if not place:
        raise ValueError("Tempat tidak valid")

    student = Student(
        name=payload.student_name,
        school_class=school_class.name,
        gender=payload.gender,
        phone=payload.student_phone,
    )
    db.add(student)
    db.flush()

    tracking_code = _generate_tracking_code()
    while db.query(Consultation).filter(Consultation.tracking_code == tracking_code).first() is not None:
        tracking_code = _generate_tracking_code()

    consultation = Consultation(
        tracking_code=tracking_code,
        student_id=student.id,
        counselor_id=payload.counselor_id,
        class_id=payload.class_id,
        method=payload.method,
        topic_id=payload.topic_id,
        date=payload.date,
        time_slot_id=payload.time_slot_id,
        place_id=payload.place_id,
        status=ConsultationStatus.PENDING,
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation


def seed_master_data(db: Session) -> dict:
    class_names = ["X-A", "X-B", "XI IPA 1", "XI IPS 1", "XII IPA 1", "XII IPS 1"]
    topics = [
        {"name": "Belajar", "icon": "book-open", "color": "#7C3AED"},
        {"name": "Karir", "icon": "briefcase", "color": "#10B981"},
        {"name": "Keluarga", "icon": "home", "color": "#F59E0B"},
        {"name": "Sosial", "icon": "users", "color": "#3B82F6"},
        {"name": "Pribadi", "icon": "user", "color": "#EF4444"},
    ]
    time_slots = [
        {"name": "Istirahat ke-1", "start_time": "10:00", "end_time": "10:30"},
        {"name": "Istirahat ke-2", "start_time": "12:00", "end_time": "12:30"},
        {"name": "Pulang Sekolah", "start_time": "14:00", "end_time": "15:30"},
    ]
    places = ["Ruang BK 1", "Ruang BK 2", "Online"]

    created = {"school_classes": 0, "topics": 0, "time_slots": 0, "places": 0}

    for name in class_names:
        if db.query(SchoolClass).filter(SchoolClass.name == name).first() is None:
            db.add(SchoolClass(name=name, active=True))
            created["school_classes"] += 1

    for topic in topics:
        if db.query(Topic).filter(Topic.name == topic["name"]).first() is None:
            db.add(Topic(name=topic["name"], icon=topic["icon"], color=topic["color"], active=True))
            created["topics"] += 1

    for slot in time_slots:
        if db.query(TimeSlot).filter(TimeSlot.name == slot["name"]).first() is None:
            db.add(
                TimeSlot(
                    name=slot["name"],
                    start_time=slot["start_time"],
                    end_time=slot["end_time"],
                    active=True,
                )
            )
            created["time_slots"] += 1

    for name in places:
        if db.query(Place).filter(Place.name == name).first() is None:
            db.add(Place(name=name, active=True))
            created["places"] += 1

    db.commit()
    return created


def seed_counselors(db: Session, counselors: list[SeedCounselorItem]) -> dict:
    created = 0
    skipped_existing = 0

    for item in counselors:
        existing = db.query(User).filter(User.email == item.email.lower()).first()
        if existing is not None:
            skipped_existing += 1
            continue

        db.add(
            User(
                name=item.name,
                email=item.email.lower(),
                hashed_password=hash_password(item.password),
                role=UserRole.COUNSELOR,
                phone=item.phone,
                specialization=item.specialization,
                is_active=True,
            )
        )
        created += 1

    db.commit()
    return {"created": created, "skipped_existing": skipped_existing}


def get_public_master_data(db: Session) -> dict:
    school_classes = (
        db.query(SchoolClass)
        .filter(SchoolClass.active.is_(True))
        .order_by(SchoolClass.name.asc())
        .all()
    )
    topics = (
        db.query(Topic)
        .filter(Topic.active.is_(True))
        .order_by(Topic.name.asc())
        .all()
    )
    time_slots = (
        db.query(TimeSlot)
        .filter(TimeSlot.active.is_(True))
        .order_by(TimeSlot.id.asc())
        .all()
    )
    places = (
        db.query(Place)
        .filter(Place.active.is_(True))
        .order_by(Place.name.asc())
        .all()
    )

    return {
        "school_classes": [{"id": item.id, "name": item.name} for item in school_classes],
        "topics": [{"id": item.id, "name": item.name} for item in topics],
        "time_slots": [
            {
                "id": item.id,
                "name": item.name,
                "start_time": item.start_time,
                "end_time": item.end_time,
            }
            for item in time_slots
        ],
        "places": [{"id": item.id, "name": item.name} for item in places],
    }


def get_active_counselors_public(db: Session) -> list[dict]:
    counselors = (
        db.query(User)
        .filter(
            User.role == UserRole.COUNSELOR,
            User.is_active.is_(True),
        )
        .order_by(User.name.asc())
        .all()
    )

    return [
        {
            "id": counselor.id,
            "name": counselor.name,
            "specialization": counselor.specialization,
            "photo": counselor.photo,
        }
        for counselor in counselors
    ]


def get_consultations_for_counselor(db: Session, counselor_id: int, status: ConsultationStatus | None = None):
    query = (
        db.query(Consultation)
        .filter(Consultation.counselor_id == counselor_id)
        .order_by(Consultation.created_at.desc())
    )
    if status is not None:
        query = query.filter(Consultation.status == status)

    consultations = query.all()
    result = []
    for consultation in consultations:
        result.append(
            {
                "id": consultation.id,
                "tracking_code": consultation.tracking_code,
                "method": consultation.method,
                "status": consultation.status,
                "date": consultation.date,
                "created_at": consultation.created_at,
                "topic_name": consultation.topic.name,
                "time_slot_name": consultation.time_slot.name,
                "place_name": consultation.place.name,
                "student": {
                    "name": consultation.student.name,
                    "school_class": consultation.student.school_class,
                    "gender": consultation.student.gender,
                    "phone": consultation.student.phone,
                },
            }
        )
    return result


def update_consultation_status(
    db: Session,
    consultation_id: int,
    counselor_id: int,
    status: ConsultationStatus,
) -> Consultation | None:
    consultation = (
        db.query(Consultation)
        .filter(
            Consultation.id == consultation_id,
            Consultation.counselor_id == counselor_id,
        )
        .first()
    )
    if consultation is None:
        return None

    consultation.status = status
    now = datetime.now(timezone.utc)
    if status == ConsultationStatus.ACCEPTED:
        consultation.accepted_at = now
        consultation.rejected_at = None
    elif status == ConsultationStatus.REJECTED:
        consultation.rejected_at = now
        consultation.accepted_at = None

    db.commit()
    db.refresh(consultation)
    return consultation


# ==================== DASHBOARD BK ====================

def get_dashboard_stats(db: Session, counselor_id: int) -> dict:
    """
    📊 Hitung statistik dashboard untuk guru BK.
    
    Returns:
    {
      "total": int,
      "pending": int,
      "accepted": int,
      "rejected": int
    }
    
    ✅ Data isolation: Filter by counselor_id = param
    """
    # TODO[BE]: Jika ingin menambah stats (thisMonth, thisWeek), tambah parameter date filter
    
    base_query = db.query(Consultation).filter(Consultation.counselor_id == counselor_id)
    
    total = base_query.count()
    pending = base_query.filter(Consultation.status == ConsultationStatus.PENDING).count()
    accepted = base_query.filter(Consultation.status == ConsultationStatus.ACCEPTED).count()
    rejected = base_query.filter(Consultation.status == ConsultationStatus.REJECTED).count()
    
    return {
        "total": total,
        "pending": pending,
        "accepted": accepted,
        "rejected": rejected,
    }


def get_consultations_paginated(db: Session, counselor_id: int, limit: int, offset: int) -> dict:
    """
    📋 Get paginated consultation list untuk guru BK.
    
    Args:
    - counselor_id: ID konselor (from JWT token)
    - limit: Jumlah data per halaman (1-100)
    - offset: Offset pagination (0, 10, 20, ...)
    
    Returns:
    {
      "data": [
        {
          "id": 1,
          "tracking_code": "SS-ABC123",
          "student_name": "Budi",
          "class": "X-A",
          "topic": "Belajar",
          "status": "PENDING",
          "date": "2026-04-20",
          "time_slot": "Istirahat ke-1 (10:00-10:30)",
          "created_at": "2026-04-17T10:30:45+00:00"
        },
        ...
      ],
      "total": 50,
      "page": 1,
      "limit": 10
    }
    
    ✅ Data isolation: Filter by counselor_id = param
    ✅ Sorted: Order by created_at DESC (terbaru di atas)
    ✅ Pagination: LIMIT = limit, OFFSET = offset
    """
    # Data isolation: Query hanya untuk consultation milik counselor ini
    base_query = (
        db.query(Consultation)
        .filter(Consultation.counselor_id == counselor_id)
        .order_by(Consultation.created_at.desc())
    )
    
    # Count total sebelum pagination
    total = base_query.count()
    
    # Apply pagination
    consultations = base_query.limit(limit).offset(offset).all()
    
    # Transform ke response format
    data = []
    for consultation in consultations:
        rejection_reason = consultation.notes if consultation.status == ConsultationStatus.REJECTED else None
        data.append({
            "id": consultation.id,
            "tracking_code": consultation.tracking_code,
            "student_name": consultation.student.name,
            "student_phone": consultation.student.phone,
            "counselor_name": consultation.counselor.name,
            "class": consultation.school_class.name,
            "topic": consultation.topic.name,
            "status": consultation.status,
            "date": consultation.date,
            "time_slot": f"{consultation.time_slot.name} ({consultation.time_slot.start_time}-{consultation.time_slot.end_time})",
            "rejection_reason": rejection_reason,
            "whatsapp_link": _build_whatsapp_link(
                phone=consultation.student.phone,
                student_name=consultation.student.name,
                counselor_name=consultation.counselor.name,
                status=consultation.status,
                rejection_reason=rejection_reason,
            ),
            "created_at": consultation.created_at,
        })
    
    # Calculate page number (1-indexed)
    page = (offset // limit) + 1 if limit > 0 else 1
    
    return {
        "data": data,
        "total": total,
        "page": page,
        "limit": limit,
    }


def get_consultation_detail_for_counselor(db: Session, consultation_id: int, counselor_id: int) -> dict | None:
    consultation = (
        db.query(Consultation)
        .filter(
            Consultation.id == consultation_id,
            Consultation.counselor_id == counselor_id,
        )
        .first()
    )
    if consultation is None:
        return None

    rejection_reason = consultation.notes if consultation.status == ConsultationStatus.REJECTED else None
    return {
        "id": consultation.id,
        "tracking_code": consultation.tracking_code,
        "student_name": consultation.student.name,
        "student_phone": consultation.student.phone,
        "counselor_name": consultation.counselor.name,
        "class": consultation.school_class.name,
        "topic": consultation.topic.name,
        "status": consultation.status,
        "date": consultation.date,
        "time_slot": f"{consultation.time_slot.name} ({consultation.time_slot.start_time}-{consultation.time_slot.end_time})",
        "place": consultation.place.name,
        "rejection_reason": rejection_reason,
        "whatsapp_link": _build_whatsapp_link(
            phone=consultation.student.phone,
            student_name=consultation.student.name,
            counselor_name=consultation.counselor.name,
            status=consultation.status,
            rejection_reason=rejection_reason,
        ),
        "created_at": consultation.created_at,
    }


def delete_consultation_for_counselor(db: Session, consultation_id: int, counselor_id: int) -> str:
    """
    Delete konsultasi milik counselor yang sedang login.

    Return value:
    - "deleted": data berhasil dihapus
    - "not_found": consultation_id tidak ditemukan
    - "forbidden": data ada tapi bukan milik counselor ini

    NOTE:
    Hard delete dipilih agar tidak mengubah schema enum/status yang sudah ada.
    """
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if consultation is None:
        return "not_found"

    if consultation.counselor_id != counselor_id:
        return "forbidden"

    db.delete(consultation)
    db.commit()
    return "deleted"