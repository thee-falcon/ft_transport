from channels.generic.websocket import AsyncWebsocketConsumer
import json, time
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message

from asgiref.sync import async_to_sync
from .models import Friendship
from django.db.models import Q
from urllib.parse import parse_qs
import jwt
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken


User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept()

		# Always define self.user and self.channel_room to prevent AttributeError
		self.user = None  
		self.channel_room = None  

		query_string = self.scope['query_string'].decode()
		# print(f"Query String: {query_string}")
		query_params = parse_qs(query_string)
		# print(f"Query Parameters: {query_params}")

		token = query_params.get('token', [None])[0]
		print(f"Token: {token}")

		if token:
			try:
				access_token = AccessToken(token)
				user_id = access_token['user_id']
				user = await database_sync_to_async(User.objects.get)(id=user_id)
				print("User authentication successful.")
				self.user = user  # Use self.user consistently
				print(f"User: {user} (ID: {user_id})")
			except Exception as e:
				print(f"Token verification failed: {e}")
				await self.close()
				return  

		# Set channel_room even if user is None (avoid AttributeError)
		if self.user:
			self.channel_room = f'user_chatroom_{self.user.id}'
		else:
			self.channel_room = "anonymous_chatroom"

		# Add user to group if authenticated
		if self.user:
			await self.channel_layer.group_add(
				self.channel_room,
				self.channel_name,
			)
		print("gogog :", self.user)

	async def receive(self, text_data):
		print('receive', text_data)
		data = json.loads(text_data)
		action = data.get("action")
	
		if action == "search_user":
			query = data.get("query", "").strip()
			if query:
				results = await self.search_users(query)
				response_data = {
					"action": "search_results",
					"users": results,
				}
				await self.send(text_data=json.dumps(response_data))
			else:
				print("Empty query in search_user")
			return

		if action == "send_invitation":
			target_user_id = data.get("target_user_id")
			# Create a pending friendship using self.user as sender.
			friendship = await self.create_friendship(self.user, target_user_id)
			if friendship:
				invitation_id = f"{self.user.id}_{target_user_id}_{int(time.time())}"
				invitation_data = {
					"action": "invitation",
					"invitationId": invitation_id,
					"fromUserId": self.user.id,
					"fromUsername": self.user.username,
					"friendshipId": friendship.id,
				}
				target_room = f"user_chatroom_{target_user_id}"
				await self.channel_layer.group_send(
					target_room,
					{
						"type": "invitation_message",
						"text": json.dumps(invitation_data)
					}
				)
			
			return

		if action == "invitation_response":
			response = data.get("response")  # "accepted" or "declined"
			print ("response : ")
			friendship_id = data.get("friendshipId")


			friendship = await self.get_friendship_by_id(friendship_id)
			if friendship:
				# You might want to adjust how you check for the target user here.
				user2 = await database_sync_to_async(lambda: friendship.user2)()

				# For example, compare usernames if that's the unique identifier:
				if user2 == self.user:
					if response == "accepted":
						friendship.status = "accepted"
					elif response == "declined":
						friendship.status = "declined"
					await self.save_friendship(friendship)

				user1 = await database_sync_to_async(lambda: friendship.user1)()
				sender_room = f"user_chatroom_{user1.id}"
				response_data = {
					"action": "invitation_response_ack",
					"response": response,
					"friendshipId": friendship.id,
				}
				await self.channel_layer.group_send(
					sender_room,
					{
						"type": "invitation_message",
						"text": json.dumps(response_data)
					}
				)
			else:
				# Handle invalid friendship request
				pass
			return

		if action == "block_user":
			target_user_id = data.get("target_user_id")
			friendship = await self.get_friendship(self.user, target_user_id)
			if friendship:
				friendship.blocked_by = self.user
				await self.save_friendship(friendship)
				response_data = {
					"action": "block_ack",
					"message": "You have blocked this user. You cannot send messages to them."
				}
				await self.send(text_data=json.dumps(response_data))
			else:
				await self.send(text_data=json.dumps({
					"action": "block_ack",
					"message": "No friendship found between you and the user."
				}))
			return

		# Else, assume it's a chat message.
		new_message = data.get('message')
		sent_by_id = data.get('sent_by')
		send_to_id = data.get('send_to')
		
		if not new_message:
			print("error message in receive")
			return

		sent_by_user = await self.get_user_object(sent_by_id)
		send_to_user = await self.get_user_object(send_to_id)
		if not sent_by_user:
			print('error sent by user')
		if not send_to_user:
			print('error send to user')

		blocked_by_receiver = await self.is_blocked(send_to_user, sent_by_user)
		blocked_by_sender = await self.is_blocked(sent_by_user, send_to_user)
		if blocked_by_receiver or blocked_by_sender:
			await self.send(text_data=json.dumps({
				"error": "Cannot send message: Communication is blocked."
			}))
			return

		await self.save_message(sent_by_user, send_to_user, new_message)
		other_user_channel_room = f'user_chatroom_{send_to_id}'
		print('chat: ', other_user_channel_room)
		response_data = {
			'message': new_message,
			'sent_by': sent_by_id,
			'send_to': send_to_id
		}
		await self.channel_layer.group_send(
			other_user_channel_room,
			{
				'type': 'chat_message',
				'text': json.dumps(response_data)
			}
		)
		await self.channel_layer.group_send(
			self.channel_room,
			{
				'type': 'chat_message',
				'text': json.dumps(response_data)
			}
		)

	async def chat_message(self, event):
		print('chat_message', event)
		await self.send(text_data=event['text'])

	async def disconnect(self, close_code):
		if self.channel_room:
			await self.channel_layer.group_discard(
				self.channel_room,
				self.channel_name,
			)

	async def invitation_message(self, event):
		await self.send(text_data=event['text'])

	@database_sync_to_async
	def get_user_object(self, user_id):
		usr = User.objects.filter(id=user_id)
		if usr.exists():
			return usr.first()
		return None

	@database_sync_to_async
	def save_message(self, sent_by_user, send_to_user, message_content):
		message = Message(
			sent_by=sent_by_user,
			send_to=send_to_user,
			message=message_content
		)
		message.save()

	@database_sync_to_async
	def search_users(self, query):
		return list(User.objects.filter(username__icontains=query).values("id", "username"))

	@database_sync_to_async
	def create_friendship(self, sender, target_user_id):
		# If sender is a User instance, extract its id.
		if isinstance(sender, User):
			sender_id = sender.id
		else:
			sender_id = sender
		try:
			sender_obj = User.objects.get(id=sender_id)
			target_user = User.objects.get(id=target_user_id)
			print("hello hamza : ", sender_obj, "       ", target_user)
		except User.DoesNotExist:
			return None

		# Check if a friendship already exists (either direction)
		exists = Friendship.objects.filter(
			Q(user1=sender_obj, user2=target_user) | Q(user1=target_user, user2=sender_obj)
		).exists()
		if exists:
			return None

		return Friendship.objects.create(user1=sender_obj, user2=target_user, status="pending")

	@database_sync_to_async
	def get_friendship(self, sender, receiver):
		try:
			return Friendship.objects.get(
				Q(user1=receiver, user2=sender) | Q(user1=sender, user2=receiver)
			)
		except Friendship.DoesNotExist:
			return None

	@database_sync_to_async
	def save_friendship(self, friendship):
		friendship.save()

	@database_sync_to_async
	def get_friendship_by_id(self, friendship_id):
		try:
			return Friendship.objects.get(id=friendship_id)
		except Friendship.DoesNotExist:
			return None

	@database_sync_to_async
	def get_user1_from_friendship(self, friendship):
		return friendship.user1

	@database_sync_to_async
	def is_blocked(self, receiver, sender):
		try:
			friendship = Friendship.objects.get(
				Q(user1=receiver, user2=sender) | Q(user1=sender, user2=receiver)
			)
			if friendship.blocked_by and friendship.blocked_by == receiver:
				return True
			return False
		except Friendship.DoesNotExist:
			return False