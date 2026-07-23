from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id"),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
    )

    organization = relationship(
        "Organization",
        back_populates="projects",
    )
    
    models = relationship(
    "AIModel",
    back_populates="project",
    cascade="all, delete-orphan",
    )
    datasets = relationship(
    "Dataset",
    back_populates="project",
    cascade="all, delete-orphan"
    )
    evaluations = relationship(
    "Evaluation",
    back_populates="project",
    cascade="all, delete-orphan",
    )