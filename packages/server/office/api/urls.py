from django.contrib import admin
from django.urls import path

from .views import ChatbotClientCreateView

admin.site.site_header = "Shop Arena Admin Portal"
admin.site.site_title = "Admin Portal"


urlpatterns = [
    path('admin/', admin.site.urls),

    path(
        'clients/',
        ChatbotClientCreateView.as_view(),
        name='chatbot-client-create',
    ),
]