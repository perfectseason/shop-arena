from openai import OpenAI

from .config import (
    OPENAI_API_KEY,
    LLM_MODEL,
    LLM_TEMPERATURE,
    LLM_MAX_OUTPUT_TOKENS,
)
from .prompts import SYSTEM_INSTRUCTIONS


def generate_ai_response(
    prompt: str,
    knowledge: str,
    conversation_history: str = "",
) -> str:

    if not OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI(
        api_key=OPENAI_API_KEY,
    )

    knowledge_context = knowledge or (
        "No specific business knowledge was found."
    )

    history_context = conversation_history or (
        "No previous conversation."
    )

    user_input = f"""
BUSINESS KNOWLEDGE:

{knowledge_context}


PREVIOUS CONVERSATION:

{history_context}


CUSTOMER QUESTION:

{prompt}
"""

    response = client.responses.create(
        model=LLM_MODEL,
        instructions=SYSTEM_INSTRUCTIONS,
        input=user_input,
        temperature=LLM_TEMPERATURE,
        max_output_tokens=LLM_MAX_OUTPUT_TOKENS,
    )

    answer = response.output_text.strip()

    if not answer:
        raise RuntimeError(
            "The AI returned an empty response."
        )

    return answer

    # Send the following to the LLM:
    #
    # model
    # instructions
    # customer question
    # business knowledge
    # temperature
    # output token limit
