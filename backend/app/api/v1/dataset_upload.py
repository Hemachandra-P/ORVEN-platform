from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.services.dataset_upload_service import upload_dataset_file

router = APIRouter(
    prefix="/datasets",
    tags=["Dataset Upload"],
)


@router.post("/{dataset_id}/upload")
def upload_dataset(
    dataset_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    result = upload_dataset_file(
        db,
        dataset_id,
        file,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    return result