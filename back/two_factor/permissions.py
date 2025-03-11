from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class Is2FAVerified(BasePermission):
    def has_permission(self, request, view):
        auth = JWTAuthentication()
        try:
            user_auth_tuple = auth.authenticate(request)
        except AuthenticationFailed:
            return False

        if user_auth_tuple is not None:
            _, token = user_auth_tuple
            # check the custom claim we added
            return token.payload.get('twofa_verified', False)
        return False
