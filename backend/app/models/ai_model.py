from sqlalchemy import (
    String,
    Integer,
    Boolean,
    ForeignKey,
    Enum,
    Float,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import AIProvider


class AIModel(Base):
    __tablename__ = "ai_models"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    provider: Mapped[AIProvider] = mapped_column(
        Enum(
            AIProvider,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    model_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    endpoint: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    context_window: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    supports_vision: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    supports_tool_calling: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    supports_streaming: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    temperature: Mapped[float] = mapped_column(
        Float,
        default=0.7,
    )

    max_tokens: Mapped[int] = mapped_column(
        default=4096,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"),
        nullable=False,
    )

    project = relationship(
        "Project",
        back_populates="models",
    )
    evaluations = relationship(
    "Evaluation",
    back_populates="model",
    cascade="all, delete-orphan",
    )