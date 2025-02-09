from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile  # Import Profile model

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    picture = serializers.SerializerMethodField()  # Get profile picture dynamically
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email', 'picture']
        # nickname - profile picture - lost matchs - won matches -  matches count - lost tournaments - won tournaments - tournaments count 
    def get_picture(self, obj):
        return obj.profile.avatar if hasattr(obj, 'profile') and obj.profile.avatar else None

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password']) 
        Profile.objects.create(user=user, avatar="https://histoire-image.org/sites/default/files/2022-02/hitler-imperatif.jpg")  # Change to default image if needed
        user.save()
        return user