from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.authorization.permissions import PlatformAdmins
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.metrics import EvaluationMetricsResponse
from app.schemas.report import EvaluationReportResponse
from fastapi.responses import StreamingResponse
from io import BytesIO

from app.utils.csv_export import generate_evaluation_csv

from fastapi.responses import Response
from app.schemas.prompt_compare import PromptComparisonResponse

from app.utils.pdf_export import generate_evaluation_pdf

from app.schemas.compare import EvaluationComparisonResponse
from app.schemas.benchmark import BenchmarkResponse
from app.schemas.insights import EvaluationInsightsResponse

from app.schemas.evaluation import (
    EvaluationCreate,
    EvaluationUpdate,
    EvaluationResponse,
)

from app.services.evaluation_service import (
    create_evaluation,
    get_all_evaluations,
    get_evaluation_by_id,
    update_evaluation,
    delete_evaluation,
    run_evaluation,
    get_evaluation_metrics,
    get_evaluation_report,
    get_evaluations_comparison,
    compare_evaluation_prompts,
    get_model_benchmarks,
    get_evaluation_insights,
)

router = APIRouter(
    prefix="/evaluations",
    tags=["Evaluations"],
)


@router.post(
    "/",
    response_model=EvaluationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_evaluation(
    evaluation: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return create_evaluation(
        db,
        evaluation,
        current_user,
    )


@router.get("/", response_model=list[EvaluationResponse])
def read_evaluations(
    status: str | None = None,
    project_id: int | None = None,
    dataset_id: int | None = None,
    model_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_all_evaluations(
        db=db,
        status=status,
        project_id=project_id,
        dataset_id=dataset_id,
        model_id=model_id,
    )

@router.get(
    "/compare",
    response_model=EvaluationComparisonResponse,
)
def compare_evaluations(
    ids: list[int] = Query(...),
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_evaluations_comparison(
        db=db,
        ids=ids,
    )

@router.get(
    "/compare/prompts",
    response_model=PromptComparisonResponse,
)
def compare_prompts(
    evaluation1: int = Query(...),
    evaluation2: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return compare_evaluation_prompts(
        db=db,
        evaluation1_id=evaluation1,
        evaluation2_id=evaluation2,
    )

@router.get("/{evaluation_id}", response_model=EvaluationResponse)
def get_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    evaluation = get_evaluation_by_id(
        db,
        evaluation_id,
    )

    if not evaluation:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    return evaluation


@router.patch("/{evaluation_id}", response_model=EvaluationResponse)
def update_existing_evaluation(
    evaluation_id: int,
    evaluation_update: EvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    evaluation = update_evaluation(
        db,
        evaluation_id,
        evaluation_update,
    )

    if not evaluation:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    return evaluation


@router.delete("/{evaluation_id}")
def remove_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    deleted = delete_evaluation(
        db,
        evaluation_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    return {
        "message": "Evaluation deleted successfully"
    }

@router.post("/{evaluation_id}/run")
def start_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    result = run_evaluation(
    db,
    evaluation_id,
    )
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    return {
    "message": "Evaluation completed successfully",
    "status": result["evaluation"].status,
    "total_prompts": result["total_prompts"],
    }

@router.get(
    "/{evaluation_id}/metrics",
    response_model=EvaluationMetricsResponse,
)
def get_metrics(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    metrics = get_evaluation_metrics(
        db,
        evaluation_id,
    )

    if not metrics:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    return metrics

@router.get(
    "/{evaluation_id}/report",
    response_model=EvaluationReportResponse,
)
def evaluation_report(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_evaluation_report(
        db=db,
        evaluation_id=evaluation_id,
    )

@router.get("/{evaluation_id}/export/pdf")
def export_pdf(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    report = get_evaluation_report(
        db=db,
        evaluation_id=evaluation_id,
    )

    pdf = generate_evaluation_pdf(report)

    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="evaluation_{evaluation_id}.pdf"'
            )
        },
    )

@router.get("/{evaluation_id}/export/csv")
def export_csv(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    report = get_evaluation_report(
        db=db,
        evaluation_id=evaluation_id,
    )

    csv_data = generate_evaluation_csv(report)

    return StreamingResponse(
        BytesIO(csv_data.encode("utf-8")),
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                f'attachment; filename="evaluation_{evaluation_id}.csv"'
            )
        },
    )

@router.get(
    "/benchmark/models",
    response_model=BenchmarkResponse,
)
def benchmark_models(
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    return get_model_benchmarks(db)

@router.get(
    "/{evaluation_id}/insights",
    response_model=EvaluationInsightsResponse,
)
def evaluation_insights(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = PlatformAdmins,
):
    insights = get_evaluation_insights(
        db=db,
        evaluation_id=evaluation_id,
    )

    if not insights:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    return insights