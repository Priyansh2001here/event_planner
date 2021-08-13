from django.urls import path

from . import views

urlpatterns = [
    path('all/<int:event_id>', views.AllChatsView.as_view(), name='index'),
    path('message', views.SendMessage.as_view())
]
