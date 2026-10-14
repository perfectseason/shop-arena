from django.db import IntegrityError, transaction

from ..models import Appointment
from ..serializers import AppointmentSerializer


def book_appointment(
    *,
    name,
    email,
    phone,
    service,
    appointment_date,
    appointment_time,
    notes="",
):
    """
    Creates an appointment after the visitor has confirmed
    the appointment details.

    Returns:
        {
            "success": True,
            "appointment": Appointment instance,
            "message": "..."
        }

    or

        {
            "success": False,
            "errors": {...},
            "message": "..."
        }
    """

    data = {
        "name": name,
        "email": email,
        "phone": phone,
        "service": service,
        "appointment_date": appointment_date,
        "appointment_time": appointment_time,
        "notes": notes,
    }

    serializer = AppointmentSerializer(data=data)

    if not serializer.is_valid():
        return {
            "success": False,
            "errors": serializer.errors,
            "message": "The appointment could not be booked.",
        }

    try:
        with transaction.atomic():
            appointment = serializer.save()

    except IntegrityError:
        return {
            "success": False,
            "errors": {
                "appointment_time": [
                    "This appointment time has already been booked."
                ]
            },
            "message": (
                "Sorry, that appointment time is no longer available."
            ),
        }

    return {
        "success": True,
        "appointment": appointment,
        "message": "Appointment booked successfully.",
    }

