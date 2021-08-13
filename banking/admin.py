from django.contrib import admin
from . import models

admin.register(models.BankAccount, models.Transaction, models.ThirdPartyTransaction)(admin.ModelAdmin)