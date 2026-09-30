from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from datetime import datetime, timedelta
from database.database import get_db, execute_db, query_db

class AuthService:
    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    @staticmethod
    def verify_password(password_hash, password):
        return check_password_hash(password_hash, password)

    @staticmethod
    def create_user(name, email, password):
        db = get_db()
        existing = query_db('SELECT id FROM users WHERE email = ?', (email,), one=True)
        if existing:
            return None, "Email already registered"

        password_hash = AuthService.hash_password(password)
        try:
            user_id = execute_db(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                (name, email, password_hash)
            )
            return user_id, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def authenticate(email, password):
        user = query_db('SELECT * FROM users WHERE email = ?', (email,), one=True)
        if not user:
            return None, "Invalid email or password"

        if not AuthService.verify_password(user['password_hash'], password):
            return None, "Invalid email or password"

        token = secrets.token_hex(32)
        expires_at = (datetime.utcnow() + timedelta(days=30)).isoformat()
        
        execute_db(
            'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            (user['id'], token, expires_at)
        )
        return {"token": token, "user": dict(user)}, None

    @staticmethod
    def get_user_by_token(token):
        if not token:
            return None
            
        now = datetime.utcnow().isoformat()
        user_data = query_db(
            '''
            SELECT u.* FROM users u
            JOIN auth_tokens t ON u.id = t.user_id
            WHERE t.token = ? AND t.expires_at > ?
            ''',
            (token, now),
            one=True
        )
        return dict(user_data) if user_data else None

    @staticmethod
    def logout(token):
        execute_db('DELETE FROM auth_tokens WHERE token = ?', (token,))
        return True
