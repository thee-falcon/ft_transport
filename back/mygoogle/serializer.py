from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib.auth.hashers import make_password

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'profile_picture', 'nickname', 'matches_won', 'matches_lost', 'matches_count',
            'tournaments_won', 'tournaments_lost', 'tournaments_count'
        ]

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)  # not exposed
    profile = UserProfileSerializer(required=False) 
    profile_picture = serializers.ImageField(source='profile.profile_picture', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'profile', 'profile_picture']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile_picture = profile_data.pop('profile_picture', '/blue2.jpg')  # Default value

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        UserProfile.objects.create(user=user, profile_picture=profile_picture, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile_picture = profile_data.get('profile_picture')

        # Update user fields
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Update profile fields
        profile = instance.profile  
        if profile_picture:
            profile.profile_picture = profile_picture  

        for attr, value in profile_data.items():
            setattr(profile, attr, value)

        profile.save()
        return instance

from rest_framework import serializers
from .models import GameHistory

class GameHistorySerializer(serializers.ModelSerializer):
	sent_by = serializers.CharField(source='sent_by.username')
	send_to = serializers.CharField(source='send_to.username')

	class Meta:
		model = GameHistory
		fields = ['sent_by', 'send_to', 'result', 'timestamp']
