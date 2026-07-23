from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.session import get_db
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.document_parser import extract_text
from app.services.document_service import (
    delete_document,
    list_documents,
    save_document,
)
from sqlalchemy.orm import relationship

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentResponse,
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    try:
        text = extract_text(file)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    return save_document(
        db=db,
        file=file,
        user=current_user,
        extracted_text=text,
    )


@router.get(
    "",
    response_model=list[DocumentResponse],
)
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return list_documents(
        db=db,
        user=current_user,
    )


@router.delete("/{document_id}")
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    delete_document(
        db=db,
        document_id=document_id,
        user=current_user,
    )

    return {
        "message": "Document deleted successfully"
    }