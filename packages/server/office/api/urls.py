from django.urls import path

from .views import ChatbotClientCreateView


urlpatterns = [
    path(
        'clients/',
        ChatbotClientCreateView.as_view(),
        name='chatbot-client-create',
    ),
]