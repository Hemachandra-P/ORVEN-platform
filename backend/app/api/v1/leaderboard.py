from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User

from app.schemas.leaderboard import EvaluationLeaderboardResponse
from app.services.evaluation_service import get_evaluation_leaderboard
router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"],
)


@router.get(
    "/evaluations",
    response_model=EvaluationLeaderboardResponse,
)
def evaluation_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_evaluation_leaderboard(db)