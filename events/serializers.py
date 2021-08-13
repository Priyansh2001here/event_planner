from rest_framework import serializers
from . import models
from django.db.models import F


class ParticipantSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):

        """
        :param kwargs: set remove_fields to dynamically remove default fields of serializer
        """

        remove_fields = kwargs.pop('remove_fields', None)

        super().__init__(*args, **kwargs)

        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    class Meta:
        model = models.Participant
        fields = ['id', 'is_host', 'full_name', 'available_amount']
        read_only_fields = ['available_amount', 'full_name']

    def get_full_name(self, instance: Meta.model):
        return instance.user.full_name


class EventSerializer(serializers.ModelSerializer):
    participants_data = serializers.SerializerMethodField()
    participants_detail = serializers.SerializerMethodField()
    is_host = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):

        """
        :param kwargs: set remove_fields to dynamically remove default fields of serializer
        """

        remove_fields = kwargs.pop('remove_fields', None)

        super().__init__(*args, **kwargs)

        if remove_fields:
            for remove_field in remove_fields:
                self.fields.pop(remove_field)

    class Meta:
        model = models.Event
        fields = ['id', 'image', 'title', 'type_of_event', 'end_date', 'venue', 'amount_allocated',
                  'available_balance'] + [
                     'participants_data', 'participants_data', 'participants_detail', 'is_host', 'owner_name']

    def get_participants_data(self, instance: Meta.model):
        event_participants = models.Participant.objects.filter(event=instance)
        return ParticipantSerializer(event_participants, many=True).data

    def get_participants_detail(self, instance: Meta.model):
        participants = models.Participant.objects.filter(event=instance)
        participants_count = participants.count()

        if participants_count <= 3:
            participants_details = participants.annotate(full_name=F('user__full_name'), prof_img=F('user__prof_img')) \
                .values('full_name', 'prof_img')

        else:
            participants_details = participants.annotate(full_name=F('user__full_name'), prof_img=F('user__prof_img')) \
                                       .values('full_name', 'prof_img')[:3]

        return {
            'participants': participants_details,
            'count': participants_count
        }

    def get_is_host(self, instance: Meta.model):
        request = self.context.get('request')
        user = request.user
        return instance.participant_set.filter(user=user, is_host=True).exists()

    def get_owner_name(self, instance: Meta.model):
        if instance.owner:
            return instance.owner.full_name
        else:
            return 'User Deleted'

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['owner'] = request.user
        return super(EventSerializer, self).create(validated_data)


class EventInvitationsSerializer(serializers.ModelSerializer):
    event_detail = serializers.SerializerMethodField()
    sender = serializers.SerializerMethodField()

    class Meta:
        model = models.EventInvitation
        fields = ['id', 'event', 'target_user', 'event_detail',
                  'sender']

    def validate(self, attrs):
        request = self.context.get('request')
        if attrs['target_user'].pk == request.user.pk:
            raise serializers.ValidationError('You cant invite yourself')

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['from_user'] = request.user
        does_exist = models.EventInvitation.objects.filter(target_user_id=validated_data['target_user'],
                                                           event_id=validated_data['event'])

        is_participant = models.Participant.objects.filter(event_id=validated_data['event'], user_id=request.user)

        # if is_participant.exists():
        #     raise

        if does_exist.exists():
            return does_exist.first()

        return super(EventInvitationsSerializer, self).create(validated_data)

    def get_event_detail(self, instance: Meta.model):
        event_obj = instance.event
        event_image = event_obj.image
        return {'title': event_obj.title, 'image': event_image.url if event_obj.image else None}

    def get_sender(self, instance: Meta.model):
        return instance.from_user.full_name


class TasksListSerializer(serializers.ModelSerializer):
    assigned_to = serializers.SerializerMethodField()

    class Meta:
        model = models.Task
        fields = ['id', 'title', 'is_completed', 'assigned_to', 'timestamp', 'due_date', 'amount_allocated', 'available_balance']

    def get_assigned_to(self, instance: Meta.model):
        instance_participant_user = instance.participant.user
        prof_img = instance_participant_user.prof_img
        return {
            'prof_img': prof_img.url if prof_img else None,
            'full_name': instance_participant_user.full_name
        }

    # def create(self, validated_data):
    #     request = self.context.get('request')
    #     event_obj = models.Event.objects.filter(participant__is_host=True, participant__user=request.user)
    #     if not event_obj.exists():
    #         raise serializers.ValidationError('Current User is not a host')
    #     return super(TasksListSerializer, self).create(validated_data)


class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Task
        fields = ['title', 'participant', 'due_date']
