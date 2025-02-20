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

@login_required
def HomeChatAPI(request):
    user = request.user
    friends = get_friends(user)

    messages = Message.objects.filter(Q(sent_by=user) | Q(send_to=user)).order_by('timestamp')

    messages_with_ids = [
        {
            'id': message.id,
            'content': message.message,  # Correct field name is 'message'
            'timestamp': message.timestamp.isoformat(),  # Convert datetime to string
            'send_to_id': message.send_to.id,
            'sent_by_id': message.sent_by.id,
        }
        for message in messages
    ]

    friends_data = [{'id': friend.id, 'username': friend.username} for friend in friends]

    return JsonResponse({ "username": user.username, "id": user.id ,"friends": friends_data, "messages": messages_with_ids})
