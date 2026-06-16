from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.models import User
from app.models import UserRole
from app.schemas import CounselorRegisterRequest, CounselorLoginRequest, UserCreate, UserLogin

import requests

def create_counselor(db: Session, payload: CounselorRegisterRequest) -> User | None:
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing is not None:
        return None

    user = User(
        email=payload.email.lower(),
        name=payload.name,
        hashed_password=hash_password(payload.password),
        role=UserRole.COUNSELOR,
        phone=payload.phone,
        specialization=payload.specialization,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    try:
        # Gunakan nama service yang ada di docker-compose sebagai URL
        item_service_url = "http://item-service:8002/api/counselors/sync" 
        
        sync_payload = {
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "specialization": user.specialization,
            "photo": user.photo,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat(),
        }
        
        # auth-service "menelepon" item-service
        requests.post(item_service_url, json=sync_payload, timeout=5)
    except Exception as e:
        print(f"Peringatan: Gagal mengirim data ke item-service: {e}")
    # ========================================================

    return user


def authenticate_counselor(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email.lower()).first()
    if user is None or not user.is_active:
        return None
    if user.role != UserRole.COUNSELOR:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def issue_access_token(user: User) -> str:
    return create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
        }
    )


# Backwards-compatible aliases.
create_user = create_counselor
authenticate_user = authenticate_counselor
