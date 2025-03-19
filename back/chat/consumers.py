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
		self.user = None  
		self.channel_room = None  
		query_string = self.scope['query_string'].decode()
		query_params = parse_qs(query_string)
		token = query_params.get('token', [None])[0]
		if token:
			try:
				access_token = AccessToken(token)
				user_id = access_token['user_id']
				user = await database_sync_to_async(User.objects.get)(id=user_id)
				self.user = user
			except Exception as e:
				await self.close()
				return  
		if self.user:
			self.channel_room = f'user_chatroom_{self.user.id}'
			await self.channel_layer.group_add(self.channel_room, self.channel_name)
		else:
			self.channel_room = "anonymous_chatroom"

	async def receive(self, text_data):
		data = json.loads(text_data)
		action = data.get("action")
		print("receive : ", data)

		if action == "search_user":
			query = data.get("query", "").strip()
			if query:
				results = await self.search_users(query)
				response_data = {"action": "search_results", "users": results}
				await self.send(text_data=json.dumps(response_data))
			return

		if action == "send_invitation":
			target_user_id = data.get("target_user_id")
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
						"type": "chat.message",
						"text": json.dumps(invitation_data)
					}
				)
			return

		if action == "invitation_response":
			response = data.get("response")
			print ("hamza : ", response)
			friendship_id = data.get("friendshipId")
			print ("aarab : ", friendship_id)
			friendship = await self.get_friendship_by_id(friendship_id)

			if friendship:
				print(f"Friendship object: {friendship}")
				user2 = await database_sync_to_async(lambda: friendship.user2)()
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

		if action == "get_invitations":
			# New action: fetch pending invitations for the logged-in user
			invitations = await self.get_pending_invitations()
			response_data = {
				"action": "invitations_list",
				"invitations": invitations,
			}
			await self.send(text_data=json.dumps(response_data))
			return

		# Else, assume it's a chat message.
		new_message = data.get('message')
		sent_by_id = data.get('sent_by')
		send_to_id = data.get('send_to')
		if not new_message:
			return

		sent_by_user = await self.get_user_object(sent_by_id)
		send_to_user = await self.get_user_object(send_to_id)
		blocked_by_receiver = await self.is_blocked(send_to_user, sent_by_user)
		blocked_by_sender = await self.is_blocked(sent_by_user, send_to_user)
		if blocked_by_receiver or blocked_by_sender:
			await self.send(text_data=json.dumps({
				"error": "Cannot send message: Communication is blocked."
			}))
			return

		await self.save_message(sent_by_user, send_to_user, new_message)
		other_user_channel_room = f'user_chatroom_{send_to_id}'
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
		return usr.first() if usr.exists() else None

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
		user_queryset = User.objects.filter(username__icontains=query)
		results = []
		for user in user_queryset:
			friendship = Friendship.objects.filter(
				Q(user1=self.user, user2=user) | Q(user1=user, user2=self.user)
			).first()
			status = friendship.status if friendship else None
			results.append({
				"id": user.id,
				"username": user.username,
				"friendship_status": status,
			})
		return results

	@database_sync_to_async
	def create_friendship(self, sender, target_user_id):
		try:
			target_user = User.objects.get(id=target_user_id)
		except User.DoesNotExist:
			return None
		exists = Friendship.objects.filter(
			Q(user1=sender, user2=target_user) | Q(user1=target_user, user2=sender)
		).exists()
		if exists:
			return None
		return Friendship.objects.create(user1=sender, user2=target_user, status="pending")

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
			# Using select_related to prefetch related objects
			return Friendship.objects.select_related('user1', 'user2', 'blocked_by').get(id=friendship_id)
		except Friendship.DoesNotExist:
			return None


	@database_sync_to_async
	def is_blocked(self, receiver, sender):
		try:
			friendship = Friendship.objects.get(
				Q(user1=receiver, user2=sender) | Q(user1=sender, user2=receiver)
			)
			return friendship.blocked_by and friendship.blocked_by == receiver
		except Friendship.DoesNotExist:
			return False

	@database_sync_to_async
	def get_pending_invitations(self):
		# Retrieve invitations (friendship requests) where the logged-in user is the recipient
		pending_invitations = Friendship.objects.filter(user2=self.user, status="pending")
		# Format the invitation details to send back to the client
		invitations_list = []
		for invitation in pending_invitations:
			invitations_list.append({
				"friendship_id": invitation.id,
				"from_user_id": invitation.user1.id,
				"from_username": invitation.user1.username,
				# If your model has a timestamp field, e.g., created_at, you can format it:
				"sent_at": invitation.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(invitation, "created_at") else ""
			})
		return invitations_list
