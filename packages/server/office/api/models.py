from django.db import models


class ChatbotClient(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Chatbot Client'
        verbose_name_plural = 'Chatbot Clients'

    def __str__(self):
        return f'{self.name} - {self.email}'
