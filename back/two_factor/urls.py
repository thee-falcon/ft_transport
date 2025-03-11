from django.urls import path
from .views import send_code, verify_code, ProtectedView

urlpatterns = [
    path('send-code/', send_code, name='send_code'),
    path('verify-code/', verify_code, name='verify_code'),
    path('protected/', ProtectedView.as_view(), name='protected'),
]
