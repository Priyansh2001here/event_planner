from django.contrib import auth
from django.db import models
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers

User = auth.get_user_model()


class Register(generics.CreateAPIView):
    queryset = User.objects.all()

    def get_serializer(self, *args, **kwargs):
        return serializers.UserSerializer(*args, **kwargs, remove_fields=['prof_img'],
                                          context=self.get_serializer_context())


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return serializers.UserSerializer(*args, **kwargs, remove_fields=['password'],
                                          context=self.get_serializer_context())

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            del request.data['email']
        except KeyError as _:
            pass
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "mobile number updated successfully"})

        else:
            return Response({"message": "failed", "details": serializer.errors})

    def get_object(self):
        return self.request.user


class LoginView(views.APIView):
    permission_classes = [~permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serialized_data = serializers.UserLoginSerializer(data=request.data)
        if serialized_data.is_valid(raise_exception=True):

            user = auth.authenticate(request, **serialized_data.data)

            if user is not None:
                auth.login(request, user)
                # user_serialized = UserSerializer(user)

                # return Response(data=user_serialized.data, status=status.HTTP_200_OK)
                return Response({
                    'message': 'Logged In',
                    'full_name': user.full_name
                },status=status.HTTP_200_OK)
            return Response(data={
                'message': 'invalid credentials'
            }, status=status.HTTP_404_NOT_FOUND)


class UserSearchView(APIView):

    def get(self, request):
        query = request.query_params.get('search')
        if query is None:
            users = User.objects.all()
        else:
            users = User.objects.filter(models.Q(full_name__icontains=query) | models.Q(email__icontains=query))
        return Response(serializers.UsersListSerializer(users, many=True).data)


class LogoutView(APIView):

    def get(self, request):
        auth.logout(request)
        return Response({
            'message': 'Logged out'
        })