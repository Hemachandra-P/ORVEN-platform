from app.connectors.base_connector import BaseConnector
from app.connectors.mock_connector import MockConnector
from app.connectors.openai_connector import OpenAIConnector
from app.connectors.groq_connector import GroqConnector
from app.connectors.ollama_connector import OllamaConnector
from app.connectors.lmstudio_connector import LMStudioConnector



class ConnectorFactory:

    @staticmethod
    def get_connector(provider: str) -> BaseConnector:

        provider = provider.lower()

        connectors = {
            "mock": MockConnector,
            "openai": OpenAIConnector,
            "groq": GroqConnector,
            "ollama": OllamaConnector,
            "lmstudio": LMStudioConnector,
        }

        connector = connectors.get(provider)

        if connector is None:
            raise ValueError(f"Unsupported provider: {provider}")

        return connector()