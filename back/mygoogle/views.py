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
from .models import UserProfile
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
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializer import UserProfileSerializer

# OAuth Credentials
SECRET = "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"  
UID = "u-s4t2ud-12c9a4d3eabdcee8f3648a0e5d01b28899a1fe6aa613fd1ff0193b6ed02cb2df"
AUTH_URL = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-12c9a4d3eabdcee8f3648a0e5d01b28899a1fe6aa613fd1ff0193b6ed02cb2df&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin42_redir&response_type=code"
REDIRECT_URI = 'http://localhost:8000/login42_redir'

def set_token_cookies(response, refresh_token, access_token):
    expires_at = datetime.utcnow() + timedelta(minutes=1)
    response.set_cookie('refresh_token', refresh_token, max_age=3600, samesite='Lax')
    response.set_cookie('access_token', access_token,max_age=3600 ,samesite='Lax')
    response.set_cookie('expires_at', expires_at.timestamp(), max_age=900, samesite='Lax')  # Store expiration
    # response.set_cookie('username',username,max_age=3600, samesite='Lax')  # Allow frontend access

@api_view(['POST'])
def login(req):
    print("Received login request for:", req.data['username'])

    user = get_object_or_404(User, username=req.data['username'])
    print("Stored password (hashed):", user.password)
    print("Entered password:", req.data['password'])

    if not user.check_password(req.data['password']):
        print("Password check failed!")
        return Response({"detail": "Wrong Password!"}, status=status.HTTP_406_NOT_ACCEPTABLE)

    print("Password check passed!")

    refresh = RefreshToken.for_user(user)
    response = Response({
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "username": req.data['username'],
    }, status=status.HTTP_200_OK)

    set_token_cookies(response, str(refresh), str(refresh.access_token))
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

    # if refresh_token:
    #     try:
    #         token = RefreshToken(refresh_token)
    #         token.blacklist()
    #     except Exception as e:
    #         print("Error blacklisting token:", e)

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

    user = req.user
    username = user.username
    email = user.email
    first_name = user.first_name
    last_name = user.last_name

    profile_picture = user_profile.profile_picture  # Get the stored value

    if isinstance(profile_picture, str):  # If it's a URL string, use it as is
        profile_picture = profile_picture
    elif profile_picture:  # If it's an ImageField, get the full URL
        profile_picture = req.build_absolute_uri(profile_picture.url)
    else:
        profile_picture = None  # If no image is set

    response = Response({
        "nickname": user_profile.nickname,
        "matches_won": user_profile.matches_won,
        "matches_lost": user_profile.matches_lost,
        "matches_count": user_profile.matches_count,
        "tournaments_won": user_profile.tournaments_won,
        "tournaments_lost": user_profile.tournaments_lost,
        "tournaments_count": user_profile.tournaments_count,
        "username": username,  
        "email": email,        
        "profile_picture": profile_picture,  
        "first_name": first_name,  
        "last_name": last_name,    
    }, status=status.HTTP_200_OK)

    print('response ===', response.data)
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
    print("login42_redir function is called")  # Debugging print
    code = request.GET.get('code')
    if not code:
        print("No code in request")
        return redirect("http://localhost:8000/#signin")

    access_token = exchange_code_for_token(code)
    if not access_token:
        print("Failed to exchange code for token")
        return redirect("http://localhost:8000/#signin")

    user_info = get_42_user_info(access_token)
    if not user_info:
        print("Failed to get user info")
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
        # response.set_cookie(key='username', value=username)
        # response.set_cookie(key='email', value=email)
        # response.set_cookie(key='first_name', value=first_name)
        # response.set_cookie(key='last_name', value=last_name)
        # response.set_cookie(key='profile_picture', value=profile_picture)
        print( 'fffffffffffffffffffffffffffff' , response)
        response['Location'] = "http://localhost:8000/#home"
        return response
    except Exception as e:
        return JsonResponse({"error": "An error occurred during user creation"}, status=500)


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializer import UserProfileSerializer

import logging
logger = logging.getLogger(__name__)


from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import check_password
from django.contrib.auth import update_session_auth_hash
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class RefreshTokenView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can refresh their token

    def post(self, request):
        # Get refresh token from request
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({'error': 'No refresh token provided'}, status=400)

        try:
            # Decode and refresh the token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            # Set new access token in the response
            response = Response({
                'access': access_token,
                'refresh': str(refresh),
            })
            
            # Update cookies with the latest username (you can also set new expiration time here)
            response.set_cookie('username', request.user.username, max_age=3600, httponly=True)

            return response

        except Exception as e:
            return Response({'error': str(e)}, status=400)

from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth import update_session_auth_hash
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can update their profile

    def put(self, request):
        user = request.user  # Get the logged-in user

        # Check if old password is provided before updating password
        if 'password' in request.data and request.data['password']:
            old_password = request.data.get("oldPassword", "")
            if not old_password:
                return Response({"message": "Old password is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not check_password(old_password, user.password):
                return Response({"message": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(request.data["password"])  # Hash password
            update_session_auth_hash(request, user)  # Prevent logout after password change

        # Update user fields if provided (without overwriting with None)
        user.username = request.data.get("username", user.username) or user.username
        user.first_name = request.data.get("first_name", user.first_name) or user.first_name
        user.last_name = request.data.get("last_name", user.last_name) or user.last_name
        user.email = request.data.get("email", user.email) or user.email

        user.save()  # Save updates

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
