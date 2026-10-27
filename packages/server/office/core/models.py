from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    def save(self, *args, **kwargs):
        self.email = self.email.strip().rstrip("?").strip()
        return super().save(*args, **kwargs)
