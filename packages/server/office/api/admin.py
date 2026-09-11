from django.contrib import admin

from .models import ChatbotClient


@admin.register(ChatbotClient)
class ChatbotClientAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'phone',
        'created_at',
    )

    search_fields = (
        'name',
        'email',
        'phone',
    )

    list_filter = (
        'created_at',
    )

    ordering = (
        '-created_at',
    )

    readonly_fields = (
        'created_at',
        'updated_at',
    )


    