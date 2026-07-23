from sqlalchemy.orm import Session

from app.models.dataset_prompt import DatasetPrompt
from app.schemas.dataset_prompt import (
    DatasetPromptCreate,
    DatasetPromptUpdate,
)


def create_dataset_prompt(
    db: Session,
    dataset_prompt: DatasetPromptCreate,
):
    db_prompt = DatasetPrompt(**dataset_prompt.model_dump())

    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)

    return db_prompt


def get_all_dataset_prompts(db: Session):
    return db.query(DatasetPrompt).all()


def get_dataset_prompt_by_id(
    db: Session,
    prompt_id: int,
):
    return (
        db.query(DatasetPrompt)
        .filter(DatasetPrompt.id == prompt_id)
        .first()
    )


def get_prompts_by_dataset(
    db: Session,
    dataset_id: int,
):
    return (
        db.query(DatasetPrompt)
        .filter(DatasetPrompt.dataset_id == dataset_id)
        .all()
    )


def update_dataset_prompt(
    db: Session,
    prompt_id: int,
    dataset_prompt: DatasetPromptUpdate,
):
    db_prompt = get_dataset_prompt_by_id(
        db,
        prompt_id,
    )

    if not db_prompt:
        return None

    update_data = dataset_prompt.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_prompt, key, value)

    db.commit()
    db.refresh(db_prompt)

    return db_prompt


def delete_dataset_prompt(
    db: Session,
    prompt_id: int,
):
    db_prompt = get_dataset_prompt_by_id(
        db,
        prompt_id,
    )

    if not db_prompt:
        return None

    db.delete(db_prompt)
    db.commit()

    return db_prompt