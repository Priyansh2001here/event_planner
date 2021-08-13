from django.urls import path
from . import views

urlpatterns = [
    path('register', views.Register.as_view()),
    path('update', views.ProfileUpdateView.as_view()),
    path('login', views.LoginView.as_view()),
    path('search_users', views.UserSearchView.as_view()),
    path('logout', views.LogoutView.as_view())
]
