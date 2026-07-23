from abc import ABC, abstractmethod

from app.connectors.connector_response import ConnectorResponse


class BaseConnector(ABC):
    """
    Base class for all AI provider connectors.
    Every connector must implement generate().
    """

    @abstractmethod
    def generate(
        self,
        model_id: str,
        prompt: str,
        context: str | None = None,
    ) -> ConnectorResponse:
        """
        Generate a response from the specified model.
        """
        pass