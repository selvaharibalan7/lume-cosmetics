from flask import Blueprint, request
from services.auth_service import AuthService
from utils.response import success, error, unauthorized
from utils.validators import validate_email, validate_password, validate_required_fields
from utils.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return error("Invalid JSON data")

    errors = validate_required_fields(data, ['name', 'email', 'password'])
    if not validate_email(data.get('email')):
        errors['email'] = "Invalid email format"
    if not validate_password(data.get('password')):
        errors['password'] = "Password must be at least 8 characters long"

    if errors:
        return error("Validation failed", errors=errors)

    user_id, err = AuthService.create_user(data['name'], data['email'], data['password'])
    if err:
        return error(err, status_code=409)

    return success(message="User registered successfully")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return error("Invalid JSON data")

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return error("Email and password are required")

    result, err = AuthService.authenticate(email, password)
    if err:
        return unauthorized(err)

    # Do not expose password hash in response
    if 'password_hash' in result['user']:
        del result['user']['password_hash']

    return success(data=result, message="Logged in successfully")

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1]
    AuthService.logout(token)
    return success(message="Logged out successfully")

@auth_bp.route('/me', methods=['GET'])
@token_required
def me():
    from flask import g
    user = dict(g.user)
    if 'password_hash' in user:
        del user['password_hash']
    return success(data=user)
