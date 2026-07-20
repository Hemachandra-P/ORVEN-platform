from fastapi import FastAPI

app = FastAPI(
    title="NeuroStack API",
    description="Enterprise AI QA Automation Platform",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "project": "NeuroStack",
        "status": "Backend Running 🚀",
        "version": "1.0.0"
    }