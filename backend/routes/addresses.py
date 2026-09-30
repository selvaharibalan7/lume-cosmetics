from flask import Blueprint, request, g
from database.database import query_db, execute_db, get_db
from utils.response import success, error, not_found
from utils.auth_middleware import token_required
from utils.validators import validate_required_fields

addresses_bp = Blueprint('addresses', __name__)

@addresses_bp.route('/', methods=['GET'])
@token_required
def get_addresses():
    rows = query_db('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id ASC', (g.user['id'],))
    return success(data=[dict(r) for r in rows])

@addresses_bp.route('/', methods=['POST'])
@token_required
def add_address():
    data = request.get_json()
    errors = validate_required_fields(data, ['name', 'line1', 'city', 'state', 'zip'])
    if errors:
        return error("Validation failed", errors=errors)
        
    is_default = bool(data.get('is_default', False))
    
    db = get_db()
    try:
        # If this is default, remove default from others
        if is_default:
            db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', (g.user['id'],))
            
        cur = db.execute('''
            INSERT INTO addresses (user_id, name, line1, line2, city, state, zip, phone, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            g.user['id'], data['name'], data['line1'], data.get('line2'),
            data['city'], data['state'], data['zip'], data.get('phone'),
            1 if is_default else 0
        ))
        db.commit()
        return success(data={'id': cur.lastrowid}, message="Address added successfully")
    except Exception as e:
        db.rollback()
        return error(str(e))

@addresses_bp.route('/<int:addr_id>', methods=['DELETE'])
@token_required
def delete_address(addr_id):
    execute_db('DELETE FROM addresses WHERE id = ? AND user_id = ?', (addr_id, g.user['id']))
    return success(message="Address deleted")

@addresses_bp.route('/<int:addr_id>/default', methods=['PUT'])
@token_required
def set_default(addr_id):
    db = get_db()
    
    # Verify address exists and belongs to user
    addr = db.execute('SELECT id FROM addresses WHERE id = ? AND user_id = ?', (addr_id, g.user['id'])).fetchone()
    if not addr:
        return not_found("Address not found")
        
    try:
        db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', (g.user['id'],))
        db.execute('UPDATE addresses SET is_default = 1 WHERE id = ?', (addr_id,))
        db.commit()
        return success(message="Default address updated")
    except Exception as e:
        db.rollback()
        return error(str(e))
