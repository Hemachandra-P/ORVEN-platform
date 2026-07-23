from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.models.enums import (
    DatasetType,
    DatasetCreationMethod,
    DatasetStatus,
)


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    dataset_type = Column(
        Enum(DatasetType),
        nullable=False
    )

    creation_method = Column(
        Enum(DatasetCreationMethod),
        nullable=False
    )

    status = Column(
        Enum(DatasetStatus),
        nullable=False,
        default=DatasetStatus.CREATING
    )

    total_prompts = Column(
        Integer,
        nullable=False,
        default=0
    )

    file_name = Column(
        String(255),
        nullable=True
    )

    file_path = Column(
        String(500),
        nullable=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="datasets"
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by]
    )

    dataset_prompts = relationship(
        "DatasetPrompt",
        back_populates="dataset",
        cascade="all, delete-orphan"
    )
    evaluations = relationship(
    "Evaluation",
    back_populates="dataset",
    cascade="all, delete-orphan",
    )