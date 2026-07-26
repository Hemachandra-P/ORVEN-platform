from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.organizations import router as organizations_router
from app.api.v1.projects import router as projects_router
from app.api.v1.ai_models import router as ai_models_router
from app.api.v1.datasets import router as datasets_router
from app.api.v1.dataset_prompts import router as dataset_prompts_router
from app.api.v1.dataset_upload import router as dataset_upload_router
from app.api.v1.evaluations import router as evaluations_router
from app.api.v1.metrics import router as metrics_router
from app.api.v1.leaderboard import router as leaderboard_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.chat import router as chat_router
from app.api.v1.conversations import router as conversations_router
from app.api.v1.document import router as document_router
from app.api.v1.search import router as search_router


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Enterprise AI QA Automation Platform",
)

# -----------------------------
# CORS Middleware
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://orven-platform.vercel.app",
    ],
    # Also allow Vercel's preview-deployment URLs (e.g. per-branch/PR builds),
    # which follow the pattern https://orven-platform-<hash>-<team>.vercel.app
    allow_origin_regex=r"https://orven-platform.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(organizations_router)
app.include_router(projects_router)
app.include_router(ai_models_router)
app.include_router(datasets_router)
app.include_router(dataset_prompts_router)
app.include_router(dataset_upload_router)
app.include_router(evaluations_router)
app.include_router(metrics_router)
app.include_router(leaderboard_router)
app.include_router(analytics_router)
app.include_router(chat_router)
app.include_router(conversations_router)
app.include_router(document_router)
app.include_router(search_router)


@app.get("/")
def home():
    return {
        "project": settings.app_name,
        "status": "Backend Running 🚀",
        "version": settings.app_version,
    }
