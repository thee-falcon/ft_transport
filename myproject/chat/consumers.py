from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()


class ChatConsumer( AsyncWebsocketConsumer ):
	async def connect(self):
		# print("WebSocket connected!", event)
		await self.accept()

		# Check if the user is authenticated
		is_authenticated = self.scope["user"]
		channel_room = f'user_chatroom_{is_authenticated.id}'
		self.channel_room = channel_room
		
        # Add the user to the group
		await self.channel_layer.group_add(
            channel_room,
            self.channel_name,
        )



	async def receive(self, text_data):

		# # Now you can access their details, for example:
		print('receive', text_data)
		# Parse the received message (assuming it's JSON)
		received_data = json.loads(text_data)
		newMessage = received_data.get('message')
		sent_by_id = received_data.get('sent_by')
		send_to_id = received_data.get('send_to')
		if not newMessage:
			print ("error message in receive")
			return False

		sent_by_user = await self.get_user_object(sent_by_id)
		send_to_user = await self.get_user_object(send_to_id)

		if not sent_by_user:
			print('error sent by user')
		if not send_to_user:
			print('error send to user')
		
		# Save the message to the database
		await self.save_message(sent_by_user, send_to_user, newMessage)

		other_user_channel_room = f'user_chatroom_{send_to_id}'
		print('chat: ', other_user_channel_room)
		self_user = self.scope["user"]
		# Prepare a response
		response_data = {
			'message': newMessage,
			'sent_by': self_user.id,
			'send_to': send_to_id
		}

		await self.channel_layer.group_send(
			other_user_channel_room,
			{
				'type' : 'chat_message',
				'text' : json.dumps(response_data)
			}
		)

		await self.channel_layer.group_send(
			self.channel_room,
			{
				'type' : 'chat_message',
				'text' : json.dumps(response_data)
			}
		)
     


	async def chat_message(self, event):
		print('chat_message', event)
		await self.send(text_data=event['text'])


	async def disconnect(self, event):
		print('disconected', event)
        # Called when the socket closes


	@database_sync_to_async
	def get_user_object(self, user_id):
		usr = User.objects.filter(id=user_id)
		if usr.exists():
			obj = usr.first()
		else:
			obj = None
		return obj

	@database_sync_to_async
	def save_message(self, sent_by_user, send_to_user, message_content):
        # Create a new message and save it to the database
		message = Message(
			sent_by=sent_by_user,
			send_to=send_to_user,
			message=message_content
		)
		message.save()

	# @database_sync_to_async
	# def fetch_message_history(self, user, friend):
	# 	# Returns a list of dictionaries containing message data
	# 	messages = Message.objects.filter(
	# 		Q(sent_by=user, send_to=friend) | Q(sent_by=friend, send_to=user)
	# 	).order_by('timestamp')
	# 	return [
	# 		{
	# 			'id': m.id,
	# 			'sent_by': m.sent_by.id,
	# 			'send_to': m.send_to.id,
	# 			'message': m.message,
	# 			'timestamp': m.timestamp.isoformat(),
	# 		}
	# 		for m in messages
	# 	]

