from rest_framework import permissions

from . import models


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class IsParticipant(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: models.Event):
        curr_user = request.user
        is_participant = obj.participant_set.filter(user=curr_user).exists()
        return is_participant

class IsHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj: models.Event):
        curr_user = request.user
        is_participant = obj.participant_set.filter(user=curr_user, is_host=True).exists()
        return is_participant
