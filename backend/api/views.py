from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.

@api_view(["GET", "POST"])
def index(req) :
    return Response("WELCOM TO FT_TRANCE APIS")