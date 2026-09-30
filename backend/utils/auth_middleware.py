from functools import wraps
from flask import request, g
from services.auth_service import AuthService
from utils.response import unauthorized

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return unauthorized('Missing or invalid token')
            
        token = auth_header.split(' ')[1]
        user = AuthService.get_user_by_token(token)
        
        if not user:
            return unauthorized('Invalid or expired token')
            
        g.user = user
        return f(*args, **kwargs)
    return decorated
