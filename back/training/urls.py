from django.urls import path
from . import views

urlpatterns = [
    path('training/', views.training, name='training'),
]
