from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Task(models.Model):
    title = models.CharField(max_length=100)
    participant = models.ForeignKey('Participant', on_delete=models.CASCADE)
    due_date = models.DateField()

    is_completed = models.BooleanField(default=False)

    amount_allocated = models.PositiveIntegerField(default=0)
    available_balance = models.PositiveIntegerField(default=0)

    timestamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)


class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey('Event', on_delete=models.CASCADE)
    is_host = models.BooleanField(default=False)
    available_amount = models.PositiveIntegerField(default=0)

    timestamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'event')


class Event(models.Model):
    types = (
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('4', '4'),
        ('5', '5'),
        ('6', '6')
    )

    image = models.FileField()
    title = models.TextField()
    type_of_event = models.CharField(choices=types, max_length=10)
    end_date = models.DateField()
    venue = models.CharField(max_length=50)

    amount_allocated = models.PositiveIntegerField(default=0)
    available_balance = models.PositiveIntegerField(default=0)

    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-id', )


class EventInvitation(models.Model):
    event = models.ForeignKey('Event', on_delete=models.CASCADE)
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='target_user')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='from_user')
