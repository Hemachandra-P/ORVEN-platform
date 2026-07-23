from sqlalchemy import Boolean, String, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.core.roles import UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    first_name: Mapped[str] = mapped_column(String(100))

    last_name: Mapped[str] = mapped_column(String(100))

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(String(255))

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(
            UserRole,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
        default=UserRole.QA_ENGINEER,
    )

    organization_id: Mapped[int | None] = mapped_column(
        ForeignKey("organizations.id"),
        nullable=True,
    )

    organization = relationship(
        "Organization",
        back_populates="users",
    )
    datasets = relationship(
    "Dataset",
    foreign_keys="Dataset.created_by"
    )
    evaluations = relationship(
    "Evaluation",
    back_populates="creator",
    )
    conversations = relationship(
    "Conversation",
    back_populates="user",
    cascade="all, delete-orphan",
    )
    documents = relationship(
    "Document",
    back_populates="user",
    cascade="all, delete-orphan",
    )