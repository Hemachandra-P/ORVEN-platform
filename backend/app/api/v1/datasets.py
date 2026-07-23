from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.dataset import (
    DatasetCreate,
    DatasetUpdate,
    DatasetResponse,
)
from app.services.dataset_service import (
    create_dataset,
    get_all_datasets,
    get_dataset_by_id,
    update_dataset,
    delete_dataset,
)

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"],
)


@router.post("/", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
def create_new_dataset(
    dataset: DatasetCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return create_dataset(
        db=db,
        dataset=dataset,
        current_user=current_user,
    )


@router.get("/", response_model=list[DatasetResponse])
def list_datasets(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_all_datasets(db)


@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    dataset = get_dataset_by_id(
        db,
        dataset_id,
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return dataset


@router.patch("/{dataset_id}", response_model=DatasetResponse)
def update_existing_dataset(
    dataset_id: int,
    dataset: DatasetUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    updated = update_dataset(
        db=db,
        dataset_id=dataset_id,
        dataset=dataset,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return updated


@router.delete("/{dataset_id}")
def remove_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    deleted = delete_dataset(
        db=db,
        dataset_id=dataset_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return {
        "message": "Dataset deleted successfully"
    }