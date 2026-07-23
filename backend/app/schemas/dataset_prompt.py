from pydantic import BaseModel


class DatasetPromptCreate(BaseModel):
    dataset_id: int
    prompt: str
    context: str | None = None
    expected_answer: str | None = None
    category: str | None = None
    difficulty: str | None = None
    language: str = "English"
    prompt_metadata: dict | None = None


class DatasetPromptUpdate(BaseModel):
    prompt: str | None = None
    context: str | None = None
    expected_answer: str | None = None
    category: str | None = None
    difficulty: str | None = None
    language: str | None = None
    prompt_metadata: dict | None = None


class DatasetPromptResponse(BaseModel):
    id: int
    dataset_id: int
    prompt: str
    context: str | None
    expected_answer: str | None
    category: str | None
    difficulty: str | None
    language: str
    prompt_metadata: dict | None

    model_config = {
        "from_attributes": True
    }