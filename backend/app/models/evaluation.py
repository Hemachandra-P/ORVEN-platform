from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey,
    DateTime,
    Enum,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.models.enums import EvaluationStatus


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    status = Column(
        Enum(EvaluationStatus),
        default=EvaluationStatus.PENDING,
        nullable=False,
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False,
    )

    dataset_id = Column(
        Integer,
        ForeignKey("datasets.id"),
        nullable=False,
    )

    model_id = Column(
        Integer,
        ForeignKey("ai_models.id"),
        nullable=False,
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    started_at = Column(DateTime)

    completed_at = Column(DateTime)

    total_prompts = Column(Integer, default=0)
    
    passed_prompts = Column(Integer, default=0)
    
    failed_prompts = Column(Integer, default=0)
    
    average_latency = Column(Float, default=0.0)
    
    total_tokens = Column(Integer, default=0)
    
    total_cost = Column(Float, default=0.0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
    )

    project = relationship(
        "Project",
        back_populates="evaluations",
    )

    dataset = relationship(
        "Dataset",
        back_populates="evaluations",
    )

    model = relationship(
        "AIModel",
        back_populates="evaluations",
    )

    creator = relationship(
        "User",
        back_populates="evaluations",
    )

    results = relationship(
        "EvaluationResult",
        back_populates="evaluation",
        cascade="all, delete-orphan",
    )