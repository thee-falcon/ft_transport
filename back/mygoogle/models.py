from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")  # Use related_name="profile"
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, default='profile_pics/default.jpg')  # Fixed

    nickname = models.CharField(max_length=10, blank=True, null=True)
    matches_won = models.IntegerField(default=0)
    matches_lost = models.IntegerField(default=0)
    matches_count = models.IntegerField(default=0)
    tournaments_won = models.IntegerField(default=0)
    tournaments_lost = models.IntegerField(default=0)
    tournaments_count = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname or self.user.username
