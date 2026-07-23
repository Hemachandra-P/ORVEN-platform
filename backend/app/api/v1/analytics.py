from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User

from app.schemas.analytics import EvaluationAnalyticsResponse
from app.services.evaluation_service import get_evaluation_analytics

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/evaluations",
    response_model=EvaluationAnalyticsResponse,
)
def evaluation_analytics(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_evaluation_analytics(db)