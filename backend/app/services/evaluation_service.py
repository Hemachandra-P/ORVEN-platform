from datetime import datetime
import time

from sqlalchemy.orm import Session

from app.connectors.connector_factory import ConnectorFactory
from app.models.dataset_prompt import DatasetPrompt
from app.models.evaluation import Evaluation
from app.models.evaluation_result import EvaluationResult
from app.models.enums import EvaluationStatus
from app.models.user import User
from app.schemas.evaluation import (
    EvaluationCreate,
    EvaluationUpdate,
)
from app.schemas.leaderboard import (
    EvaluationLeaderboardItem,
    EvaluationLeaderboardResponse,
)
from app.schemas.analytics import EvaluationAnalyticsResponse
from app.schemas.compare import (
    EvaluationComparisonItem,
    EvaluationComparisonResponse,
)
from app.models.evaluation_result import EvaluationResult
from app.schemas.prompt_compare import (
    PromptComparisonItem,
    PromptComparisonResponse,
)
from app.schemas.benchmark import (
    BenchmarkItem,
    BenchmarkResponse,
)
from app.schemas.insights import (
    PromptInsight,
    EvaluationInsightsResponse,
)

def create_evaluation(
    db: Session,
    evaluation: EvaluationCreate,
    current_user: User,
):
    db_evaluation = Evaluation(
        **evaluation.model_dump(),
        created_by=current_user.id,
        status=EvaluationStatus.PENDING,
    )

    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)

    return db_evaluation


def get_all_evaluations(
    db: Session,
    status: str | None = None,
    project_id: int | None = None,
    dataset_id: int | None = None,
    model_id: int | None = None,
):
    query = db.query(Evaluation)

    if status:
        query = query.filter(
            Evaluation.status == EvaluationStatus(status)
        )

    if project_id:
        query = query.filter(
            Evaluation.project_id == project_id
        )

    if dataset_id:
        query = query.filter(
            Evaluation.dataset_id == dataset_id
        )

    if model_id:
        query = query.filter(
            Evaluation.model_id == model_id
        )

    return query.all()


def get_evaluation_by_id(
    db: Session,
    evaluation_id: int,
):
    return (
        db.query(Evaluation)
        .filter(Evaluation.id == evaluation_id)
        .first()
    )


def update_evaluation(
    db: Session,
    evaluation_id: int,
    evaluation: EvaluationUpdate,
):
    db_evaluation = get_evaluation_by_id(
        db,
        evaluation_id,
    )

    if not db_evaluation:
        return None

    update_data = evaluation.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_evaluation, key, value)

    db.commit()
    db.refresh(db_evaluation)

    return db_evaluation


def delete_evaluation(
    db: Session,
    evaluation_id: int,
):
    db_evaluation = get_evaluation_by_id(
        db,
        evaluation_id,
    )

    if not db_evaluation:
        return None

    db.delete(db_evaluation)
    db.commit()

    return db_evaluation


def run_evaluation(
    db: Session,
    evaluation_id: int,
):
    evaluation = (
        db.query(Evaluation)
        .filter(Evaluation.id == evaluation_id)
        .first()
    )

    if not evaluation:
        return None

    # Mark evaluation as running
    evaluation.status = EvaluationStatus.RUNNING
    evaluation.started_at = datetime.utcnow()

    db.commit()
    db.refresh(evaluation)

    # Load dataset prompts
    dataset_prompts = (
        db.query(DatasetPrompt)
        .filter(
            DatasetPrompt.dataset_id == evaluation.dataset_id
        )
        .all()
    )

    # Get connector
    connector = ConnectorFactory.get_connector(
        evaluation.model.provider.value
    )

    # Model selected in AI Models table
    model_id = evaluation.model.model_id

    total_prompts = len(dataset_prompts)
    passed_prompts = 0
    failed_prompts = 0

    total_latency = 0.0
    total_tokens = 0
    total_cost = 0.0

    for prompt in dataset_prompts:

        start_time = time.perf_counter()

        try:

            connector_response = connector.generate(
                model_id=model_id,
                prompt=prompt.prompt,
                context=prompt.context,
            )

            end_time = time.perf_counter()

            latency = end_time - start_time

            result = EvaluationResult(
                evaluation_id=evaluation.id,
                dataset_prompt_id=prompt.id,
                prompt=prompt.prompt,
                expected_answer=prompt.expected_answer,
                model_response=connector_response.response,
                score=1.0,
                passed=True,
                latency=latency,
                prompt_tokens=connector_response.prompt_tokens,
                completion_tokens=connector_response.completion_tokens,
                total_tokens=connector_response.total_tokens,
                estimated_cost=connector_response.estimated_cost,
                status="SUCCESS",
                error_message=None,
            )

            db.add(result)

            passed_prompts += 1
            total_latency += latency
            total_tokens += connector_response.total_tokens
            total_cost += connector_response.estimated_cost
            
        
        except Exception as e:
            import traceback

            error_message = traceback.format_exc()
            print("========================================")
            print("FULL ERROR:")
            print(error_message)
            print("========================================")

            end_time = time.perf_counter()
            latency = end_time - start_time

            result = EvaluationResult(
                evaluation_id=evaluation.id,
                dataset_prompt_id=prompt.id,
                prompt=prompt.prompt,
                expected_answer=prompt.expected_answer,
                model_response="",
                score=0.0,
                passed=False,
                latency=latency,
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost=0.0,
                status="FAILED",
                error_message=error_message,
            )

            db.add(result)

            failed_prompts += 1

    db.commit()

    average_latency = (
        total_latency / total_prompts
        if total_prompts > 0
        else 0
    )

    evaluation.total_prompts = total_prompts
    evaluation.passed_prompts = passed_prompts
    evaluation.failed_prompts = failed_prompts
    evaluation.average_latency = average_latency
    evaluation.total_tokens = total_tokens
    evaluation.total_cost = total_cost

    evaluation.status = (
        EvaluationStatus.COMPLETED
        if failed_prompts == 0
        else EvaluationStatus.FAILED
    )

    evaluation.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(evaluation)

    return {
        "evaluation": evaluation,
        "total_prompts": total_prompts,
        "passed_prompts": passed_prompts,
        "failed_prompts": failed_prompts,
    }

from app.schemas.metrics import EvaluationMetricsResponse


def get_evaluation_metrics(
    db: Session,
    evaluation_id: int,
):
    evaluation = (
        db.query(Evaluation)
        .filter(Evaluation.id == evaluation_id)
        .first()
    )

    if not evaluation:
        return None

    success_rate = (
        (evaluation.passed_prompts / evaluation.total_prompts) * 100
        if evaluation.total_prompts > 0
        else 0
    )

    return EvaluationMetricsResponse(
        evaluation_id=evaluation.id,
        total_prompts=evaluation.total_prompts,
        passed_prompts=evaluation.passed_prompts,
        failed_prompts=evaluation.failed_prompts,
        success_rate=round(success_rate, 2),
        average_latency=evaluation.average_latency,
        total_tokens=evaluation.total_tokens,
        total_cost=evaluation.total_cost,
    )

from app.schemas.metrics import ProjectMetricsResponse
from app.models.project import Project
from app.models.enums import EvaluationStatus


def get_project_metrics(
    db: Session,
    project_id: int,
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return None

    evaluations = project.evaluations

    total_evaluations = len(evaluations)

    completed = 0
    failed = 0

    total_latency = 0.0
    total_tokens = 0
    total_cost = 0.0
    total_success_rate = 0.0

    for evaluation in evaluations:

        if evaluation.status == EvaluationStatus.COMPLETED:
            completed += 1

        elif evaluation.status == EvaluationStatus.FAILED:
            failed += 1

        total_latency += evaluation.average_latency or 0
        total_tokens += evaluation.total_tokens or 0
        total_cost += evaluation.total_cost or 0

        if evaluation.total_prompts:
            total_success_rate += (
                evaluation.passed_prompts
                / evaluation.total_prompts
            ) * 100

    average_latency = (
        total_latency / total_evaluations
        if total_evaluations > 0
        else 0
    )

    average_success_rate = (
        total_success_rate / total_evaluations
        if total_evaluations > 0
        else 0
    )

    return ProjectMetricsResponse(
        project_id=project.id,
        total_evaluations=total_evaluations,
        completed_evaluations=completed,
        failed_evaluations=failed,
        average_latency=round(average_latency, 2),
        total_tokens=total_tokens,
        total_cost=round(total_cost, 4),
        average_success_rate=round(average_success_rate, 2),
    )

from app.models.ai_model import AIModel
from app.schemas.metrics import ProviderMetricsResponse


def get_provider_metrics(db: Session):

    models = db.query(AIModel).all()

    provider_metrics = []

    for model in models:

        evaluations = model.evaluations

        total = len(evaluations)
        completed = 0
        failed = 0

        latency = 0.0
        tokens = 0
        cost = 0.0
        success = 0.0

        for evaluation in evaluations:

            if evaluation.status == EvaluationStatus.COMPLETED:
                completed += 1

            elif evaluation.status == EvaluationStatus.FAILED:
                failed += 1

            latency += evaluation.average_latency or 0
            tokens += evaluation.total_tokens or 0
            cost += evaluation.total_cost or 0

            if evaluation.total_prompts:
                success += (
                    evaluation.passed_prompts
                    / evaluation.total_prompts
                ) * 100

        avg_latency = (
            latency / total
            if total > 0
            else 0
        )

        avg_success = (
            success / total
            if total > 0
            else 0
        )

        provider_metrics.append(

            ProviderMetricsResponse(
                provider=model.provider.value,
                total_evaluations=total,
                completed_evaluations=completed,
                failed_evaluations=failed,
                average_latency=round(avg_latency, 2),
                total_tokens=tokens,
                total_cost=round(cost, 4),
                average_success_rate=round(avg_success, 2),
            )

        )

    return provider_metrics

from app.models.project import Project
from app.models.dataset import Dataset
from app.models.ai_model import AIModel
from app.models.evaluation import Evaluation
from app.models.enums import EvaluationStatus

from app.schemas.metrics import DashboardMetricsResponse
from fastapi import HTTPException

from app.schemas.report import (
    EvaluationSummary,
    EvaluationResultReport,
    EvaluationReportResponse,
)


def get_dashboard_metrics(db: Session):

    total_projects = db.query(Project).count()
    total_models = db.query(AIModel).count()
    total_datasets = db.query(Dataset).count()
    total_evaluations = db.query(Evaluation).count()

    completed = (
        db.query(Evaluation)
        .filter(Evaluation.status == EvaluationStatus.COMPLETED)
        .count()
    )

    failed = (
        db.query(Evaluation)
        .filter(Evaluation.status == EvaluationStatus.FAILED)
        .count()
    )

    running = (
        db.query(Evaluation)
        .filter(Evaluation.status == EvaluationStatus.RUNNING)
        .count()
    )

    pending = (
        db.query(Evaluation)
        .filter(Evaluation.status == EvaluationStatus.PENDING)
        .count()
    )

    evaluations = db.query(Evaluation).all()

    total_tokens = 0
    total_cost = 0.0
    latency_sum = 0.0

    for evaluation in evaluations:
        total_tokens += evaluation.total_tokens or 0
        total_cost += evaluation.total_cost or 0
        latency_sum += evaluation.average_latency or 0

    average_latency = (
        latency_sum / total_evaluations
        if total_evaluations > 0
        else 0
    )

    provider_counts = {}

    models = db.query(AIModel).all()

    for model in models:
        provider = model.provider.value.upper()

        provider_counts[provider] = (
            provider_counts.get(provider, 0)
            + len(model.evaluations)
        )

    return DashboardMetricsResponse(
        total_projects=total_projects,
        total_models=total_models,
        total_datasets=total_datasets,
        total_evaluations=total_evaluations,
        completed_evaluations=completed,
        failed_evaluations=failed,
        running_evaluations=running,
        pending_evaluations=pending,
        total_tokens=total_tokens,
        total_cost=round(total_cost, 4),
        average_latency=round(average_latency, 2),
        providers=provider_counts,
    )

def get_evaluation_report(
    db: Session,
    evaluation_id: int,
):
    evaluation = (
        db.query(Evaluation)
        .filter(Evaluation.id == evaluation_id)
        .first()
    )

    if not evaluation:
        raise HTTPException(
            status_code=404,
            detail="Evaluation not found",
        )

    success_rate = (
        (evaluation.passed_prompts / evaluation.total_prompts) * 100
        if evaluation.total_prompts > 0
        else 0
    )

    summary = EvaluationSummary(
        total_prompts=evaluation.total_prompts,
        passed_prompts=evaluation.passed_prompts,
        failed_prompts=evaluation.failed_prompts,
        success_rate=round(success_rate, 2),
        average_latency=round(evaluation.average_latency or 0, 2),
        total_tokens=evaluation.total_tokens or 0,
        total_cost=round(evaluation.total_cost or 0, 4),
    )

    results = []

    for result in evaluation.results:
        results.append(
            EvaluationResultReport(
                prompt=result.prompt,
                expected_answer=result.expected_answer,
                model_response=result.model_response,
                score=result.score or 0.0,
                passed=result.passed if result.passed is not None else False,
                latency=result.latency or 0.0,
                total_tokens=result.total_tokens or 0,
            )
        )

    return EvaluationReportResponse(
        evaluation_id=evaluation.id,
        evaluation_name=evaluation.name,
        project_name=evaluation.project.name,
        dataset_name=evaluation.dataset.name,
        model_name=evaluation.model.name,
        status=evaluation.status.value,
        summary=summary,
        results=results,
    )

def get_evaluation_leaderboard(db: Session):
    evaluations = db.query(Evaluation).all()

    leaderboard = []

    for evaluation in evaluations:

        success_rate = (
            (evaluation.passed_prompts / evaluation.total_prompts) * 100
            if evaluation.total_prompts > 0
            else 0
        )

        leaderboard.append(
            {
                "evaluation": evaluation,
                "success_rate": success_rate,
            }
        )

    leaderboard.sort(
        key=lambda x: (
            -x["success_rate"],
            x["evaluation"].average_latency or 0,
        )
    )

    response = []

    for rank, item in enumerate(leaderboard, start=1):

        evaluation = item["evaluation"]

        response.append(
            EvaluationLeaderboardItem(
                rank=rank,
                evaluation_id=evaluation.id,
                evaluation_name=evaluation.name,
                project_name=evaluation.project.name,
                model_name=evaluation.model.name,
                provider=evaluation.model.provider.value,
                success_rate=round(item["success_rate"], 2),
                average_latency=round(
                    evaluation.average_latency or 0,
                    2,
                ),
                total_tokens=evaluation.total_tokens or 0,
                total_cost=round(
                    evaluation.total_cost or 0,
                    4,
                ),
            )
        )

    return EvaluationLeaderboardResponse(
        leaderboard=response
    )

def get_evaluation_analytics(db: Session):
    evaluations = db.query(Evaluation).all()

    total_evaluations = len(evaluations)

    completed = 0
    failed = 0
    running = 0
    pending = 0

    total_tokens = 0
    total_cost = 0.0
    total_latency = 0.0
    total_success_rate = 0.0

    provider_stats = {}

    for evaluation in evaluations:

        if evaluation.status == EvaluationStatus.COMPLETED:
            completed += 1
        elif evaluation.status == EvaluationStatus.FAILED:
            failed += 1
        elif evaluation.status == EvaluationStatus.RUNNING:
            running += 1
        elif evaluation.status == EvaluationStatus.PENDING:
            pending += 1

        total_tokens += evaluation.total_tokens or 0
        total_cost += evaluation.total_cost or 0
        total_latency += evaluation.average_latency or 0

        success_rate = (
            (evaluation.passed_prompts / evaluation.total_prompts) * 100
            if evaluation.total_prompts > 0
            else 0
        )

        total_success_rate += success_rate

        provider = evaluation.model.provider.value

        if provider not in provider_stats:
            provider_stats[provider] = {
                "success": 0.0,
                "count": 0,
            }

        provider_stats[provider]["success"] += success_rate
        provider_stats[provider]["count"] += 1

    average_success_rate = (
        total_success_rate / total_evaluations
        if total_evaluations > 0
        else 0
    )

    average_latency = (
        total_latency / total_evaluations
        if total_evaluations > 0
        else 0
    )

    best_provider = "N/A"
    best_score = -1

    for provider, stats in provider_stats.items():

        avg = stats["success"] / stats["count"]

        if avg > best_score:
            best_score = avg
            best_provider = provider

    return EvaluationAnalyticsResponse(
        total_evaluations=total_evaluations,
        completed_evaluations=completed,
        failed_evaluations=failed,
        running_evaluations=running,
        pending_evaluations=pending,
        average_success_rate=round(average_success_rate, 2),
        average_latency=round(average_latency, 2),
        total_tokens=total_tokens,
        total_cost=round(total_cost, 4),
        best_provider=best_provider,
    )

def get_evaluations_comparison(
    db: Session,
    ids: list[int],
):
    evaluations = (
        db.query(Evaluation)
        .filter(Evaluation.id.in_(ids))
        .all()
    )

    comparison = []

    for evaluation in evaluations:

        success_rate = (
            (evaluation.passed_prompts / evaluation.total_prompts) * 100
            if evaluation.total_prompts > 0
            else 0
        )

        comparison.append(
            EvaluationComparisonItem(
                evaluation_id=evaluation.id,
                evaluation_name=evaluation.name,
                project_name=evaluation.project.name,
                model_name=evaluation.model.name,
                provider=evaluation.model.provider.value,
                success_rate=round(success_rate, 2),
                average_latency=round(
                    evaluation.average_latency or 0,
                    2,
                ),
                total_prompts=evaluation.total_prompts,
                passed_prompts=evaluation.passed_prompts,
                failed_prompts=evaluation.failed_prompts,
                total_tokens=evaluation.total_tokens or 0,
                total_cost=round(
                    evaluation.total_cost or 0,
                    4,
                ),
            )
        )

    return EvaluationComparisonResponse(
        evaluations=comparison
    )

def compare_evaluation_prompts(
    db: Session,
    evaluation1_id: int,
    evaluation2_id: int,
):
    eval1_results = (
        db.query(EvaluationResult)
        .filter(EvaluationResult.evaluation_id == evaluation1_id)
        .order_by(EvaluationResult.id)
        .all()
    )

    eval2_results = (
        db.query(EvaluationResult)
        .filter(EvaluationResult.evaluation_id == evaluation2_id)
        .order_by(EvaluationResult.id)
        .all()
    )

    comparisons = []

    for r1, r2 in zip(eval1_results, eval2_results):

        score1 = r1.score or 0
        score2 = r2.score or 0

        if score1 > score2:
            winner = "Evaluation 1"
        elif score2 > score1:
            winner = "Evaluation 2"
        else:
            winner = "Tie"

        comparisons.append(
            PromptComparisonItem(
                prompt=r1.prompt,
                evaluation1_score=score1,
                evaluation2_score=score2,
                evaluation1_passed=r1.passed or False,
                evaluation2_passed=r2.passed or False,
                winner=winner,
            )
        )

    return PromptComparisonResponse(
        comparisons=comparisons
    )

from sqlalchemy import func


def get_model_benchmarks(db: Session):
    rows = (
        db.query(
            AIModel.name,
            AIModel.provider,
            func.count(Evaluation.id),
            func.avg(Evaluation.average_latency),
            func.sum(Evaluation.total_tokens),
            func.sum(Evaluation.total_cost),
            func.avg(
                (Evaluation.passed_prompts * 100.0)
                / func.nullif(Evaluation.total_prompts, 0)
            ),
        )
        .join(Evaluation, Evaluation.model_id == AIModel.id)
        .group_by(
            AIModel.id,
            AIModel.name,
            AIModel.provider,
        )
        .all()
    )

    models = []

    for row in rows:
        models.append(
            BenchmarkItem(
                model_name=row[0],
                provider=row[1].value,
                evaluations=row[2],
                average_latency=round(row[3] or 0, 2),
                total_tokens=row[4] or 0,
                total_cost=round(row[5] or 0, 4),
                average_success_rate=round(row[6] or 0, 2),
            )
        )

    models.sort(
        key=lambda x: (
            -x.average_success_rate,
            x.average_latency,
        )
    )

    return BenchmarkResponse(models=models)

def get_evaluation_insights(
    db: Session,
    evaluation_id: int,
):
    results = (
        db.query(EvaluationResult)
        .filter(EvaluationResult.evaluation_id == evaluation_id)
        .all()
    )

    if not results:
        return None

    average_score = (
        sum((r.score or 0) for r in results)
        / len(results)
    )

    passed = sum(
        1
        for r in results
        if r.passed
    )

    pass_rate = (passed / len(results)) * 100

    best = max(results, key=lambda r: r.score or 0)
    worst = min(results, key=lambda r: r.score or 0)

    fastest = min(results, key=lambda r: r.latency or 0)
    slowest = max(results, key=lambda r: r.latency or 0)

    return EvaluationInsightsResponse(
        average_score=round(average_score, 2),
        pass_rate=round(pass_rate, 2),

        best_prompt=PromptInsight(
            prompt=best.prompt,
            score=best.score or 0,
            latency=best.latency or 0,
        ),

        worst_prompt=PromptInsight(
            prompt=worst.prompt,
            score=worst.score or 0,
            latency=worst.latency or 0,
        ),

        fastest_prompt=PromptInsight(
            prompt=fastest.prompt,
            score=fastest.score or 0,
            latency=fastest.latency or 0,
        ),

        slowest_prompt=PromptInsight(
            prompt=slowest.prompt,
            score=slowest.score or 0,
            latency=slowest.latency or 0,
        ),
    )