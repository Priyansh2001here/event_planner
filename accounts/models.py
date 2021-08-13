from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password, is_active=True, is_staff=False, is_admin=False):
        if not email:
            raise ValueError("Users must have an email address")
        if not password:
            raise ValueError("Users must have a password")
        user_obj = self.model(
            email=self.normalize_email(email),
            full_name=full_name
        )
        user_obj.set_password(password)
        user_obj.staff = is_staff
        user_obj.admin = is_admin
        user_obj.active = is_active
        user_obj.save(using=self._db)
        return user_obj

    def create_staffuser(self, email, full_name=None, password=None):
        user = self.create_user(
            email,
            full_name=full_name,
            password=password,
            is_staff=True
        )
        return user

    def create_superuser(self, email, full_name=None, password=None):
        user = self.create_user(
            email,
            full_name=full_name,
            password=password,
            is_staff=True,
            is_admin=True
        )
        return user


class EventUser(AbstractBaseUser):
    # providers = (
    #     ('Google', 'Google'),
    #     ('Facebook', 'Facebook')
    # )

    email = models.EmailField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True, default='User')
    is_active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    whatsappNo = models.CharField(max_length=12)

    prof_img = models.ImageField(blank=True, upload_to='accounts/profile_img',
                                 default='/defaults/default_profile_image.png')


    # provider = models.CharField(
    #     choices=providers,
    #     max_length=8,
    #     null=True,
    #     blank=True
    # )

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return self.full_name

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin
