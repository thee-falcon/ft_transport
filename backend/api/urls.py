from django.urls import path, include
import auth
from . import views
urlpatterns = [
    path("", views.index),
    path("auth/", include("auth.urls"))
]
