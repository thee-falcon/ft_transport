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
    profile = UserProfileSerializer(required=False)  # Allows profile data to be nested

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'profile']
    
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
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data.get('password'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Creating the UserProfile object linked to the User object
        UserProfile.objects.create(user=user, **profile_data)
        return user



from django.contrib.auth.hashers import make_password

def update(self, instance, validated_data):
    # Check if the password is being updated
    if 'password' in validated_data:
        # Set the password using set_password to ensure it's hashed
        instance.set_password(validated_data['password'])
        validated_data.pop('password')  # Remove password from validated data to prevent duplication

    # Update other fields
    for attr, value in validated_data.items():
        setattr(instance, attr, value)

    instance.save()
    return instance