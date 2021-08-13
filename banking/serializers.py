from rest_framework import serializers
from . import models


class ParticipantAmountUpdate(serializers.Serializer):
    amount = serializers.IntegerField()
    event_id = serializers.IntegerField()


class TransactionSerializer(serializers.Serializer):
    fromBankAcc = serializers.IntegerField()
    toUser = serializers.IntegerField()
    amount = serializers.IntegerField()
    event_id = serializers.IntegerField()
    task_id = serializers.IntegerField(required=False)


class EventTransactionsListSerializer(serializers.ModelSerializer):
    to_user = serializers.SerializerMethodField()
    from_user = serializers.SerializerMethodField()
    task_name = serializers.SerializerMethodField()

    from_account = serializers.SerializerMethodField()
    to_account = serializers.SerializerMethodField()

    class Meta:
        model = models.Transaction
        fields = ['id', 'to_user', 'from_user', 'amount', 'timestamp', 'task_name', 'from_account', 'to_account']

    def get_to_user(self, instance: Meta.model):
        return instance.toBankAcc.user.full_name

    def get_from_user(self, instance: Meta.model):
        return instance.fromBankAcc.user.full_name

    def get_task_name(self, instance: Meta.model):
        task_obj = instance.task
        return task_obj.title if task_obj else instance.toBankAcc.user.full_name

    def get_from_account(self, instance: Meta.model):
        return {
            "bank_name": instance.fromBankAcc.bank,
            "account_number": instance.fromBankAcc.accountNumber
        }

    def get_to_account(self, instance: Meta.model):
        return {
            "bank_name": instance.toBankAcc.bank,
            "account_number": instance.toBankAcc.accountNumber
        }
class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BankAccount
        fields = ['id', 'accountNumber', 'IFSCCode', 'UPIID', 'bank']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super(BankAccountSerializer, self).create(validated_data)

class ThirdPartyTransactionSerializer(serializers.ModelSerializer):
    from_account = serializers.SerializerMethodField()

    class Meta:
        model = models.ThirdPartyTransaction
        fields = ['id', 'from_account', 'amount', 'toUpiID', 'amount', 'timestamp']

    def get_from_account(self, instance: Meta.model):
        return {
            "bank_name": instance.fromBankAcc.bank,
            "account_number": instance.fromBankAcc.accountNumber
        }

class CreateThirdPartyTrascSerializer(serializers.Serializer):
    from_acc = serializers.IntegerField()
    amount = serializers.IntegerField()
    event_id = serializers.IntegerField()
    task_id = serializers.IntegerField(required=False)
    upi_id = serializers.CharField(max_length=50)