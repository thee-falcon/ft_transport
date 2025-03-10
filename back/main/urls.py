 
 
 
from django.contrib.auth import views as auth_views

from django.contrib import admin
 
from mygoogle import views  
from django.conf.urls.static import static
from django.urls import path
from django.http import HttpResponse
from django.shortcuts import render

from django.conf import settings
import os
# from mygoogle import google_login


try:
    with open(settings.BASE_DIR.parent / 'front/index.html') as f:
        print("File opened successfully!")
except FileNotFoundError:
    print("File not found at:", settings.BASE_DIR / 'front/index.html')

print(settings.BASE_DIR / 'front/index.html')
from rest_framework_simplejwt import views as jwt_views

from django.urls import path , include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', lambda request: HttpResponse(
        open(settings.BASE_DIR.parent / 'front/index.html').read(), 
        content_type='text/html'
    )),
    # path('admin/', admin.site.urls),   
    # path('login/', views.login),
    # path('logout/', views.logout),
    # path('signup/', views.signup),
    path('', include("mygoogle.urls")),
        path('api/auth/', include('two_factor.urls')),
    path('api/auth/jwt/', include([
        path('create/', TokenObtainPairView.as_view(), name='jwt_create'),
        path('refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    ])),
    
    path('', include("chat.urls")),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


