from rest_framework import generics

from .models import ChatbotClient
from .serializers import ChatbotClientSerializer


class ChatbotClientCreateView(generics.CreateAPIView):
    queryset = ChatbotClient.objects.all()
    serializer_class = ChatbotClientSerializer