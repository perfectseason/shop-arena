import uuid

from django.db import models


# ============================================================
# CHAT CONVERSATION
# ============================================================

class ChatConversation(models.Model):
    conversation_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        db_index=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Chat Conversation"
        verbose_name_plural = "Chat Conversations"

    def __str__(self):
        return str(self.conversation_id)


# ============================================================
# CHAT MESSAGE
# ============================================================

class ChatMessage(models.Model):

    ROLE_CHOICES = (
        ("user", "User"),
        ("bot", "Bot"),
    )

    conversation = models.ForeignKey(
        ChatConversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Chat Message"
        verbose_name_plural = "Chat Messages"

    def __str__(self):
        content = str(self.content or "")
        return f"{self.role}: {content[:50]}"