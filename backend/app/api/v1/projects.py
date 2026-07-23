from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)
from app.services import project_service
from app.schemas.metrics import ProjectMetricsResponse
from app.services.evaluation_service import get_project_metrics

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return project_service.create_project(db, project)


@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return project_service.get_all_projects(db)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    project = project_service.get_project_by_id(db, project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    updated = project_service.update_project(
        db,
        project_id,
        project,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return updated


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    deleted = project_service.delete_project(
        db,
        project_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return {
        "message": "Project deleted successfully"
    }

@router.get(
    "/{project_id}/metrics",
    response_model=ProjectMetricsResponse,
)
def get_metrics(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    metrics = get_project_metrics(
        db,
        project_id,
    )

    if not metrics:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return metrics