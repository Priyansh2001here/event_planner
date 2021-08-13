from rest_framework import serializers, exceptions
from .models import ChatMessage
from events.models import Event


class ChatMessagesSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    by_you = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'timestamp', 'message', 'from_user', 'by_you']

    def get_from_user(self, instance: Meta.model):
        return instance.from_participant.user.full_name

    def get_by_you(self, instance: Meta.model):
        request = self.context.get('request')
        curr_user = request.user.id
        return instance.from_participant.user_id == curr_user


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['event', 'message']

    def create(self, validated_data):
        request = self.context.get('request')
        curr_user = request.user.id
        event_id = validated_data['event']
        event_obj = Event.objects.get(pk=event_id.id)

        is_participant = event_obj.participant_set.filter(user=curr_user)

        if is_participant.exists():
            validated_data['from_participant'] = is_participant.first()
            return super(ChatMessageCreateSerializer, self).create(validated_data)
        else:
            raise exceptions.NotAcceptable
