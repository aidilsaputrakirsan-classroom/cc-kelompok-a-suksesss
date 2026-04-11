import enum

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class UserRole(str, enum.Enum):
    COUNSELOR = "COUNSELOR"
    ADMIN = "ADMIN"


class Gender(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"


class ConsultationMethod(str, enum.Enum):
    INDIVIDUAL = "INDIVIDUAL"
    GROUP = "GROUP"


class ConsultationStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.COUNSELOR)
    phone = Column(String(20), nullable=True)
    photo = Column(String(255), nullable=True)
    specialization = Column(String(120), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    consultations = relationship("Consultation", back_populates="counselor", cascade="all,delete")
    news_articles = relationship("News", back_populates="author", cascade="all,delete")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    school_class = Column(String(64), nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    consultations = relationship("Consultation", back_populates="student", cascade="all,delete")


class SchoolClass(Base):
    __tablename__ = "school_classes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(64), nullable=False, unique=True)
    active = Column(Boolean, nullable=False, default=True)

    consultations = relationship("Consultation", back_populates="school_class")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    icon = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)
    active = Column(Boolean, nullable=False, default=True)

    consultations = relationship("Consultation", back_populates="topic")


class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    start_time = Column(String(10), nullable=True)
    end_time = Column(String(10), nullable=True)
    active = Column(Boolean, nullable=False, default=True)

    consultations = relationship("Consultation", back_populates="time_slot")


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    active = Column(Boolean, nullable=False, default=True)

    consultations = relationship("Consultation", back_populates="place")


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tracking_code = Column(String(20), nullable=False, unique=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    counselor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("school_classes.id"), nullable=False)
    method = Column(Enum(ConsultationMethod), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    date = Column(Date, nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)
    status = Column(Enum(ConsultationStatus), nullable=False, default=ConsultationStatus.PENDING)
    notes = Column(Text, nullable=True)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    rejected_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    student = relationship("Student", back_populates="consultations")
    counselor = relationship("User", back_populates="consultations")
    school_class = relationship("SchoolClass", back_populates="consultations")
    topic = relationship("Topic", back_populates="consultations")
    time_slot = relationship("TimeSlot", back_populates="consultations")
    place = relationship("Place", back_populates="consultations")


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(220), nullable=False, unique=True, index=True)
    content = Column(Text, nullable=False)
    image = Column(String(255), nullable=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    author_name = Column(String(100), nullable=False)
    published = Column(Boolean, nullable=False, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User", back_populates="news_articles")



