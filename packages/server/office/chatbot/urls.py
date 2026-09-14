from django.urls import path

from .views import (
    ChatConversationDetailView,
    ChatView,
)


# chatbot
urlpatterns = [
    path(
        "chat/",
        ChatView.as_view(),
        name="chat",
    ),

    path(
        "chat/<uuid:conversation_id>/",
        ChatConversationDetailView.as_view(),
        name="chat-conversation-detail",
    ),
]
