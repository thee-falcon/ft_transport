from django.db import models


from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.URLField(blank=True, null=True , default='https://i1.sndcdn.com/avatars-000009619178-sorufr-t1080x1080.jpg')  # Profile picture URL
                                                                        
    def __str__(self):
        return self.user.username