import secrets
import string
from datetime import datetime, timezone
from urllib.parse import quote

from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload

from app.models import (
    Consultation,
    ConsultationMethod,
    ConsultationStatus,
    Counselor,
    Gender,
    Item,
    Place,
    SchoolClass,
    Student,
    TimeSlot,
    Topic,
)
from app.schemas import ConsultationGuestCreate, ItemCreate, ItemUpdate, SeedCounselorItem


def create_item(db: Session, payload: ItemCreate, owner_id: int) -> Item:
    item = Item(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        quantity=payload.quantity,
        owner_id=owner_id,
        is_public=payload.is_public,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_items(db: Session, owner_id: int | None = None) -> list[Item]:
    query = db.query(Item)
    if owner_id is not None:
        query = query.filter(Item.owner_id == owner_id)
    return query.order_by(Item.created_at.desc()).all()


def list_public_items(db: Session) -> list[Item]:
    return (
        db.query(Item)
        .filter(Item.is_public.is_(True))
        .order_by(Item.created_at.desc())
        .all()
    )


def get_item(db: Session, item_id: int, owner_id: int | None = None) -> Item | None:
    query = db.query(Item).filter(Item.id == item_id)
    if owner_id is not None:
        query = query.filter(Item.owner_id == owner_id)
    return query.first()


def update_item(db: Session, item: Item, payload: ItemUpdate) -> Item:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: Item) -> None:
    db.delete(item)
    db.commit()


def get_items_stats(db: Session, owner_id: int | None = None) -> dict:
    query = db.query(Item)
    if owner_id is not None:
        query = query.filter(Item.owner_id == owner_id)

    items = query.all()
    total_items = len(items)
    total_value = sum(item.price * item.quantity for item in items)
    termasuk = sum(1 for item in items if item.quantity > 0)
    terminum = sum(1 for item in items if item.quantity == 0)

    most_expensive = max(items, key=lambda item: item.price) if items else None
    cheapest = min(items, key=lambda item: item.price) if items else None

    return {
        "total_items": total_items,
        "total_value": total_value,
        "termasuk": termasuk,
        "terminum": terminum,
        "most_expensive": None if most_expensive is None else {"id": most_expensive.id, "name": most_expensive.name, "price": most_expensive.price},
        "cheapest": None if cheapest is None else {"id": cheapest.id, "name": cheapest.name, "price": cheapest.price},
    }


def _generate_tracking_code(length: int = 10) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "SS-" + "".join(secrets.choice(alphabet) for _ in range(length))


def _normalize_whatsapp_number(phone: str | None) -> str | None:
    if not phone:
        return None

    value = phone.strip()
    digits = "".join(ch for ch in value if ch.isdigit())
    if value.startswith("+62"):
        return digits if digits.startswith("62") else None
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
            db.add(TimeSlot(name=slot["name"], start_time=slot["start_time"], end_time=slot["end_time"], active=True))
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
        existing = db.query(Counselor).filter(Counselor.email == item.email.lower()).first()
        if existing is not None:
            skipped_existing += 1
            continue

        db.add(
            Counselor(
                name=item.name,
                email=item.email.lower(),
                phone=item.phone,
                specialization=item.specialization,
                is_active=True,
            )
        )
        created += 1

    db.commit()
    return {"created": created, "skipped_existing": skipped_existing}


def get_public_master_data(db: Session) -> dict:
    school_classes = db.query(SchoolClass).filter(SchoolClass.active.is_(True)).order_by(SchoolClass.name.asc()).all()
    topics = db.query(Topic).filter(Topic.active.is_(True)).order_by(Topic.name.asc()).all()
    time_slots = db.query(TimeSlot).filter(TimeSlot.active.is_(True)).order_by(TimeSlot.id.asc()).all()
    places = db.query(Place).filter(Place.active.is_(True)).order_by(Place.name.asc()).all()

    return {
        "school_classes": [{"id": item.id, "name": item.name} for item in school_classes],
        "topics": [{"id": item.id, "name": item.name} for item in topics],
        "time_slots": [
            {"id": item.id, "name": item.name, "start_time": item.start_time, "end_time": item.end_time}
            for item in time_slots
        ],
        "places": [{"id": item.id, "name": item.name} for item in places],
    }


def get_active_counselors_public(db: Session) -> list[dict]:
    counselors = db.query(Counselor).filter(Counselor.is_active.is_(True)).order_by(Counselor.name.asc()).all()
    return [
        {"id": counselor.id, "name": counselor.name, "specialization": counselor.specialization, "photo": counselor.photo}
        for counselor in counselors
    ]


def create_guest_consultation(db: Session, payload: ConsultationGuestCreate) -> Consultation:
    counselor = db.query(Counselor).filter(Counselor.id == payload.counselor_id, Counselor.is_active.is_(True)).first()
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
        gender=Gender[payload.gender.upper()],
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
        method=ConsultationMethod[payload.method.upper()],
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


def get_dashboard_stats(db: Session, counselor_id: int) -> dict:
    base_query = db.query(Consultation).filter(Consultation.counselor_id == counselor_id)
    total = base_query.count()
    pending = base_query.filter(Consultation.status == ConsultationStatus.PENDING).count()
    accepted = base_query.filter(Consultation.status == ConsultationStatus.ACCEPTED).count()
    rejected = base_query.filter(Consultation.status == ConsultationStatus.REJECTED).count()
    return {"total": total, "pending": pending, "accepted": accepted, "rejected": rejected}


def get_consultations_paginated(
    db: Session,
    counselor_id: int,
    current_counselor_name: str,
    limit: int,
    offset: int,
    method: str | None = None,
    gender: str | None = None,
    status_filter: ConsultationStatus | None = None,
) -> dict:
    base_query = (
        db.query(Consultation)
        .options(
            selectinload(Consultation.student),
            selectinload(Consultation.school_class),
            selectinload(Consultation.topic),
            selectinload(Consultation.time_slot)
        )
        .filter(Consultation.counselor_id == counselor_id)
        .order_by(Consultation.created_at.desc())
    )
    
    if method is not None:
        try:
            method_enum = ConsultationMethod[method.upper()]
            base_query = base_query.filter(Consultation.method == method_enum)
        except KeyError:
            pass

    if gender is not None:
        try:
            gender_enum = Gender[gender.upper()]
            base_query = base_query.join(Student).filter(Student.gender == gender_enum)
        except KeyError:
            pass

    if status_filter is not None:
        base_query = base_query.filter(Consultation.status == status_filter)

    total = base_query.count()
    consultations = base_query.limit(limit).offset(offset).all()

    data = []
    for consultation in consultations:
        rejection_reason = consultation.notes if consultation.status == ConsultationStatus.REJECTED else None
        data.append({
            "id": consultation.id,
            "tracking_code": consultation.tracking_code,
            "student_name": consultation.student.name,
            "student_phone": consultation.student.phone,
            "counselor_name": current_counselor_name,
            "class": consultation.school_class.name,
            "topic": consultation.topic.name,
            "status": consultation.status,
            "date": consultation.date,
            "time_slot": f"{consultation.time_slot.name} ({consultation.time_slot.start_time}-{consultation.time_slot.end_time})",
            "rejection_reason": rejection_reason,
            "whatsapp_link": _build_whatsapp_link(
                phone=consultation.student.phone,
                student_name=consultation.student.name,
                counselor_name=current_counselor_name,
                status=consultation.status,
                rejection_reason=rejection_reason,
            ),
            "created_at": consultation.created_at,
        })

    page = (offset // limit) + 1 if limit > 0 else 1
    return {"data": data, "total": total, "page": page, "limit": limit}


def get_consultation_detail_for_counselor(
    db: Session,
    consultation_id: int,
    counselor_id: int,
    current_counselor_name: str,
) -> dict | None:
    consultation = (
        db.query(Consultation)
        .filter(Consultation.id == consultation_id, Consultation.counselor_id == counselor_id)
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
        "counselor_name": current_counselor_name,
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
            counselor_name=current_counselor_name,
            status=consultation.status,
            rejection_reason=rejection_reason,
        ),
        "created_at": consultation.created_at,
    }


def update_consultation_status(
    db: Session,
    consultation_id: int,
    counselor_id: int,
    status: ConsultationStatus,
) -> Consultation | None:
    consultation = (
        db.query(Consultation)
        .filter(Consultation.id == consultation_id, Consultation.counselor_id == counselor_id)
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


def delete_consultation_for_counselor(db: Session, consultation_id: int, counselor_id: int) -> str:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if consultation is None:
        return "not_found"

    if consultation.counselor_id != counselor_id:
        return "forbidden"

    db.delete(consultation)
    db.commit()
    return "deleted"
