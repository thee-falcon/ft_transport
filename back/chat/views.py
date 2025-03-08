from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# from chat.models import DataUser
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Message  # Make sure to import the Message model
from .models import get_friends




# @login_required
# def HomeChat(request):
#     user = request.user
#     friends = get_friends(user)
    
#     # Fetch messages where the current user is the receiver
#     messages = Message.objects.filter(Q(sent_by=user) | Q(send_to=user)).order_by('timestamp')
    
#     # Include send_to_id and sent_by_id for each message
#     messages_with_ids = [
#         {
#             'message': message,
#             'send_to_id': message.send_to.id,
#             'sent_by_id': message.sent_by.id,
#         }
#         for message in messages
#     ]
    
#     context = {
#         "friends": friends,
#         "messages": messages_with_ids,
#     }
#     return render(request, "index.html", context)

# def chat_index(request):
#     return render(request, 'index.html')  




# @login_required
# def HomeChat(request):
#     user = request.user
    
#     # Get all friends with their last seen status and unread message count
#     friends_with_messages = (
#         get_friends(user)
#         .annotate(
#             last_seen=Coalesce(F('last_login'), datetime.min),
#             unread_count=Count(
#                 'sent_messages',
#                 filter=Q(sent_messages__send_to=user, sent_messages__is_read=False)
#             ),
#             last_message_time=Max('sent_messages__timestamp')
#         )
#         .order_by('-last_message_time')
#     )

#     # Fetch messages for all conversations
#     messages = (
#         Message.objects
#         .filter(
#             Q(sent_by=user) | Q(send_to=user)
#         )
#         .select_related('sent_by', 'send_to')
#         .order_by('timestamp')
#     )

#     # Structure messages by conversation
#     conversations = {}
#     for message in messages:
#         # Determine the conversation partner (friend) ID
#         friend_id = message.send_to.id if message.sent_by == user else message.sent_by.id
        
#         if friend_id not in conversations:
#             conversations[friend_id] = []
            
#         conversations[friend_id].append({
#             'id': message.id,
#             'content': message.message,
#             'timestamp': message.timestamp.isoformat(),
#             'sent_by_id': message.sent_by.id,
#             'send_to_id': message.send_to.id,
#             'is_read': message.is_read
#         })

#     # Prepare friends data with additional information
#     friends_data = [{
#         'id': friend.id,
#         'username': friend.username,
#         'last_seen': friend.last_seen.isoformat() if friend.last_seen else None,
#         'unread_count': friend.unread_count,
#         'messages': conversations.get(friend.id, []),
#         'is_online': hasattr(friend, 'is_online') and friend.is_online,
#         'avatar_url': friend.avatar.url if hasattr(friend, 'avatar') and friend.avatar else None
#     } for friend in friends_with_messages]

#     data = {
#         "friends": friends_data,
#         "current_user": {
#             "id": user.id,
#             "username": user.username
#         }
#     } 
#     return JsonResponse(data)


# @login_required
# def HomeChat(request):
#     user = request.user
#     friends = get_friends(user)
    
#     # Fetch messages where the current user is either the sender or receiver
#     messages = Message.objects.filter(Q(sent_by=user) | Q(send_to=user)).order_by('timestamp')
    
#     # Serialize messages: ensure we only include JSON serializable data
#     messages_with_ids = [
#         {
#             'id': message.id,
#             'content': message.message,  # Correct field name is 'message'
#             'timestamp': message.timestamp.isoformat(),  # convert datetime to string
#             'send_to_id': message.send_to.id,
#             'sent_by_id': message.sent_by.id,
#         }
#         for message in messages
#     ]
    
#     # Serialize friends, assuming friend objects have 'id' and 'username'
#     friends_data = [
#         {
#             'id': friend.id,
#             'username': friend.username,
#         }
#         for friend in friends
#     ]
    
#     data = {
#         "friends": friends_data,
#         "messages": messages_with_ids,
#     }
    
#     return JsonResponse(data)



# @login_required

# def HomeChatAPI(request):
#     user = request.user
#     friends = get_friends(user)

#     messages = Message.objects.filter(Q(sent_by=user) | Q(send_to=user)).order_by('-timestamp')

#     last_message_map = {}
#     for message in messages:
#         friend_id = message.send_to.id if message.sent_by == user else message.sent_by.id
#         last_message_map[friend_id] = message.timestamp

#     sorted_friends = sorted(friends, key=lambda friend: (
# 		make_naive(last_message_map.get(friend.id, datetime.min), timezone.utc) 
# 		if is_aware(last_message_map.get(friend.id, datetime.min)) 
# 		else last_message_map.get(friend.id, datetime.min)
# 	), reverse=True)

#     messages_with_ids = [
#         {
#             'id': message.id,
#             'content': message.message,
#             'timestamp': message.timestamp.isoformat(),
#             'send_to_id': message.send_to.id,
#             'sent_by_id': message.sent_by.id,
#         }
#         for message in messages
#     ]

#     friends_data = [{'id': friend.id, 'username': friend.username} for friend in sorted_friends]

#     return JsonResponse({"username": user.username, "id": user.id, "friends": friends_data, "messages": messages_with_ids})


# from datetime import datetime
# from django.utils.timezone import is_aware, make_naive

# from django.utils import timezone








# @login_required
# def HomeChatAPI(request):
#     user = request.user
#     friends = get_friends(user)

#     messages = Message.objects.filter(Q(sent_by=user) | Q(send_to=user)).order_by('timestamp')

#     messages_with_ids = [
#         {
#             'id': message.id,
#             'content': message.message,  # Correct field name is 'message'
#             'timestamp': message.timestamp.isoformat(),  # Convert datetime to string
#             'send_to_id': message.send_to.id,
#             'sent_by_id': message.sent_by.id,
#         }
#         for message in messages
#     ]

#     friends_data = [{'id': friend.id, 'username': friend.username} for friend in friends]

#     return JsonResponse({ "username": user.username, "id": user.id ,"friends": friends_data, "messages": messages_with_ids})




# import json, time
# from django.shortcuts import redirect, get_object_or_404
# from django.contrib.auth.models import User
# from django.contrib import messages
# from asgiref.sync import async_to_sync
# from channels.layers import get_channel_layer
# from .models import Friendship

# def send_friend_request(request, user_id):
#     sender = request.user
#     receiver = get_object_or_404(User, id=user_id)

#     if sender == receiver:
#         messages.error(request, "You cannot send a friend request to yourself.")
#         return redirect("home")

#     # Check if a request already exists
#     existing_request = Friendship.objects.filter(user1=sender, user2=receiver).exists() or \
#                        Friendship.objects.filter(user1=receiver, user2=sender).exists()

#     if existing_request:
#         messages.warning(request, "Friend request already sent or already friends.")
#     else:
#         # Create a pending friend request
#         friendship = Friendship.objects.create(user1=sender, user2=receiver, status="pending")
#         messages.success(request, "Friend request sent successfully!")
        
#         # Build an invitation payload.
#         invitation_id = f"{sender.id}_{receiver.id}_{int(time.time())}"
#         invitation_payload = {
#             "action": "invitation",
#             "invitationId": invitation_id,
#             "fromUserId": sender.id,
#             "fromUsername": sender.username,
#             "friendshipId": friendship.id,  # useful for processing response
#         }
        
#         # Send a WebSocket message to the receiver’s chatroom.
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             f"user_chatroom_{receiver.id}",
#             {
#                 "type": "invitation_message",
#                 "text": json.dumps(invitation_payload),
#             }
#         )

#     return redirect("home")


# def respond_friend_request(request, friendship_id, response):
#     friendship = get_object_or_404(Friendship, id=friendship_id)

#     if friendship.user2 != request.user:
#         messages.error(request, "You are not authorized to respond to this request.")
#         return redirect("home")

#     if response == "accept":
#         friendship.status = "accepted"
#         messages.success(request, "Friend request accepted!")
#     elif response == "decline":
#         friendship.status = "declined"
#         messages.warning(request, "Friend request declined.")

#     friendship.save()
    
#     # (Optional) You can also notify the sender about the response using Channels.
#     channel_layer = get_channel_layer()
#     response_payload = {
#         "action": "invitation_response",
#         "friendshipId": friendship.id,
#         "response": response,
#         "fromUserId": request.user.id,
#     }
#     async_to_sync(channel_layer.group_send)(
#         f"user_chatroom_{friendship.user1.id}",
#         {
#             "type": "invitation_message",
#             "text": json.dumps(response_payload),
#         }
#     )
    
#     return redirect("home")



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib import messages
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Friendship, Message
from django.db.models import Q
import json, time

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def HomeChatAPI(request):
    user = request.user
    friends = get_friends(user)

    messages = Message.objects.filter(Q(sent_by=user) | Q(send_to=user)).order_by('timestamp')

    messages_with_ids = [
        {
            'id': message.id,
            'content': message.message,
            'timestamp': message.timestamp.isoformat(),
            'send_to_id': message.send_to.id,
            'sent_by_id': message.sent_by.id,
        }
        for message in messages
    ]

    friends_data = [{'id': friend.id, 'username': friend.username} for friend in friends]

    return Response({
        "username": user.username,
        "id": user.id,
        "friends": friends_data,
        "messages": messages_with_ids
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def send_friend_request(request, user_id):
    sender = request.user
    receiver = get_object_or_404(User, id=user_id)

    if sender == receiver:
        return Response({"error": "You cannot send a friend request to yourself."}, status=400)

    existing_request = Friendship.objects.filter(user1=sender, user2=receiver).exists() or \
                       Friendship.objects.filter(user1=receiver, user2=sender).exists()

    if existing_request:
        return Response({"message": "Friend request already sent or already friends."}, status=400)
    
    friendship = Friendship.objects.create(user1=sender, user2=receiver, status="pending")
    
    invitation_id = f"{sender.id}_{receiver.id}_{int(time.time())}"
    invitation_payload = {
        "action": "invitation",
        "invitationId": invitation_id,
        "fromUserId": sender.id,
        "fromUsername": sender.username,
        "friendshipId": friendship.id,
    }
    
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_chatroom_{receiver.id}",
        {
            "type": "invitation_message",
            "text": json.dumps(invitation_payload),
        }
    )
    
    return Response({"message": "Friend request sent successfully!"}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_friend_request(request, friendship_id, response):
    friendship = get_object_or_404(Friendship, id=friendship_id)

    if friendship.user2 != request.user:
        return Response({"error": "You are not authorized to respond to this request."}, status=403)

    if response == "accept":
        friendship.status = "accepted"
        message = "Friend request accepted!"
    elif response == "decline":
        friendship.status = "declined"
        message = "Friend request declined."
    else:
        return Response({"error": "Invalid response."}, status=400)

    friendship.save()
    
    channel_layer = get_channel_layer()
    response_payload = {
        "action": "invitation_response",
        "friendshipId": friendship.id,
        "response": response,
        "fromUserId": request.user.id,
    }
    async_to_sync(channel_layer.group_send)(
        f"user_chatroom_{friendship.user1.id}",
        {
            "type": "invitation_message",
            "text": json.dumps(response_payload),
        }
    )
    
    return Response({"message": message}, status=200)
