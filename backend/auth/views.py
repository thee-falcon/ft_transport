from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.forms import UserCreationForm

@api_view(["POST"])
def register(req) :
    username  = req.POST["username"]
    password  = req.POST["password"]
    repeat_password = req.POST["repeat_password"]
    
    if password != repeat_password :
        return Response("password doesn't match!")
    print(f"passwordbefor hash -> {password}")
    hashed_passowrd = make_password(password)
    print(f"passwordafter hash -> {hashed_passowrd}")
    return Response({
        "message" : "User Created successfuly",
    })
