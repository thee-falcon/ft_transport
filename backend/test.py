import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import send_mail

send_mail(
    'Test Email',
    'This is a test email from Django!',
    'makranomar66@gmail.com',
    ['makranomar66@gmail.com'],
    fail_silently=False,
)
print("Email sent successfully!")