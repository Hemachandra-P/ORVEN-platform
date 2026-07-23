import os
import shutil

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.user import User
from app.services.rag_service import RAGService

UPLOAD_DIR = "uploads/documents"


def save_document(
    db: Session,
    file: UploadFile,
    user: User,
    extracted_text: str,
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        filename=file.filename,
        file_type=file.content_type,
        file_size=os.path.getsize(file_path),
        file_path=file_path,
        extracted_text=extracted_text,
        user_id=user.id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # Process document for RAG
    rag_service = RAGService()
    rag_service.process_document(
        db=db,
        document=document,
    )

    return document


def list_documents(
    db: Session,
    user: User,
):
    return (
        db.query(Document)
        .filter(Document.user_id == user.id)
        .order_by(Document.created_at.desc())
        .all()
    )


def delete_document(
    db: Session,
    document_id: int,
    user: User,
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()