from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class EvaluationResult(Base):
    __tablename__ = "evaluation_results"

    id = Column(Integer, primary_key=True, index=True)

    evaluation_id = Column(
        Integer,
        ForeignKey("evaluations.id"),
        nullable=False,
    )

    dataset_prompt_id = Column(
        Integer,
        ForeignKey("dataset_prompts.id"),
        nullable=False,
    )

    prompt = Column(String, nullable=False)

    expected_answer = Column(String)

    model_response = Column(String)

    score = Column(Float)

    passed = Column(Boolean)

    latency = Column(Float)
    
    prompt_tokens = Column(Integer, default=0)
    
    completion_tokens = Column(Integer, default=0)
    
    total_tokens = Column(Integer, default=0)
    
    estimated_cost = Column(Float, default=0.0)
    
    status = Column(String, default="SUCCESS")
    
    error_message = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    evaluation = relationship(
    "Evaluation",
    back_populates="results",
    )

    dataset_prompt = relationship(
    "DatasetPrompt",
    back_populates="evaluation_results",
    )