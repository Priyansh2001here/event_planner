from django.urls import path
from . import views

urlpatterns = [
    path('create', views.CreateEventView.as_view()),
    path('user_events', views.GetUsersEvents.as_view()),
    path('invites', views.Invitations.as_view()),
    path('<int:pk>', views.EventView.as_view()),
    path('accept_invite', views.AcceptInviteView.as_view()),
    path('decline_invite', views.DeclineInviteView.as_view()),
    path('tasks/<int:event_id>', views.EventTasksView.as_view()),
    path('assign_task', views.AssignTaskView.as_view())
]
