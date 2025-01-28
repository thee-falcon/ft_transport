from django.shortcuts import render


# Create your views here.
from django.shortcuts import render, redirect
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from . import views
from django.http import HttpResponse
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.models import User
import json

# def validate_email(email):
#     email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
#     if not re.match(email_regex, email):
#         raise ValueError("Invalid email format")

def button_action(request):
    
    if request.method == 'GET':  # Handle GET request
        print('Received data: !!!!!!!!!!!!!!!!!!!!!!!!!!')
        return JsonResponse({"heloooo":  "Hello from Django!"})


def register_action(request):
    if request.method == 'POST':
        data = json.loads(request.body)  
        try:
                data = json.loads(request.body)
                email = data.get('email')
                password = data.get('password')
                password2 = data.get('password2')
                username = data.get('username')
                print(email)
                if not email or not password or not password2 or not username:
                    return JsonResponse({'message': 'Missing required fields.', 'status': 'fail'}, status=400)
                # try:
                #     validate_email(email)
                # except ValidationError:
                #     return JsonResponse({'message': 'Invalid email format.', 'status': 'fail'}, status=400)
                if password != password2:
                    return JsonResponse({'message': 'Passwords do not match.', 'status': 'fail'}, status=400)
                if User.objects.filter(username=username).exists(): 
                    return JsonResponse({'message': 'Username is already taken.', 'status': 'fail'}, status=400)
                if User.objects.filter(email=email).exists():
                    return JsonResponse({'message': 'Email is already registered.', 'status': 'fail'}, status=400)

                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                return JsonResponse({'message': 'User registered successfully!', 'status': 'success'}, status=201)

        except json.JSONDecodeError:
                return JsonResponse({'message': 'Invalid JSON format.', 'status': 'fail'}, status=400)
    
    return JsonResponse({'message': 'Only POST method is allowed.', 'status': 'fail'}, status=405)

from django.contrib.auth import authenticate
from django.http import JsonResponse
 
from django.contrib.auth import authenticate
from django.http import JsonResponse
import json

def login_action(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            userName = data.get('user')
            password = data.get('password')
            print(userName , password)
            if not userName or not password:
                return JsonResponse({'message': 'Missing required fields.', 'status': 'fail'}, status=400)

            user = authenticate(request, username=userName, password=password)
            if user:
                is_admin = user.is_staff or user.is_superuser
                response_data = {
                    'message': 'Login successful!',
                    'status': 'success',
                    'user': {
                        'username': userName,
                        'is_admin': is_admin  # Add admin status to the response
                    }
                }
                if is_admin:
                    return JsonResponse({
                        'message': 'Superuser login successful! Redirecting to admin panel...',
                        'status': 'success',
                        'redirect_url': '/admin/'  
                    }, status=200)

                return JsonResponse({
                    'message': 'Login successful!',
                    'status': 'success',
                    'user': {
                        'username': user.username,
                    
                    }
                    }, status=200)
            else:
                return JsonResponse({'message': 'Invalid email or password.', 'status': 'fail'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format.', 'status': 'fail'}, status=400)
        except Exception as e:
            print(f"Unexpected error: {e}")
            return JsonResponse({'message': 'Server error.', 'status': 'fail'}, status=500)

    return JsonResponse({'message': 'Only POST method is allowed.', 'status': 'fail'}, status=405)
import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login
from google.oauth2 import id_token
import google.auth.transport.requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import jwt
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime

from django.http import JsonResponse
import jwt
from django.conf import settings
from rest_framework.decorators import api_view

 
from django.http import JsonResponse
from rest_framework.views import APIView
import jwt
from datetime import datetime

# Replace this with your actual secret key and algorithm
JWT_SECRET_KEY = 'eeebdbb90311675c7b8daf730b674f251eeeb35c2727b95d1421624380032db1'
JWT_ALGORITHM = "HS256"
from datetime import datetime, timezone
import jwt
from django.http import JsonResponse

 
def protected_api_view(request):
    auth_header = request.headers.get('Authorization', None)

    if not auth_header:
        return JsonResponse({"message": "Authorization header missing"}, status=400)

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return JsonResponse({"message": "Invalid Authorization header format"}, status=400)

    token = parts[1]
    print("token===", token)

    try:
        # Decode the token
        decoded_token = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM], leeway=60)
        print("Decoded Token:", decoded_token)  # Debugging output

        # Extract claims
        iat = decoded_token.get("iat")
        nbf = decoded_token.get("nbf")
        exp = decoded_token.get("exp")

        # Validate claims
        if iat is None or nbf is None or exp is None:
            return JsonResponse({"message": "Token does not have required claims"}, status=401)

        current_time = datetime.now(tz=timezone.utc).timestamp()
        if current_time < nbf:
            return JsonResponse({"message": "Token not yet valid"}, status=401)

        # Validate expiration
        expiration_time = datetime.fromtimestamp(exp, tz=timezone.utc)
        if datetime.now(tz=timezone.utc) > expiration_time:
            return JsonResponse({"message": "Token has expired"}, status=401)

        # Token is valid
        return JsonResponse({
            "message": "Token is valid",
            "user_id": decoded_token.get("user_id"),
            "username": decoded_token.get("username"),
            "email": decoded_token.get("email"),
        }, status=200)

    except jwt.ExpiredSignatureError:
        return JsonResponse({"message": "Token has expired"}, status=401)
    except jwt.InvalidTokenError as e:
        print("Invalid Token Error:", str(e))
        return JsonResponse({"message": "Invalid token"}, status=401)



from datetime import datetime, timedelta, timezone
import jwt
from django.conf import settings

from datetime import datetime, timedelta, timezone
import jwt
from django.conf import settings



def generate_jwt(user):
    utc_now = datetime.now(timezone.utc)
    print(f"Current Time (UTC): {utc_now}")
    # Add a small buffer (e.g., 5 seconds) to the 'nbf' value
    buffer_time = timedelta(seconds=5)  # Add a 5-second buffer
    payload = {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "iat": utc_now.timestamp(),
        "nbf": (utc_now + buffer_time).timestamp(),  # Add buffer time here
        "exp": (utc_now + timedelta(seconds=3600)).timestamp(),  # Set expiration to 1 hour later
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    print('Token:', token)
    return token


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework import status

class google_login(APIView):
    permission_classes= [AllowAny]
    def get(self , request):
        google_url =  "https://accounts.google.com/o/oauth2/auth"
        redirect_uri = "http://127.0.0.1:8000/accounts/google/login/callback/"
        client_id = "598064932608-hf8f5bd6aehru3fjegblkhqpge7fnubr.apps.googleusercontent.com"
        response_type = "code"
        scope = "openid email profile"
        print("haaoihkhkjhkjhsjahsa")
        
        google_auth_url = f"{google_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&scope={scope}"
        return Response({"url": google_auth_url}, status=status.HTTP_200_OK) 

from rest_framework.views import APIView
import requests
class GoogleCallback(APIView):
	permission_classes = [AllowAny]
	def get(self, request):
		code = request.GET.get('code')
		token_url = "https://oauth2.googleapis.com/token"
		token_data = {
    	        'code': code,
    	        'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
    	        'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
    	        'redirect_uri': "http://localhost:8000/api/google_callback/",
    	        'grant_type': 'authorization_code',
		}

		token_response = requests.post(token_url, data=token_data)
		token_info = token_response.json()
		access_token = token_info.get('access_token')

		user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
		user_info_response = requests.get(user_info_url, headers={
    	        'Authorization': f"Bearer {access_token}"
		})
		user_info = user_info_response.json()

		user_data = {
			'email': user_info.get('email'),
			'username' : user_info.get('name'),
			'external_avatar': user_info.get('picture'),
		}
		user = User.objects.filter(email=user_data['email']).first()

		# if not user is None:
		# 	# refresh = RefreshTokens.objects.filter(user=user).first()
		# 	token = refresh.get_access_token()
		# 	refresh.save()   