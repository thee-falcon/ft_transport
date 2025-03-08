from django.urls import path
from . import consumers
from django.urls import re_path 
from channels.routing import ProtocolTypeRouter, URLRouter


websocket_urlpatterns = [
	path('chat/', consumers.ChatConsumer.as_asgi()),
]

# websocket_urlpatterns = [
#     re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
# ]

