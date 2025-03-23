from django.contrib import admin
from django.urls import path, include
# from .views import HomeChat
from .views import HomeChatAPI
from django.http import HttpResponse
from django.conf import settings
from . import views
import requests
from django.conf.urls.static import static

urlpatterns = [
	# path('chat/', lambda request: HttpResponse(open(settings.BASE_DIR.parent / 'front/index.html').read(), content_type='text/html')),
    path('api/', HomeChatAPI, name='home_chat_api'),
	#  path('', views.chat_index, name='chat_index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)