from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.authorization.permissions import PlatformAdmins
from app.models.user import User

from app.schemas.metrics import (
    ProviderMetricsResponse,
    DashboardMetricsResponse,
)

from app.services.evaluation_service import (
    get_provider_metrics,
    get_dashboard_metrics,
)

router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"],
)


@router.get(
    "/providers",
    response_model=list[ProviderMetricsResponse],
)
def provider_metrics(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_provider_metrics(db)


@router.get(
    "/dashboard",
    response_model=DashboardMetricsResponse,
)
def dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_dashboard_metrics(db)