from sqlalchemy.orm import Session

from app.models.ai_model import AIModel
from app.schemas.ai_model import (
    AIModelCreate,
    AIModelUpdate,
)


def create_ai_model(db: Session, model: AIModelCreate):
    db_model = AIModel(**model.model_dump())

    db.add(db_model)
    db.commit()
    db.refresh(db_model)

    return db_model


def get_all_ai_models(db: Session):
    return db.query(AIModel).all()


def get_ai_model_by_id(db: Session, model_id: int):
    return (
        db.query(AIModel)
        .filter(AIModel.id == model_id)
        .first()
    )


def update_ai_model(
    db: Session,
    model_id: int,
    model: AIModelUpdate,
):
    db_model = get_ai_model_by_id(db, model_id)

    if not db_model:
        return None

    update_data = model.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_model, key, value)

    db.commit()
    db.refresh(db_model)

    return db_model


def delete_ai_model(
    db: Session,
    model_id: int,
):
    db_model = get_ai_model_by_id(db, model_id)

    if not db_model:
        return None

    db.delete(db_model)
    db.commit()

    return db_model