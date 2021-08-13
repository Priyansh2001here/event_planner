from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class BankAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    accountNumber = models.CharField(max_length=18, unique=True)
    IFSCCode = models.CharField(max_length=11)
    UPIID = models.CharField(max_length=50, unique=True)
    bank = models.CharField(max_length=50)


class Transaction(models.Model):
    fromBankAcc = models.ForeignKey(BankAccount, on_delete=models.SET_NULL, null=True, related_name='from_account')
    toBankAcc = models.ForeignKey(BankAccount, on_delete=models.SET_NULL, null=True, related_name='to_account')
    amount = models.PositiveIntegerField(blank=False, null=False)

    event = models.ForeignKey('events.Event', on_delete=models.SET_NULL, null=True)
    task = models.ForeignKey('events.Task', on_delete=models.SET_NULL, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-id',)


class ThirdPartyTransaction(models.Model):
    fromBankAcc = models.ForeignKey(BankAccount, on_delete=models.SET_NULL, null=True)
    toUpiID = models.CharField(max_length=50)
    amount = models.PositiveIntegerField()

    event = models.ForeignKey('events.Event', on_delete=models.SET_NULL, null=True)
    task = models.ForeignKey('events.Task', on_delete=models.SET_NULL, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
