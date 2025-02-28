import secrets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.utils import timezone
from two_factor.models import VerificationCode
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from two_factor.permissions import Is2FAVerified

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated, Is2FAVerified]

    def get(self, request):
        return Response({'message': 'This is a 2FA-protected endpoint!'})

class SensitiveDataView(APIView):
    permission_classes = [IsAuthenticated, Is2FAVerified]

    def get(self, request):
        return Response({"message": "This is protected by 2FA!"})

User = get_user_model()

def generate_code():
    return ''.join(secrets.choice('0123456789') for _ in range(6))

@api_view(['GET'])
@permission_classes([IsAuthenticated, Is2FAVerified])
def sensitive_function_view(request):
    return Response({"message": "Protected function view"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_code(request):
    user = request.user
    VerificationCode.objects.filter(user=user).delete()
    
    code = generate_code()
    expires_at = timezone.now() + timezone.timedelta(minutes=30)
    
    VerificationCode.objects.create(
        user=user,
        code=code,
        expires_at=expires_at
    )
    
    send_mail(
        'Your 2FA Code',
        f'Your verification code is: {code}',
        'noreply@example.com',
        [user.email],
        fail_silently=False,
    )
    
    return Response({'detail': 'Verification code sent'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_code(request):
    user = request.user
    code = request.data.get('code', '').strip()
    
    print(f"Verification attempt for {user.email}")
    print(f"Submitted code: {code}")

    verification_code = VerificationCode.objects.filter(
        user=user,
        code=code,
        expires_at__gte=timezone.now()
    ).first()
    
    if verification_code:
        print("Valid code found!")
        print(f"Expires at: {verification_code.expires_at}")
        verification_code.delete()
        # generate new token with 2FA verified
        refresh = RefreshToken.for_user(user)
        refresh['twofa_verified'] = True
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)
    else:
        print("No valid code found in DB")
        print("Existing codes:", VerificationCode.objects.filter(user=user).values_list('code', flat=True))
    
    return Response({'detail': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)

