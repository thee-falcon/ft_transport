from django.urls import path
from . import views
from django.urls import path
# from .views import google_login
# from .views import GoogleCallbackView
from django.http import HttpResponse
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from django.contrib import admin
from django.urls import path, include
from mygoogle import views
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
path('', lambda request: HttpResponse(open(settings.BASE_DIR.parent / '/front/index.html').read(), content_type='text/html')),
   #  path('button-action/', button_action, name='button-action'),
   path('auth/', include('allauth.urls')), 
   path('admin/', admin.site.urls),
   path('login/',  views.login),
   path('logout/',  views.logout),
   path('signup/',  views.signup),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
