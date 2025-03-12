from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class TwoFactorBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # verify regular credentials
        user = super().authenticate(request, username, password, **kwargs)
        
        if not user:
            return None
            
        # check 2FA status
        if user.otp_enabled:
            # check session for 2FA verification
            if not request.session.get('otp_verified', False):
                # create a partial user object to track 2FA needs
                user.partial_login = True
                return user
                
        # return fully authenticated user
        return user
    
'''
What This Backend Does
Standard Authentication: First verifies username/password using Django's default auth

2FA Check: If credentials are valid, checks if user has 2FA enabled

Verification Flow:

If 2FA enabled but not verified: Returns user with partial_login flag

If 2FA enabled and verified: Returns fully authenticated user

If 2FA disabled: Returns authenticated user directly
'''