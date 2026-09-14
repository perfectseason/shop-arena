from django.contrib import admin
from . import models
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


admin.site.register(models.Collection)

admin.site.register(models.Customer)
admin.site.register(models.Order)
admin.site.register(models.OrderItem)
admin.site.register(models.Address)
admin.site.register(models.ChatBotForm)

