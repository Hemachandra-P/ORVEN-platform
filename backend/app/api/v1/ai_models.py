from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.ai_model import (
    AIModelCreate,
    AIModelUpdate,
    AIModelResponse,
)
from app.services.ai_model_service import (
    create_ai_model,
    get_all_ai_models,
    get_ai_model_by_id,
    update_ai_model,
    delete_ai_model,
)

router = APIRouter(
    prefix="/ai-models",
    tags=["AI Models"],
)


@router.post("/", response_model=AIModelResponse, status_code=status.HTTP_201_CREATED)
def create_model(
    model: AIModelCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return create_ai_model(db, model)


@router.get("/", response_model=list[AIModelResponse])
def list_models(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_all_ai_models(db)


@router.get("/{model_id}", response_model=AIModelResponse)
def get_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    model = get_ai_model_by_id(db, model_id)

    if not model:
        raise HTTPException(
            status_code=404,
            detail="AI Model not found",
        )

    return model


@router.patch("/{model_id}", response_model=AIModelResponse)
def update_model(
    model_id: int,
    model: AIModelUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    updated = update_ai_model(
        db,
        model_id,
        model,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="AI Model not found",
        )

    return updated


@router.delete("/{model_id}")
def remove_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    deleted = delete_ai_model(
        db,
        model_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="AI Model not found",
        )

    return {
        "message": "AI Model deleted successfully"
    }