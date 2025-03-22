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
from .models import Invitation
from django.db.models import Q
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

from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User  # Import User model
from django.contrib.auth.models import User  # Import User model

# def search_users(request):
#     query = request.GET.get("q", "").strip()  # Get the search query
#     if query:
#         users = User.objects.filter(username__icontains=query).values("id", "username", "email")  # Search by username
#         return JsonResponse(list(users), safe=False)
#     return JsonResponse([], safe=False)
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import UserProfile
from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializer import UserSerializer


from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import UserProfile

from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializer import UserSerializer
from django.db.models import Prefetch

from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializer  import UserSerializer
from django.db.models import Prefetch

from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializer import UserSerializer
from django.db.models import Q

from django.http import JsonResponse
from django.contrib.auth.models import User
from .serializer  import UserSerializer
from django.db.models import Q

def search_users(request):
    query = request.GET.get("q", "").strip()

    if query:
        users = User.objects.filter(username__icontains=query).select_related("profile")  # Use the correct related_name

        if not users.exists():
            return JsonResponse({"error": "No users found"}, status=404)

        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse([], safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_tournament(req):

    user_profile = get_object_or_404(UserProfile, user=req.user)
    result = req.data.get('result')
    if result == "win":
        user_profile.tournaments_won += 1
        user_profile.tournaments_count += 1

    elif result == "lose":
        user_profile.tournaments_lost +=1
        user_profile.tournaments_count += 1

    user_profile.save()

    response_data = {
        "winner": {
            "nickname": user_profile.nickname,
            "matches_won": user_profile.matches_won,
            "matches_lost": user_profile.matches_lost,
            "matches_count": user_profile.matches_count,
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_game_result(req):
    # Extract winner and loser usernames from the request
    winner_username = req.data.get('winner')
    loser_username = req.data.get('loser')

    if not winner_username or not loser_username:
        return Response({"error": "Both 'winner' and 'loser' fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if winner_username == loser_username:
        return Response({"error": "Winner and loser cannot be the same user."}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch user profiles
    winner_profile = get_object_or_404(UserProfile, user__username=winner_username)
    loser_profile = get_object_or_404(UserProfile, user__username=loser_username)

    # Update winner stats
    winner_profile.matches_won += 1
    winner_profile.matches_count += 1
    winner_profile.save()

    # Update loser stats
    loser_profile.matches_lost += 1
    loser_profile.matches_count += 1
    loser_profile.save()

    response_data = {
        "winner": {
            "nickname": winner_profile.nickname,
            "matches_won": winner_profile.matches_won,
            "matches_lost": winner_profile.matches_lost,
            "matches_count": winner_profile.matches_count,
        },
        "loser": {
            "nickname": loser_profile.nickname,
            "matches_won": loser_profile.matches_won,
            "matches_lost": loser_profile.matches_lost,
            "matches_count": loser_profile.matches_count,
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
import os
from .models import UserProfile
from .serializer import UserProfileSerializer

import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import UserProfile

import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import UserProfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class ProfilePictureUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """Update only the profile picture"""
        user = request.user

        # Check if user has a UserProfile, if not, create one
        profile, created = UserProfile.objects.get_or_create(user=user)

        if 'profile_picture' not in request.FILES:
            return Response({"error": "No profile picture provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the uploaded image
        profile.profile_picture = request.FILES['profile_picture']
        profile.save()

        return Response({
            "message": "Profile picture updated successfully!",
            "profile_picture_url": profile.profile_picture.url
        }, status=status.HTTP_200_OK)





from django.conf import settings

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stats(req):
    user_profile = get_object_or_404(UserProfile, user=req.user)

    user = req.user
    profile_picture = user_profile.profile_picture  # Get the stored value

    print("Raw Profile Picture Path:", profile_picture)

    # No need to call save_profile_picture here. Just return the stored path.
    profile_picture_path = profile_picture.url if profile_picture else None

    response = Response({
        "nickname": user_profile.nickname,
        "matches_won": user_profile.matches_won,
        "matches_lost": user_profile.matches_lost,
        "matches_count": user_profile.matches_count,
        "tournaments_won": user_profile.tournaments_won,
        "tournaments_lost": user_profile.tournaments_lost,
        "tournaments_count": user_profile.tournaments_count,
        "username": user.username,  
        "email": user.email,        
        "profile_picture": profile_picture_path,  # Use stored path
        "first_name": user.first_name,  
        "last_name": user.last_name,    
    }, status=status.HTTP_200_OK)

    print('Response Data:', response.data)
    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_invite(request):
    receiver_username = request.data.get('receiver_username')
    # Prevent inviting yourself
    if receiver_username == request.user.username:
        return Response({'error': 'Cannot invite yourself'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Expire any old pending invitations first
    old_invites = Invitation.objects.filter(
        sender=request.user, 
        receiver=receiver, 
        status='PENDING'
    )
    for invite in old_invites:
        invite.expire_if_needed()
    
    # Check for existing pending invite after expiration check
    if Invitation.objects.filter(sender=request.user, receiver=receiver, status='PENDING').exists():
        return Response({'error': 'Invitation already sent'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create the invitation
    invitation = Invitation.objects.create(
        sender=request.user,
        receiver=receiver,
        status='PENDING'
    )
    
    return Response({
        'message': 'Invitation sent successfully',
        'sender': request.user.username,
        'receiver': receiver_username
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_invites(request):
    """
    Get all pending invitations related to the current user (both sent and received)
    and expire any that have passed the time limit
    """
    # First, expire any old invitations
    pending_invites = Invitation.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user),
        status='PENDING'
    )
    
    # Check each invitation for expiration
    for invite in pending_invites:
        invite.expire_if_needed()
    
    # Now get the fresh list of pending invitations
    # Filter out any that might have just been marked as expired
    pending_invites = Invitation.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user),
        status='PENDING'
    ).order_by('-created_at')  # Newest first
    
    # Serialize the invitations with relation info
    invites_data = []
    for invite in pending_invites:
        # Calculate remaining time in seconds
        time_elapsed = timezone.now() - invite.created_at
        time_remaining = max(0, 60 - time_elapsed.total_seconds())
        
        invites_data.append({
            'id': invite.id,
            'sender': invite.sender.username,
            'receiver': invite.receiver.username,
            'created_at': invite.created_at,
            'is_sender': invite.sender == request.user,
            'is_receiver': invite.receiver == request.user,
            'time_remaining_seconds': int(time_remaining)
        })
    
    return Response({
        'count': len(invites_data),
        'invites': invites_data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clean_expired_invitations(request):
    """
    Delete ONLY expired or accepted invitations for a specific user
    """
    username = request.data.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete ONLY accepted invitations
    accepted_invitations = Invitation.objects.filter(
        Q(sender__username=username) | Q(receiver__username=username),
        status='ACCEPTED'
    )
    
    accepted_deleted = accepted_invitations.count()
    accepted_invitations.delete()
    
    # Delete ONLY expired invitations
    expired_invitations = Invitation.objects.filter(
        Q(sender__username=username) | Q(receiver__username=username),
        status='EXPIRED'
    )
    
    expired_deleted = expired_invitations.count()
    expired_invitations.delete()
    
    # Get remaining invitations for this user to return
    remaining_invitations = Invitation.objects.filter(
        Q(sender__username=username) | Q(receiver__username=username)
    ).select_related('sender', 'receiver')
    
    invites_data = [{
        'id': invite.id,
        'sender': invite.sender.username,
        'receiver': invite.receiver.username,
        'status': invite.status,
        'created_at': invite.created_at
    } for invite in remaining_invitations]
    
    return Response({
        'message': f'Deleted {accepted_deleted} accepted and {expired_deleted} expired invitations.',
        'invitations': invites_data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_invite(request):
    sender_username = request.data.get('sender_username')
    
    try:
        # Get the pending invitation
        invitation = Invitation.objects.get(
            sender__username=sender_username,
            receiver=request.user,
            status='PENDING'
        )
        
        # Check if expired before accepting
        if invitation.is_expired:
            invitation.status = 'EXPIRED'
            invitation.save()
            return Response({'error': 'Invitation has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the invitation status
        invitation.status = 'ACCEPTED'
        invitation.save()
        
        return Response({
            'message': 'Invitation accepted',
            'sender': sender_username,
            'receiver': request.user.username
        })
        
    except Invitation.DoesNotExist:
        return Response({'error': 'No valid invitation found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_invitation_status(request):
    """
    Check the status of game invitations for the authenticated user
    """
    # Get relevant invitations
    invitations = Invitation.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user),
        status__in=['PENDING', 'ACCEPTED']
    ).order_by('-created_at')
    
    # Expire any pending invitations that need it
    for invitation in invitations:
        invitation.expire_if_needed()
    
    # Get the most recent active invitation after expiration checks
    invitation = Invitation.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user),
        status__in=['PENDING', 'ACCEPTED']
    ).order_by('-created_at').first()
    
    if not invitation:
        return Response({
            'bothAccepted': False,
            'status': 'NO_INVITE',
            'message': 'No active invitation found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Determine user's role in the invitation
    is_sender = invitation.sender == request.user
    is_receiver = invitation.receiver == request.user
    
    # Calculate remaining time for pending invitations
    time_remaining = None
    if invitation.status == 'PENDING':
        time_elapsed = timezone.now() - invitation.created_at
        time_remaining = max(0, 60 - time_elapsed.total_seconds())
    
    return Response({
        'bothAccepted': invitation.status == 'ACCEPTED',
        'sender': invitation.sender.username,
        'receiver': invitation.receiver.username,
        'status': invitation.status,
        'yourRole': 'sender' if is_sender else 'receiver',
        'time_remaining_seconds': int(time_remaining) if time_remaining is not None else None
    })

    
def get_42_user_info(access_token: str):
    user_info_url = "https://api.intra.42.fr/v2/me"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(user_info_url, headers=headers)

    if response.status_code != 200:
        return None
    
    return response.json()
def save_profile_picture(profile_picture_url, username):
    """Downloads the profile picture and saves it to profile_pics/ directory."""
    if not profile_picture_url:
        return None

    try:
        response = requests.get(profile_picture_url, stream=True)
        if response.status_code == 200:
            # Define the local file path
            file_extension = profile_picture_url.split(".")[-1]  # Get file extension
            file_name = f"{username}.{file_extension}"  # Save as username.extension
            file_path = os.path.join(settings.MEDIA_ROOT, "profile_pics", file_name)

            # Save the image to the local directory
            with open(file_path, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)

            return f"profile_pics/{file_name}"  # Return relative path for the database
    except Exception as e:
        print(f"Error downloading profile picture: {e}")

    return None
from django.contrib.auth.hashers import make_password

from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile  # Import UserProfile model

User = get_user_model()

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
    profile_picture_url = user_info.get('image', {}).get('link')  # Get profile picture URL

    password = "123456"
    hashed_password = make_password(password)  # Hash the default password

    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'first_name': first_name, 'last_name': last_name, 'password': hashed_password}
        )

        if created:
            # Create UserProfile for the new user
            saved_picture_path = save_profile_picture(profile_picture_url, username)
            UserProfile.objects.create(user=user, profile_picture=saved_picture_path)
        else:
            # Update profile picture if it exists
            user_profile = UserProfile.objects.get(user=user)
            saved_picture_path = save_profile_picture(profile_picture_url, username)
            if saved_picture_path:
                user_profile.profile_picture = saved_picture_path
                user_profile.save()

        # Ensure the user's password is set correctly (in case it wasn't set when the user was created)
        if not created:
            user.set_password(password)  # Ensure the password is hashed
            user.save()

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
            "profile_picture": saved_picture_path,
        }, status=302)

        response.set_cookie(key='access_token', value=access_token)
        response.set_cookie(key='refresh_token', value=refresh_token)

        # Redirect to the home page
        response['Location'] = "http://localhost:8000/#home"
        
        return response
    except Exception as e:
        print(f"Error during login42_redir: {e}")
        return Response({"error": "An error occurred during user creation"}, status=500)




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
        user.username = request.data.get("username", user.username) or user.username
        user.first_name = request.data.get("first_name", user.first_name) or user.first_name
        user.last_name = request.data.get("last_name", user.last_name) or user.last_name
        user.email = request.data.get("email", user.email) or user.email

        user.save()  # Save updates

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)



# hamza 

from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GameHistory
from .serializer import GameHistorySerializer

@api_view(['GET'])
def game_history_list(request):
    # Filter records where the user is either the sender or the receiver
    histories = GameHistory.objects.filter(
        Q(sent_by=request.user) | Q(send_to=request.user)
    ).order_by('-timestamp')[:5]
    serializer = GameHistorySerializer(histories, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def save_game_history(request):
    try:
        # Extract data from the request
        sent_by_username = request.data.get("sent_by")  # Get the username
        send_to_username = request.data.get("send_to")  # Get the username
        result = request.data.get("result")

        # Fetch user objects using username
        sent_by = User.objects.get(username=sent_by_username)
        send_to = User.objects.get(username=send_to_username)

        # Save the game history
        game_history = GameHistory.objects.create(sent_by=sent_by, send_to=send_to, result=result)
        
        return Response({"message": "Game history saved successfully"}, status=201)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
