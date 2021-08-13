from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import permissions as event_permissions
from . import serializers
from . import models


class CreateEventView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = models.Event

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance: models.Event = serializer.save()

        participant_instance = models.Participant(user=request.user, event=instance, is_host=True)
        participant_instance.save()

        return Response({
            'message': 'Event Creates Successfully',
            'id': instance.pk
        })

    def get_serializer(self, *args, **kwargs):
        return serializers.EventSerializer(*args, **kwargs, remove_fields=['amount_allocated', 'available_balance'],
                                           context=self.get_serializer_context())


# class GetAllEvents(generics.ListAPIView):
#     queryset = models.Event.objects.all()
#     serializer_class = serializers.EventSerializer

class GetUsersEvents(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        curr_user = self.request.user
        users_events = models.Event.objects.filter(participant__user_id=curr_user.id).distinct()
        return users_events

    def get_serializer(self, *args, **kwargs):
        return serializers.EventSerializer(*args, **kwargs, remove_fields=['participants_data'],
                                           context=self.get_serializer_context())


class Invitations(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.EventInvitationsSerializer

    def get_queryset(self):
        curr_user = self.request.user
        user_invites = models.EventInvitation.objects.filter(target_user_id=curr_user.id)
        return user_invites

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        is_participant = models.Participant.objects.filter(event_id=data['event'], user_id=data['target_user'])
        print(is_participant)
        if is_participant.exists():
            return Response({
                'message': 'User Already In Event'
            })
        self.perform_create(serializer)

        return Response({
            'message': 'Invite Sent'
        }, status=status.HTTP_201_CREATED)


class EventView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, event_permissions.IsParticipant]
    queryset = models.Event

    def get_serializer(self, *args, **kwargs):
        return serializers.EventSerializer(*args, **kwargs, remove_fields=['participants_detail'], context=self.get_serializer_context())


class AcceptInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        curr_user = request.user
        invite_id = request.data.get('id')
        # invite_id = self.kwargs.get('invite_id')
        invite_obj = get_object_or_404(models.EventInvitation, pk=invite_id, target_user=curr_user)
        event_obj = invite_obj.event
        new_participant = models.Participant(user=curr_user, event=event_obj, is_host=False)
        new_participant.save()
        invite_obj.delete()
        return Response({
            'message': 'Invitation accepted'
        })


class DeclineInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        curr_user = request.user
        invite_id = request.data.get('id')
        # invite_id = self.kwargs.get('invite_id')
        invite_obj = get_object_or_404(models.EventInvitation, pk=invite_id, target_user=curr_user)
        invite_obj.delete()
        return Response({
            'message': 'Invitation declined'
        })


class EventTasksView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.TasksListSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return models.Task.objects.filter(participant__event_id=event_id)


class AssignTaskView(generics.CreateAPIView):
    queryset = models.Task
    serializer_class = serializers.CreateTaskSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        curr_user = request.user

        data = serializer.data
        participant = data['participant']
        participant_obj = get_object_or_404(models.Participant, pk=participant)
        event_obj = get_object_or_404(models.Event, participant=participant_obj)

        is_host = event_obj.participant_set.filter(user=curr_user, is_host=True).exists()
        if is_host:
            return super(AssignTaskView, self).create(request, *args, **kwargs)
        return Response({
            'message': 'Invalid Request'
        }, status=status.HTTP_400_BAD_REQUEST)
