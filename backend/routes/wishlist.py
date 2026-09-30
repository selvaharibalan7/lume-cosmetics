from flask import Blueprint, request, g
from database.database import query_db, execute_db
from utils.response import success, error, not_found
from utils.auth_middleware import token_required
import json

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('/', methods=['GET'])
@token_required
def get_wishlist():
    rows = query_db('''
        SELECT p.*
        FROM wishlist_items w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ?
    ''', (g.user['id'],))
    
    items = []
    for r in rows:
        p = dict(r)
        p['images'] = json.loads(p['images']) if p['images'] else []
        p['in_stock'] = bool(p['in_stock'])
        items.append(p)
        
    return success(data=items)

@wishlist_bp.route('/<product_id>', methods=['POST'])
@token_required
def add_to_wishlist(product_id):
    # Check if product exists
    product = query_db('SELECT id FROM products WHERE id = ?', (product_id,), one=True)
    if not product:
        return not_found("Product not found")
        
    try:
        execute_db(
            'INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
            (g.user['id'], product_id)
        )
        return success(message="Added to wishlist")
    except Exception as e:
        return error(str(e))

@wishlist_bp.route('/<product_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(product_id):
    execute_db(
        'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
        (g.user['id'], product_id)
    )
    return success(message="Removed from wishlist")
