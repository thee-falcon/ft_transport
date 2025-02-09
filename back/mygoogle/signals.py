from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile
from django.contrib.auth.signals import user_logged_in
from django.utils.timezone import now
from django.db.models.signals import post_delete


# This function runs after a new User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:  # Only create a profile for new users
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()



@receiver(user_logged_in)
def update_last_login(sender, request, user, **kwargs):
    user.last_login = now()
    user.save()


@receiver(post_delete, sender=User)
def delete_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):  # Check if profile exists
        instance.profile.delete()

