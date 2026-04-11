import secrets
import string
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from auth import hash_password, verify_password
from models import Consultation, ConsultationStatus, Place, SchoolClass, Student, TimeSlot, Topic, User, UserRole
from schemas import ConsultationGuestCreate, CounselorRegisterRequest, SeedCounselorItem


def _generate_tracking_code(length: int = 10) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "SS-" + "".join(secrets.choice(alphabet) for _ in range(length))


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