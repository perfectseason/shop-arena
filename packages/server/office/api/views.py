from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from chatbot.models import ChatConversation
from chatbot.services.chat_service import process_chat_message
from .serializers import ChatConversationSerializer


class ChatbotClientCreateView(generics.CreateAPIView):
    queryset = ChatConversation.objects.all()
    serializer_class = ChatConversationSerializer

    # chatbot


class ChatView(APIView):

    def post(self, request):

        prompt = str(
            request.data.get(
                "prompt",
                "",
            )
        ).strip()

        if not prompt:
            return Response(
                {
                    "message": "Please enter a message."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        answer = process_chat_message(
            prompt=prompt,
        )

        return Response(
            {
                "message": answer
            },
            status=status.HTTP_200_OK,
        )
