from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.dataset_prompt import (
    DatasetPromptCreate,
    DatasetPromptUpdate,
    DatasetPromptResponse,
)
from app.services.dataset_prompt_service import (
    create_dataset_prompt,
    get_all_dataset_prompts,
    get_dataset_prompt_by_id,
    get_prompts_by_dataset,
    update_dataset_prompt,
    delete_dataset_prompt,
)

router = APIRouter(
    prefix="/dataset-prompts",
    tags=["Dataset Prompts"],
)


@router.post("/", response_model=DatasetPromptResponse, status_code=status.HTTP_201_CREATED)
def create_prompt(
    dataset_prompt: DatasetPromptCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return create_dataset_prompt(db, dataset_prompt)


@router.get("/", response_model=list[DatasetPromptResponse])
def list_prompts(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_all_dataset_prompts(db)


@router.get("/{prompt_id}", response_model=DatasetPromptResponse)
def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    prompt = get_dataset_prompt_by_id(db, prompt_id)

    if not prompt:
        raise HTTPException(
            status_code=404,
            detail="Dataset Prompt not found",
        )

    return prompt


@router.get("/dataset/{dataset_id}", response_model=list[DatasetPromptResponse])
def list_dataset_prompts(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_prompts_by_dataset(db, dataset_id)


@router.patch("/{prompt_id}", response_model=DatasetPromptResponse)
def update_prompt(
    prompt_id: int,
    dataset_prompt: DatasetPromptUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    updated = update_dataset_prompt(
        db,
        prompt_id,
        dataset_prompt,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Dataset Prompt not found",
        )

    return updated


@router.delete("/{prompt_id}")
def remove_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    deleted = delete_dataset_prompt(
        db,
        prompt_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Dataset Prompt not found",
        )

    return {
        "message": "Dataset Prompt deleted successfully"
    }