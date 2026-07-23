from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.models.user import User
from app.schemas.dataset import (
    DatasetCreate,
    DatasetUpdate,
)


def create_dataset(
    db: Session,
    dataset: DatasetCreate,
    current_user: User,
):
    dataset_data = dataset.model_dump()

    db_dataset = Dataset(
        **dataset_data,
        created_by=current_user.id,
    )

    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)

    return db_dataset


def get_all_datasets(db: Session):
    return db.query(Dataset).all()


def get_dataset_by_id(
    db: Session,
    dataset_id: int,
):
    return (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )


def update_dataset(
    db: Session,
    dataset_id: int,
    dataset: DatasetUpdate,
):
    db_dataset = get_dataset_by_id(
        db,
        dataset_id,
    )

    if not db_dataset:
        return None

    update_data = dataset.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_dataset, key, value)

    db.commit()
    db.refresh(db_dataset)

    return db_dataset


def delete_dataset(
    db: Session,
    dataset_id: int,
):
    db_dataset = get_dataset_by_id(
        db,
        dataset_id,
    )

    if not db_dataset:
        return None

    db.delete(db_dataset)
    db.commit()

    return db_dataset