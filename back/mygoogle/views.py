from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .serializer import UserSerializer
from .models import UserProfile  # Ensure you have a UserProfile model
import secrets
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import UserSerializer
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import requests

# OAuth Credentials
SECRET = "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"  
UID = "u-s4t2ud-ce06a015b3085a9d1b2735ae095fdd353bebe0c3deeb5d67f164a0dfdfbbb144"
AUTH_URL = "https://api.intra.42.fr/oauth/authorize?client_id=" + UID + "&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin42_redir&response_type=code"
REDIRECT_URI = 'http://localhost:8000/login42_redir'

def set_token_cookies(response, refresh_token, access_token, username):
    response.set_cookie('refresh_token', refresh_token, samesite='None', httponly=False)
    response.set_cookie('access_token', access_token, samesite='None', httponly=False)
    response.set_cookie('username', username, samesite='None', httponly=False)  # Allow frontend access

@api_view(['POST'])
def login(req):
    user = get_object_or_404(User, username=req.data['username'])

    if not user.check_password(req.data['password']):
        return Response({"detail": "Wrong Password!"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
    refresh = RefreshToken.for_user(user)
    response = Response({
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "username": req.data['username'],
    }, status=status.HTTP_200_OK)
    set_token_cookies(response, str(refresh), str(refresh.access_token), req.data['username'])
    print("ressssss  ", response)
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_token(req):
    return Response({"detail": "You are authenticated!"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def signup(req):
    # Check if username or email is already taken
    if User.objects.filter(username=req.data['username']).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=req.data['email']).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=req.data)
    if serializer.is_valid():
        user = serializer.save()  # Automatically creates the UserProfile as well
        return Response({"user": serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@csrf_exempt
@api_view(['POST'])
def logout(req):
    refresh_token = req.COOKIES.get('refresh_token')
    response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            print("Error blacklisting token:", e)

    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    response.delete_cookie('username')
    response.delete_cookie('email')
    response.delete_cookie('first_name')
    response.delete_cookie('last_name')
    response.delete_cookie('profile_picture')
    req.session.flush()
    return response

def login42(request: HttpRequest):
    return redirect(AUTH_URL)

def exchange_code_for_token(code: str):
    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        'client_id': UID,
        'client_secret': SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        return None
    return response.json().get('access_token')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stats(req):
    user_profile = get_object_or_404(UserProfile, user=req.user)
    
    response = Response({
        "nickname": user_profile.nickname,
        "matches_won": user_profile.matches_won,
        "matches_lost": user_profile.matches_lost,
        "matches_count": user_profile.matches_count,
        "tournaments_won": user_profile.tournaments_won,
        "tournaments_lost": user_profile.tournaments_lost,
        "tournaments_count": user_profile.tournaments_count,
        # "profile_picture": user_profile.profile_picture.url if user_profile.profile_picture else None
    }, status=status.HTTP_200_OK)
    
    return response
    
    
    
def get_42_user_info(access_token: str):
    user_info_url = "https://api.intra.42.fr/v2/me"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(user_info_url, headers=headers)

    if response.status_code != 200:
        return None
    
    return response.json()

@api_view(['GET'])
def login42_redir(request):
    code = request.GET.get('code')
    if not code:
        return redirect("http://localhost:8000/#signin")

    access_token = exchange_code_for_token(code)
    if not access_token:
        return redirect("http://localhost:8000/#signin")

    user_info = get_42_user_info(access_token)
    if not user_info:
        return redirect("http://localhost:8000/#signin")

    username = user_info.get('login')
    email = user_info.get('email')
    first_name = user_info.get('first_name')
    last_name = user_info.get('last_name')
    profile_picture = user_info.get('image', {}).get('link')  

    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'first_name': first_name, 'last_name': last_name}
        )
        if created:
            UserProfile.objects.create(user=user, profile_picture=profile_picture)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "username": username,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "profile_picture": profile_picture,
        }, status=302)

        response.set_cookie(key='access_token', value=access_token)
        response.set_cookie(key='refresh_token', value=refresh_token)
        response.set_cookie(key='username', value=username)
        response.set_cookie(key='email', value=email)
        response.set_cookie(key='first_name', value=first_name)
        response.set_cookie(key='last_name', value=last_name)
        response.set_cookie(key='profile_picture', value=profile_picture)

        response['Location'] = "http://localhost:8000/#home"
        return response
    except Exception as e:
        return JsonResponse({"error": "An error occurred during user creation"}, status=500)
