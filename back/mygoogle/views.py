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

SECRET = "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"  
UID = "u-s4t2ud-ce06a015b3085a9d1b2735ae095fdd353bebe0c3deeb5d67f164a0dfdfbbb144"
AUTH_URL = "https://api.intra.42.fr/oauth/authorize?client_id=" + UID + "&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin42_redir&response_type=code"
REDIRECT_URI = 'http://localhost:8000/login42_redir'

def set_token_cookies(response, refresh_token, access_token):
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='None')
    response.set_cookie('access_token', access_token, samesite='None')

@api_view(['POST'])
def login(req):
    user = get_object_or_404(User, username=req.data['username'])
    if not user.check_password(req.data['password']):
        return Response({"detail": "Wrong Password !"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
    refresh = RefreshToken.for_user(user)
    response = Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": req.data['username'],
    }, status=status.HTTP_200_OK)
    
    set_token_cookies(response, str(refresh), str(refresh.access_token))
    return response

@api_view(['POST'])
def signup(req):
    if User.objects.filter(username=req.data['username']).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=req.data['email']).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=req.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=req.data['username'])
        user.set_password(req.data['password'])
        user.save()
        return Response({"user": serializer.data})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_token(req):
    return Response({"detail": "You are authenticated!"}, status=status.HTTP_200_OK)

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
    print("Token exchange response:", response.json())  # Log the response
    if response.status_code != 200:
        return None
    
    return response.json().get('access_token')

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
        return JsonResponse({"error": "Authorization code not provided"}, status=400)

    access_token = exchange_code_for_token(code)
    if not access_token:
        return JsonResponse({"error": "Failed to retrieve access token"}, status=400)

    user_info = get_42_user_info(access_token)
    if not user_info:
        return JsonResponse({"error": "Failed to retrieve user information"}, status=400)

    username = user_info.get('login')
    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': user_info.get('email')}
        )
        if created:
            print(f"New user {username} created.")
        else:
            print(f"User {username} already exists.")
    
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "access": access_token,
            "refresh": refresh_token,
            "username": username,
        }, status=302)

        response.set_cookie(key='access', value=access_token)
        response.set_cookie(key='refresh', value=refresh_token)
        response.set_cookie(key='username', value=username)

        response['Location'] = "http://localhost:8000/#dashboard"
        
        return response
    except Exception as e:
        print("Error during user creation:", str(e))
        return JsonResponse({"error": "An error occurred during user creation"}, status=500)