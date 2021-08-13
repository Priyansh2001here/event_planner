from django.urls import path
from . import views

urlpatterns = [
    path('transact', views.MakeTransactionView.as_view()),
    path('set_limit', views.SetEventLimit.as_view()),
    path('bank_accounts', views.AddBankAccView.as_view()),
    path('event_transactions/<int:event_id>', views.EventTransactions.as_view()),
    path('third_party_transaction', views.ThirdPartyTransaction.as_view())
]
