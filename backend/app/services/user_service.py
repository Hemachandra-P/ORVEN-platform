from sqlalchemy.orm import Session

from app.auth.hashing import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def get_user_by_email(db: Session, email: str):
    """
    Return a user if the email already exists.
    """
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    """
    Create a new user with a hashed password.
    """
    hashed_password = hash_password(user.password)

    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password,
        is_active=True,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def authenticate_user(db: Session, email: str, password: str):
    """
    Authenticate a user by email and password.
    Returns the user if valid, otherwise None.
    """
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def get_all_users(db: Session):
    return db.query(User).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user_role(db: Session, user_id: int, role):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    user.role = role

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    db.delete(user)
    db.commit()

    return user