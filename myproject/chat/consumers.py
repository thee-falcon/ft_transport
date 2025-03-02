from channels.generic.websocket import AsyncWebsocketConsumer
import json, time
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message

from asgiref.sync import async_to_sync
from .models import Friendship
from django.db.models import Q


User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept()

        # Check if the user is authenticated
		user = self.scope["user"]
		channel_room = f'user_chatroom_{user.id}'
		self.channel_room = channel_room

        # Add the user to the group
		await self.channel_layer.group_add(
			channel_room,
			self.channel_name,
		)

	async def receive(self, text_data):
		print('receive', text_data)
		data = json.loads(text_data)
		action = data.get("action")

		if action == "search_user":
            # Handle search query
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
			sender = self.scope["user"]
            
			# Create a pending friendship
			friendship = await self.create_friendship(sender, target_user_id)
			if friendship:
				# Create an invitation id (using timestamp for uniqueness)
				invitation_id = f"{sender.id}_{target_user_id}_{int(time.time())}"
				invitation_data = {
					"action": "invitation",
					"invitationId": invitation_id,
					"fromUserId": sender.id,
					"fromUsername": sender.username,
					"friendshipId": friendship.id,  # Useful for processing response later
				}
				target_room = f"user_chatroom_{target_user_id}"
				await self.channel_layer.group_send(
					target_room,
					{
						"type": "invitation_message",
						"text": json.dumps(invitation_data)
					}
				)
			else:
				# Optionally, handle the case where a friendship already exists.
				pass
			return


		if action == "invitation_response":
			response = data.get("response")  # "accepted" or "declined"
			friendship_id = data.get("friendshipId")  # Use the real friendship ID!
			sender = self.scope["user"]

			friendship = await self.get_friendship_by_id(friendship_id)

			if friendship:
				user2 = await database_sync_to_async(lambda: friendship.user2)()
				if user2 == sender:
					# Update the friendship status based on response
					if response == "accepted":
						friendship.status = "accepted"
					elif response == "declined":
						friendship.status = "declined"
					await self.save_friendship(friendship)

				# Notify the sender about the response
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
				# Handle the case where the friendship request doesn't exist or is invalid
				pass

			return
		

		if action == "block_user":
			# Define sender here:
			sender = self.scope["user"]
			target_user_id = data.get("target_user_id")
			# Find the friendship between the sender and the target
			friendship = await self.get_friendship(sender, target_user_id)
			if friendship:
				# Set the sender as the blocker
				friendship.blocked_by = sender
				await self.save_friendship(friendship)
				response_data = {
					"action": "block_ack",
					"message": "You have blocked this user. You cannot send messages to them."
				}
				await self.send(text_data=json.dumps(response_data))
			else:
				# Optionally, create a new friendship record or notify the user
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

		# Check if either party has blocked the other.
		blocked_by_receiver = await self.is_blocked(send_to_user, sent_by_user)
		blocked_by_sender = await self.is_blocked(sent_by_user, send_to_user)
		if blocked_by_receiver or blocked_by_sender:
			await self.send(text_data=json.dumps({
				"error": "Cannot send message: Communication is blocked."
			}))
			return

        # Save the message to the database
		await self.save_message(sent_by_user, send_to_user, new_message)

		other_user_channel_room = f'user_chatroom_{send_to_id}'
		print('chat: ', other_user_channel_room)
		self_user = self.scope["user"]

		response_data = {
			'message': new_message,
			'sent_by': self_user.id,
			'send_to': send_to_id
		}

        # Send the message to the recipient's room
		await self.channel_layer.group_send(
			other_user_channel_room,
			{
				'type': 'chat_message',
				'text': json.dumps(response_data)
			}
		)

        # Also send the message to the sender's room
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

	async def disconnect(self, event):
		print('disconnected', event)
		# Remove the user from the group on disconnect
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
		# Return a list of dictionaries containing the user's id and username
		return list(User.objects.filter(username__icontains=query).values("id", "username"))


	@database_sync_to_async
	def create_friendship(self, sender, target_user_id):
		try:
			target_user = User.objects.get(id=target_user_id)
		except User.DoesNotExist:
			return None

		# Check if a friendship already exists (either direction)
		exists = Friendship.objects.filter(
        	Q(user1=sender, user2=target_user) | Q(user1=target_user, user2=sender)
		).exists()

		if exists:
			return None

		# Create a new pending friendship
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
			return Friendship.objects.get(id=friendship_id)
		except Friendship.DoesNotExist:
			return None
	
	@database_sync_to_async
	def get_user1_from_friendship(self, friendship):
		return friendship.user1
	
	@database_sync_to_async
	def is_blocked(self, receiver, sender):
		"""
		Check if the receiver has blocked the sender.
		In our Friendship model, if `blocked_by` equals the receiver,
		then the sender is blocked.
		"""
		try:
			friendship = Friendship.objects.get(
				Q(user1=receiver, user2=sender) | Q(user1=sender, user2=receiver)
			)
			if friendship.blocked_by and friendship.blocked_by == receiver:
				return True
			return False
		except Friendship.DoesNotExist:
			return False

