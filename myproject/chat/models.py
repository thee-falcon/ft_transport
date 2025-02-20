from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth.models import User
from django.db import models

User = get_user_model()

class Friendship(models.Model):
	user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends1")
	user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends2")
	ubdated = models.DateTimeField(auto_now=True)
	timestart = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ("user1", "user2")

	def __str__(self):
		return f"{self.user1} <-> {self.user2}"

# Function to get a user's friends
def get_friends(user):
	friends1 = Friendship.objects.filter(user1=user).values_list("user2", flat=True)
	friends2 = Friendship.objects.filter(user2=user).values_list("user1", flat=True)
	friend_ids = set(friends1) | set(friends2)
	return User.objects.filter(id__in=friend_ids)


class Message(models.Model):
    sent_by = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    send_to = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sent_by.username} to {self.send_to.username} at {self.timestamp}"
