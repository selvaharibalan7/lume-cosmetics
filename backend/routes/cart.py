from flask import Blueprint, request, g
from database.database import query_db, execute_db
from utils.response import success, error, not_found
from utils.auth_middleware import token_required
import json

cart_bp = Blueprint('cart', __name__)

def _get_cart_items(user_id):
    sql = '''
        SELECT c.id as cart_item_id, c.quantity, c.variant_id, 
               p.id, p.name, p.brand, p.price, p.original_price, p.images, p.in_stock,
               v.name as variant_name, v.price as variant_price, v.stock as variant_stock
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        LEFT JOIN product_variants v ON c.variant_id = v.id
        WHERE c.user_id = ?
    '''
    rows = query_db(sql, (user_id,))
    
    items = []
    for r in rows:
        images = json.loads(r['images']) if r['images'] else []
        
        # Determine actual price based on variant
        price = r['variant_price'] if r['variant_price'] is not None else r['price']
        
        item = {
            'id': r['cart_item_id'],
            'quantity': r['quantity'],
            'product': {
                'id': r['id'],
                'name': r['name'],
                'brand': r['brand'],
                'price': r['price'],
                'images': images,
                'in_stock': bool(r['in_stock'])
            }
        }
        
        if r['variant_id']:
            item['variant'] = {
                'id': r['variant_id'],
                'name': r['variant_name'],
                'price': r['variant_price'],
                'stock': r['variant_stock']
            }
            # Override product price for convenience if variant exists
            item['product']['price'] = price
            
        items.append(item)
    return items

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart():
    items = _get_cart_items(g.user['id'])
    return success(data=items)

@cart_bp.route('/', methods=['POST'])
@token_required
def add_to_cart():
    data = request.get_json()
    if not data or 'product_id' not in data:
        return error("Product ID is required")
        
    product_id = data['product_id']
    variant_id = data.get('variant_id')
    quantity = data.get('quantity', 1)
    
    # Check if product exists
    product = query_db('SELECT in_stock FROM products WHERE id = ?', (product_id,), one=True)
    if not product:
        return not_found("Product not found")
        
    if not product['in_stock']:
        return error("Product is out of stock")
        
    # Check if already in cart
    existing = query_db(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (? IS NULL AND variant_id IS NULL))',
        (g.user['id'], product_id, variant_id, variant_id),
        one=True
    )
    
    if existing:
        new_qty = existing['quantity'] + quantity
        execute_db('UPDATE cart_items SET quantity = ? WHERE id = ?', (new_qty, existing['id']))
    else:
        execute_db(
            'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
            (g.user['id'], product_id, variant_id, quantity)
        )
        
    return success(data=_get_cart_items(g.user['id']), message="Added to cart")

@cart_bp.route('/<int:item_id>', methods=['PUT'])
@token_required
def update_cart_item(item_id):
    data = request.get_json()
    if not data or 'quantity' not in data:
        return error("Quantity is required")
        
    quantity = max(0, int(data['quantity']))
    
    existing = query_db('SELECT id FROM cart_items WHERE id = ? AND user_id = ?', (item_id, g.user['id']), one=True)
    if not existing:
        return not_found("Cart item not found")
        
    if quantity == 0:
        execute_db('DELETE FROM cart_items WHERE id = ?', (item_id,))
    else:
        execute_db('UPDATE cart_items SET quantity = ? WHERE id = ?', (quantity, item_id))
        
    return success(data=_get_cart_items(g.user['id']))

@cart_bp.route('/<int:item_id>', methods=['DELETE'])
@token_required
def delete_cart_item(item_id):
    execute_db('DELETE FROM cart_items WHERE id = ? AND user_id = ?', (item_id, g.user['id']))
    return success(data=_get_cart_items(g.user['id']))

@cart_bp.route('/', methods=['DELETE'])
@token_required
def clear_cart():
    execute_db('DELETE FROM cart_items WHERE user_id = ?', (g.user['id'],))
    return success(data=[])
