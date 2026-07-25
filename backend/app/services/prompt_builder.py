from typing import List


class PromptBuilder:
    """
    Builds prompts for Retrieval-Augmented Generation (RAG).
    """

    @staticmethod
    def build(question: str, context_chunks: List[str]) -> str:
        context = "\n\n".join(context_chunks)

        return f"""You are NeuroStack AI, an enterprise AI assistant.

Answer the user's question ONLY using the provided context.

Rules:
- Do not make up information.
- If the answer is not present in the context, respond:
  "I couldn't find the answer in the uploaded documents."
- Keep answers concise and accurate.
- Use bullet points where appropriate.

======================
CONTEXT
======================

{context}

======================
QUESTION
======================

{question}

======================
ANSWER
======================
"""