from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth.models import User
from django.db import models

User = get_user_model()

class Friendship(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]

    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendships_initiated")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendships_received")
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("accepted", "Accepted"), ("declined", "Declined")]
    )
    # New field: stores the user who blocked this friendship (if any)
    blocked_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="friendships_blocked")

    timestart = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user1", "user2")

    def __str__(self):
        return f"{self.user1} -> {self.user2} ({self.status})" + (f" [Blocked by {self.blocked_by}]" if self.blocked_by else "")


# Function to get a user's accepted friends
def get_friends(user):
    friends1 = Friendship.objects.filter(user1=user, status="accepted").values_list("user2", flat=True)
    friends2 = Friendship.objects.filter(user2=user, status="accepted").values_list("user1", flat=True)
    friend_ids = set(friends1) | set(friends2)
    return User.objects.filter(id__in=friend_ids)

class Message(models.Model):
    sent_by = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    send_to = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sent_by.username} to {self.send_to.username} at {self.timestamp}"
