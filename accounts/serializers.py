from django.contrib.auth import get_user_model, login
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

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
        model = User
        fields = ['id', 'full_name', 'email', 'password', 'prof_img', 'whatsappNo']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            del ret['password']
        except KeyError as _:
            pass
        return ret

    def validate_password(self, password):

        if len(password) < 8:
            raise ValidationError()

        return password

    def validate_username(self, username):

        if len(username) < 6:
            raise ValidationError()

        return username

    def create(self, validated_data):
        user_obj = User.objects.create(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
        )
        user_obj.set_password(validated_data['password'])
        user_obj.save()
        login(self.context.get('request'), user_obj)
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        password = attrs.get('password')

        if len(password) <= 7:
            raise ValidationError('Password with length of 8 or more')

        return attrs


class UsersListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'prof_img']
