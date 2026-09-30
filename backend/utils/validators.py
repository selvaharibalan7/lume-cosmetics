import re

def validate_email(email):
    if not email:
        return False
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if not password or len(password) < 8:
        return False
    return True

def validate_required_fields(data, required_fields):
    errors = {}
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            errors[field] = f"{field} is required"
    return errors
