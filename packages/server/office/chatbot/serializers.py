from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "service",
            "appointment_date",
            "appointment_time",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        appointment_date = attrs.get("appointment_date")
        appointment_time = attrs.get("appointment_time")

        if Appointment.objects.filter(
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status="confirmed",
        ).exists():
            raise serializers.ValidationError(
                {
                    "appointment_time": (
                        "This appointment time is already booked. "
                        "Please choose another time."
                    )
                }
            )

        return attrs
    