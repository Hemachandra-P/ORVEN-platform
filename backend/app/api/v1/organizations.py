from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    OrganizationUpdate,
)
from app.services.organization_service import (
    create_organization,
    delete_organization,
    get_all_organizations,
    get_organization_by_id,
    update_organization,
)

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)


@router.post("/", response_model=OrganizationResponse)
def create_org(
    organization: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return create_organization(db, organization)


@router.get("/", response_model=list[OrganizationResponse])
def list_organizations(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_all_organizations(db)


@router.get("/{organization_id}", response_model=OrganizationResponse)
def get_org(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    organization = get_organization_by_id(db, organization_id)

    if not organization:
        raise HTTPException(
            status_code=404,
            detail="Organization not found",
        )

    return organization


@router.patch("/{organization_id}", response_model=OrganizationResponse)
def update_org(
    organization_id: int,
    organization: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    updated = update_organization(
        db,
        organization_id,
        organization,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Organization not found",
        )

    return updated


@router.delete("/{organization_id}")
def delete_org(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    deleted = delete_organization(
        db,
        organization_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Organization not found",
        )

    return {
        "message": "Organization deleted successfully"
    }