from enum import Enum


class AIProvider(str, Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    GROQ = "groq"
    HUGGINGFACE = "huggingface"
    OPENROUTER = "openrouter"
    OLLAMA = "ollama"
    LMSTUDIO = "lmstudio"
    MOCK = "mock"

class DatasetType(str, Enum):
    QA = "QA"
    RAG = "RAG"
    CHATBOT = "CHATBOT"
    AGENT = "AGENT"
    MULTIMODAL = "MULTIMODAL"
    CUSTOM = "CUSTOM"


class DatasetCreationMethod(str, Enum):
    AI_GENERATED = "AI_GENERATED"
    MANUAL = "MANUAL"
    UPLOADED = "UPLOADED"


class DatasetStatus(str, Enum):
    CREATING = "CREATING"
    READY = "READY"
    PROCESSING = "PROCESSING"
    FAILED = "FAILED"

from enum import Enum


class EvaluationStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"