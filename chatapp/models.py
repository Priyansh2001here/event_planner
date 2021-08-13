from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ChatMessage(models.Model):
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE)
    message = models.TextField()
    from_participant = models.ForeignKey('events.Participant', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
