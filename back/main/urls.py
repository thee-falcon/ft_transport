 
 
 
from django.contrib.auth import views as auth_views

from django.contrib import admin
 
from mygoogle import views  
from django.conf.urls.static import static
from django.urls import path
from django.http import HttpResponse
from django.shortcuts import render

from django.conf import settings
import os
from two_factor.views import send_code, verify_code
# from mygoogle import google_login


try:
    with open(settings.BASE_DIR.parent / 'front/index.html') as f:
        print("File opened successfully!")
except FileNotFoundError:
    print("File not found at:", settings.BASE_DIR / 'front/index.html')

print(settings.BASE_DIR / 'front/index.html')
from rest_framework_simplejwt import views as jwt_views

from django.urls import path , include
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
    path('', include("chat.urls")),
    path('send_code/', send_code, name='send_code'),
    path('verify_code/', verify_code, name='verify_code'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


