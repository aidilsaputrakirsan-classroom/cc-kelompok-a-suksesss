from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.models import User
from app.schemas import UserCreate


def create_user(db: Session, payload: UserCreate) -> User | None:
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing is not None:
        return None

    user = User(
        email=payload.email.lower(),
        name=payload.name,
        hashed_password=hash_password(payload.password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email.lower()).first()
    if user is None or not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def issue_access_token(user: User) -> str:
    return create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role.value})
