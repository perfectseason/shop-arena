from rest_framework import serializers

from chatbot.models import ChatConversation, ChatMessage


# chatbot
class ChatMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "role",
            "content",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class ChatConversationSerializer(serializers.ModelSerializer):

    messages = ChatMessageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = ChatConversation

        fields = [
            "id",
            "conversation_id",
            "messages",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "conversation_id",
            "messages",
            "created_at",
            "updated_at",
        ]
