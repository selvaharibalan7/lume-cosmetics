from flask import jsonify


def success(data=None, message=None, status_code=200):
    """Return a standardized success response."""
    payload = {'success': True}
    if message:
        payload['message'] = message
    if data is not None:
        payload['data'] = data
    return jsonify(payload), status_code


def created(data=None, message=None):
    """Return a 201 Created response."""
    return success(data=data, message=message, status_code=201)


def error(message, status_code=400, errors=None):
    """Return a standardized error response."""
    payload = {'success': False, 'message': message}
    if errors:
        payload['errors'] = errors
    return jsonify(payload), status_code


def not_found(message='Resource not found'):
    return error(message, 404)


def unauthorized(message='Authentication required'):
    return error(message, 401)


def forbidden(message='Access denied'):
    return error(message, 403)


def conflict(message='Resource already exists'):
    return error(message, 409)


def server_error(message='Internal server error'):
    return error(message, 500)
