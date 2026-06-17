import enum

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Item(Base):
    __tablename__ = "items"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    owner_id = Column(Integer, nullable=False, index=True)
    is_public = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Counselor(Base):
    __tablename__ = "counselors"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    specialization = Column(String(120), nullable=True)
    photo = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SchoolClass(Base):
    __tablename__ = "school_classes"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(64), nullable=False, unique=True)
    active = Column(Boolean, nullable=False, default=True)


class Topic(Base):
    __tablename__ = "topics"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    icon = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)
    active = Column(Boolean, nullable=False, default=True)


class TimeSlot(Base):
    __tablename__ = "time_slots"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    start_time = Column(String(10), nullable=True)
    end_time = Column(String(10), nullable=True)
    active = Column(Boolean, nullable=False, default=True)


class Place(Base):
    __tablename__ = "places"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    active = Column(Boolean, nullable=False, default=True)


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


class Student(Base):
    __tablename__ = "students"
    __table_args__ = {'schema': 'item_service'}
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    school_class = Column(String(64), nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Consultation(Base):
    __tablename__ = "consultations"
    __table_args__ = {'schema': 'item_service'}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tracking_code = Column(String(20), nullable=False, unique=True, index=True)

    student_id = Column(Integer, ForeignKey("item_service.students.id", ondelete="CASCADE"), nullable=False, index=True)
    counselor_id = Column(Integer, ForeignKey("item_service.counselors.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id = Column(Integer, ForeignKey("item_service.school_classes.id"), nullable=False)
    method = Column(Enum(ConsultationMethod), nullable=False)
    topic_id = Column(Integer, ForeignKey("item_service.topics.id"), nullable=False)
    date = Column(Date, nullable=False)
    time_slot_id = Column(Integer, ForeignKey("item_service.time_slots.id"), nullable=False)
    place_id = Column(Integer, ForeignKey("item_service.places.id"), nullable=False)

    status = Column(Enum(ConsultationStatus), nullable=False, default=ConsultationStatus.PENDING)
    notes = Column(Text, nullable=True)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    rejected_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    student = relationship("Student")
    counselor = relationship("Counselor")
    school_class = relationship("SchoolClass")
    topic = relationship("Topic")
    time_slot = relationship("TimeSlot")
    place = relationship("Place")