from django.urls import path
from . import views
from django.urls import path
from .views import google_login
from .views import GoogleCallbackView
from django.http import HttpResponse
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views

from django.contrib import admin
from django.urls import path, include
from mygoogle import views
from . import views

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.http import HttpResponse
from django.shortcuts import render


urlpatterns = [
path('', lambda request: HttpResponse(open(settings.BASE_DIR.parent / '/front/index.html').read(), content_type='text/html')),
    path('button-action/', button_action, name='button-action'),
    path('auth/', include('allauth.urls')), 
    path('register-action/', register_action, name='register-action'),
    path('login-action/',login_action, name='login-action'),
     path('google_login/',google_login.as_view(), name='khit'),
        path('accounts/google/login/callback/', GoogleCallbackView.as_view(), name='google_callback'),
     path('admin/', admin.site.urls),
   
    path('success/', success_view, name='success'),
 path('protected-api/', protected_api_view, name='protected-api'),
 path('simple-view/', simple_view,name='simpleview'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
