from chatbot.ai.llm import generate_ai_response
from chatbot.ai.rag import get_relevant_knowledge
from chatbot.ai.config import MAX_HISTORY_MESSAGES
from chatbot.models import ChatConversation


def get_conversation_history(
    conversation: ChatConversation,
) -> str:

    messages = conversation.messages.order_by(
        "-created_at",
        "-id",
    )[:MAX_HISTORY_MESSAGES]

    messages = reversed(list(messages))

    history = []

    for message in messages:
        role = (
            "Customer"
            if message.role == "user"
            else "Assistant"
        )

        history.append(
            f"{role}: {message.content}"
        )

    return "\n".join(history)


def process_chat_message(
    prompt: str,
    conversation: ChatConversation,
) -> str:

    knowledge = get_relevant_knowledge(
        prompt
    )

    history = get_conversation_history(
        conversation
    )

    answer = generate_ai_response(
        prompt=prompt,
        knowledge=knowledge,
        conversation_history=history,
    )

    return answer
