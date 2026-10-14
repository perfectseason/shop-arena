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



from .appointment_service import book_appointment


def execute_appointment_booking(appointment_data):
    """
    Executes the appointment booking only after
    the visitor has confirmed the appointment.
    """

    result = book_appointment(
        name=appointment_data["name"],
        email=appointment_data["email"],
        phone=appointment_data.get("phone", ""),
        service=appointment_data["service"],
        appointment_date=appointment_data["appointment_date"],
        appointment_time=appointment_data["appointment_time"],
        notes=appointment_data.get("notes", ""),
    )

    if not result["success"]:
        return {
            "success": False,
            "message": result["message"],
            "errors": result.get("errors", {}),
        }

    appointment = result["appointment"]

    return {
        "success": True,
        "message": (
            f"Appointment confirmed successfully for "
            f"{appointment.name} on "
            f"{appointment.appointment_date} at "
            f"{appointment.appointment_time}."
        ),
        "appointment_id": appointment.id,
    }

