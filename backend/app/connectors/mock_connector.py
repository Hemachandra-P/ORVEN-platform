from app.connectors.base_connector import BaseConnector


class MockConnector(BaseConnector):
    """
    Mock connector used for development and testing.
    """

    def generate(
        self,
        prompt: str,
        context: str | None = None,
    ) -> str:
        return f"Simulated response for: {prompt}"