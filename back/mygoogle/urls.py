from django.urls import path, include
from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import UpdateUserProfileView ,RefreshTokenView
from .views import ProfilePictureUpdateView
from django.urls import path
from .views import search_users

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
    path('get_user_stats/' , views.get_user_stats,),
    path('update_game_result/' , views.update_game_result),
    path("pictureedit/", ProfilePictureUpdateView.as_view(), name="profile-picture-edit"),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
    path('update-profile/', UpdateUserProfileView.as_view(), name='update-profile'),
    path("search-users/", search_users, name="search_users"),
    path('check_invitation_status/' , views.check_invitation_status),
    path('accept_invite/' , views.accept_invite),
    path('send_invite/' , views.send_invite),
    path('get_invites/' , views.get_invites),
    path('clean_invites/' , views.clean_expired_invitations),
    ]
