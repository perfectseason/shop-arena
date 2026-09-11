from rest_framework import serializers

from .models import ChatbotClient


class ChatbotClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotClient
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]

    def validate_name(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                'Name must be at least 3 characters long.'
            )

        return value

    def validate_phone(self, value):
        value = value.strip()

        if len(value) < 10:
            raise serializers.ValidationError(
                'Phone number must be at least 10 characters long.'
            )

        return value