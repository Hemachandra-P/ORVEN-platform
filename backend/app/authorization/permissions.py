from typing import Callable

from fastapi import Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.core.roles import UserRole
from app.models.user import User


def require_roles(*allowed_roles: UserRole) -> Callable:
    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:

        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action.",
            )

        return current_user

    return role_checker


# ======================================================
# Permission Groups
# ======================================================

PlatformAdmins = Depends(
    require_roles(
        UserRole.ADMIN,
        UserRole.ORGANIZATION_OWNER,
    )
)

QATeam = Depends(
    require_roles(
        UserRole.QA_ENGINEER,
        UserRole.QA_LEAD,
        UserRole.ADMIN,
        UserRole.ORGANIZATION_OWNER,
    )
)

TestingUsers = Depends(
    require_roles(
        UserRole.DEVELOPER,
        UserRole.QA_ENGINEER,
        UserRole.QA_LEAD,
        UserRole.ADMIN,
        UserRole.ORGANIZATION_OWNER,
    )
)

AuthenticatedUser = Depends(get_current_user)