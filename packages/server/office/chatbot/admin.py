from django.contrib import admin

from .models import (
    ChatConversation,
    ChatMessage,
)
from .models import Appointment



# chatbot
class ChatMessageInline(admin.TabularInline):

    model = ChatMessage

    extra = 0

    readonly_fields = (
        "role",
        "content",
        "created_at",
    )

    ordering = (
        "created_at",
    )


@admin.register(ChatConversation)
class ChatConversationAdmin(
    admin.ModelAdmin
):

    list_display = (
        "conversation_id",
        "message_count",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "conversation_id",
        "messages__content",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "conversation_id",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-updated_at",
    )

    inlines = [
        ChatMessageInline
    ]

    @admin.display(
        description="Messages"
    )
    def message_count(self, obj):
        return obj.messages.count()


@admin.register(ChatMessage)
class ChatMessageAdmin(
    admin.ModelAdmin
):

    list_display = (
        "id",
        "conversation",
        "role",
        "short_content",
        "created_at",
    )

    search_fields = (
        "content",
        "conversation__conversation_id",
    )

    list_filter = (
        "role",
        "created_at",
    )

    readonly_fields = (
        "conversation",
        "role",
        "content",
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    @admin.display(
        description="Message"
    )
    def short_content(self, obj):
        return obj.content[:80]
    


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "service",
        "appointment_date",
        "appointment_time",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "service",
        "appointment_date",
    )

    search_fields = (
        "name",
        "email",
        "phone",
        "service",
    )

    ordering = (
        "appointment_date",
        "appointment_time",
    )
    