from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class DatasetPrompt(Base):
    __tablename__ = "dataset_prompts"

    id = Column(Integer, primary_key=True, index=True)

    dataset_id = Column(
        Integer,
        ForeignKey("datasets.id", ondelete="CASCADE"),
        nullable=False,
    )

    prompt = Column(
        Text,
        nullable=False,
    )

    context = Column(
        Text,
        nullable=True,
    )

    expected_answer = Column(
        Text,
        nullable=True,
    )

    category = Column(
        String(100),
        nullable=True,
    )

    difficulty = Column(
        String(50),
        nullable=True,
    )

    language = Column(
        String(50),
        nullable=True,
        default="English",
    )

    prompt_metadata = Column(
    JSON,
    nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    dataset = relationship(
        "Dataset",
        back_populates="dataset_prompts",
    )

    evaluation_results = relationship(
    "EvaluationResult",
    back_populates="dataset_prompt",
    cascade="all, delete-orphan",
    )