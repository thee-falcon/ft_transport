from django.contrib import admin
# from .models import InvetationAccept
# from .models import DataUser, Message
from .models import Friendship , Message

admin.site.register(Friendship)
admin.site.register(Message)
# class Message(admin.TabularInline):
#     model = Message


# class DataUserAdmin(admin.ModelAdmin):
#     inlines = [Message]
#     class Meta:
#         model = DataUser

# admin.site.register(DataUser, DataUserAdmin)