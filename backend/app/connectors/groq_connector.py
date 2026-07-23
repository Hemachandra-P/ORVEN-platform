from groq import Groq

from app.connectors.base_connector import BaseConnector
from app.connectors.connector_response import ConnectorResponse
from app.core.config import settings


class GroqConnector(BaseConnector):

    def __init__(self):
        self.client = Groq(
            api_key=settings.groq_api_key,
        )

    def generate(
        self,
        model_id: str,
        prompt: str,
        context: str | None = None,
    ) -> ConnectorResponse:

        messages = []

        if context:
            messages.append(
                {
                    "role": "system",
                    "content": context,
                }
            )

        messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

        response = self.client.chat.completions.create(
            model=model_id,
            messages=messages,
        )

        usage = response.usage

        return ConnectorResponse(
            response=response.choices[0].message.content,
            prompt_tokens=usage.prompt_tokens,
            completion_tokens=usage.completion_tokens,
            total_tokens=usage.total_tokens,
            estimated_cost=0.0,
        )