from pydantic import BaseModel


class PromptComparisonItem(BaseModel):
    prompt: str

    evaluation1_score: float
    evaluation2_score: float

    evaluation1_passed: bool
    evaluation2_passed: bool

    winner: str


class PromptComparisonResponse(BaseModel):
    comparisons: list[PromptComparisonItem]