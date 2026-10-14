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

    created_at = models.DateTimeField( auto_now_add=True,)

    updated_at = models.DateTimeField( auto_now=True, )

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

    conversation = models.ForeignKey( ChatConversation, on_delete=models.CASCADE, related_name="messages", )

    role = models.CharField( max_length=10, choices=ROLE_CHOICES, )

    content = models.TextField()

    created_at = models.DateTimeField( auto_now_add=True, )

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Chat Message"
        verbose_name_plural = "Chat Messages"

    def __str__(self):
        content = str(self.content or "")
        return f"{self.role}: {content[:50]}"
    




# ---------------------------------------------------------------

# APPOINTMENT BOOKING
# -------------------------------------------------------------------


from django.db import models


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    service = models.CharField(max_length=150)

    appointment_date = models.DateField()
    appointment_time = models.TimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="confirmed",
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["appointment_date", "appointment_time"]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "appointment_date",
                    "appointment_time",
                ],
                condition=models.Q(status="confirmed"),
                name="unique_confirmed_appointment_slot",
            )
        ]

    def __str__(self):
        return (
            f"{self.name} - "
            f"{self.service} - "
            f"{self.appointment_date} "
            f"{self.appointment_time}"
        )
    