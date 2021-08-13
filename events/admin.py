from django.contrib import admin
from . import models

admin.register(models.Event, models.Participant, models.Task, models.EventInvitation)(admin.ModelAdmin)
