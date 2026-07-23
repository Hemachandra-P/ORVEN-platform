from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.authorization.permissions import (
    PlatformAdmins,
    AuthenticatedUser,
)
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    UpdateUserRole,
)
from app.services.user_service import (
    get_all_users,
    get_user_by_id,
    update_user_role,
    delete_user,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
from app.services.user_service import (
    get_all_users,
    update_user_role,
    get_user_by_id,
)

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = AuthenticatedUser,
):
    """
    Return the currently authenticated user.
    """
    return current_user


@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_all_users(db)


@router.patch("/{user_id}/role", response_model=UserResponse)
def change_role(
    user_id: int,
    role_update: UpdateUserRole,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    user = update_user_role(
        db,
        user_id,
        role_update.role,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user

@router.delete("/{user_id}")
def remove_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account.",
        )

    user = delete_user(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "message": "User deleted successfully"
    }