from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Invitation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_invites', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_invites', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, default='PENDING')  # PENDING, ACCEPTED, DECLINED, EXPIRED
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def is_expired(self):
        """Check if the invitation has expired (after 1 minute)"""
        return timezone.now() > self.created_at + timedelta(minutes=1)
    
    def expire_if_needed(self):
        """Mark the invitation as expired if it's beyond the expiration time"""
        if self.status == 'PENDING' and self.is_expired:
            self.status = 'EXPIRED'
            self.save()
            return True
        return False


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
    otp_enabled = models.BooleanField(default=False)

    def __str__(self):
        return self.nickname or self.user.username
