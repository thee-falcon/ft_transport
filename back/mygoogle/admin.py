from django.contrib import admin
from .models import UserProfile  # Import your model

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "nickname", "profile_picture", "matches_won", "matches_lost", "matches_count")
    search_fields = ("user__username", "nickname")
    list_filter = ("matches_won", "matches_lost", "tournaments_won", "tournaments_lost")

