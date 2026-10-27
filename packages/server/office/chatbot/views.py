import logging
import uuid

from openai import APIConnectionError, AuthenticationError, RateLimitError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .models import Appointment
from .serializers import AppointmentSerializer
from .services.appointment_service import book_appointment

from .models import ChatConversation, ChatMessage
from .services.chat_service import process_chat_message
from .ai.config import OPENAI_API_KEY

# Django adds the `objects` manager to model classes at runtime.
# pylint: disable=no-member


logger = logging.getLogger(__name__)


class ChatView(APIView):
    def post(self, request):
        prompt = str(request.data.get("prompt", "")).strip()
        conversation_id = request.data.get("conversationId")

        if not prompt:
            return Response(
                {"message": "Please enter a message."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if conversation_id:
            try:
                conversation_uuid = uuid.UUID(str(conversation_id))
            except (ValueError, TypeError, AttributeError):
                return Response(
                    {"message": "Invalid conversation ID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            conversation, _ = ChatConversation.objects.get_or_create(
                conversation_id=conversation_uuid,
            )
        else:
            conversation = ChatConversation.objects.create()

        try:
            # Build context before persisting this turn. The current prompt is
            # supplied separately to the LLM and must not be repeated in history.
            bot_message = process_chat_message(
                prompt=prompt,
                conversation=conversation,
            )
        except Exception as error:
            logger.exception("Chatbot AI error")
            error_message = (
                "I'm sorry, I couldn't process your request right now. "
                "Please try again."
            )
            if not OPENAI_API_KEY:
                error_message = (
                    "The chatbot AI key is not configured on the server. "
                    "Please contact support."
                )
            elif isinstance(error, AuthenticationError):
                error_message = (
                    "The chatbot AI key was rejected. Please contact support."
                )
            elif isinstance(error, RateLimitError):
                error_message = (
                    "The chatbot AI service has reached its usage quota. "
                    "Please try again later."
                )
            elif isinstance(error, APIConnectionError):
                error_message = (
                    "The chatbot AI service is temporarily unreachable. "
                    "Please try again shortly."
                )
            return Response(
                {
                    "message": error_message,
                    "conversationId": str(conversation.conversation_id),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Persist both sides of the completed turn so later requests can
        # reconstruct the conversation context from the database.
        ChatMessage.objects.bulk_create(
            [
                ChatMessage(
                    conversation=conversation,
                    role="user",
                    content=prompt,
                ),
                ChatMessage(
                    conversation=conversation,
                    role="bot",
                    content=bot_message,
                ),
            ]
        )

        return Response(
            {
                "message": bot_message,
                "conversationId": str(conversation.conversation_id),
            },
            status=status.HTTP_200_OK,
        )


class ChatConversationDetailView(APIView):
    def get(self, _request, conversation_id):
        try:
            conversation_uuid = uuid.UUID(str(conversation_id))
        except (ValueError, TypeError, AttributeError):
            return Response(
                {"detail": "Invalid conversation ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation = ChatConversation.objects.filter(
            conversation_id=conversation_uuid,
        ).first()
        if conversation is None:
            return Response(
                {"detail": "Conversation not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        messages = ChatMessage.objects.filter(
            conversation=conversation,
        ).order_by("created_at", "pk")
        return Response(
            {
                "conversationId": str(conversation.conversation_id),
                "messages": [
                    {
                        "id": message.pk,
                        "role": message.role,
                        "content": message.content,
                        "created_at": message.created_at,
                    }
                    for message in messages
                ],
            },
            status=status.HTTP_200_OK,
        )


class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def create(self, request, *args, **kwargs):
        result = book_appointment(
            name=request.data.get("name"),
            email=request.data.get("email"),
            phone=request.data.get("phone", ""),
            service=request.data.get("service"),
            appointment_date=request.data.get("appointment_date"),
            appointment_time=request.data.get("appointment_time"),
            notes=request.data.get("notes", ""),
        )

        if not result["success"]:
            return Response(
                {
                    "success": False,
                    "message": result["message"],
                    "errors": result.get("errors", {}),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(result["appointment"])

        return Response(
            {
                "success": True,
                "message": "Appointment booked successfully.",
                "appointment": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    
