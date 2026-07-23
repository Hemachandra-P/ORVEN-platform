from openai import OpenAI

from app.connectors.base_connector import BaseConnector
from app.connectors.connector_response import ConnectorResponse
from app.core.config import settings


class LMStudioConnector(BaseConnector):

    def __init__(self):
        self.client = OpenAI(
            api_key="lmstudio",
            base_url=settings.lmstudio_base_url,
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

        return ConnectorResponse(
    response=response.choices[0].message.content,
    prompt_tokens=0,
    completion_tokens=0,
    total_tokens=0,
    estimated_cost=0.0,
    )