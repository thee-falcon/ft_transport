from django.urls import path, include
from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('', lambda request: HttpResponse(open(settings.BASE_DIR.parent / 'front/index.html').read(), content_type='text/html')),
    path('auth/', include('allauth.urls')),
    path('admin/', admin.site.urls),
    path('login/', views.login),
    path('logout/', views.logout),
    path('check/', views.check_token),
    path('signup/', views.signup),
    path('token-refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('login42/', views.login42, name='login42'),
    path('login42_redir/', views.login42_redir, name='login42_redir'),
]
