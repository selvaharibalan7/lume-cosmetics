from flask import Blueprint, request, g
from database.database import query_db, execute_db, get_db
from utils.response import success, error, not_found
from utils.auth_middleware import token_required
from utils.validators import validate_required_fields
import uuid
import json
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

def _format_order(row):
    order = dict(row)
    order['items'] = []
    
    # Fetch items
    items = query_db('''
        SELECT i.quantity, i.price_at_purchase, i.variant_id,
               p.id as product_id, p.name, p.brand, p.images, p.in_stock,
               v.name as variant_name, v.shade
        FROM order_items i
        JOIN products p ON i.product_id = p.id
        LEFT JOIN product_variants v ON i.variant_id = v.id
        WHERE i.order_id = ?
    ''', (order['id'],))
    
    for item in items:
        images = json.loads(item['images']) if item['images'] else []
        formatted_item = {
            'quantity': item['quantity'],
            'price': item['price_at_purchase'],
            'product': {
                'id': item['product_id'],
                'name': item['name'],
                'brand': item['brand'],
                'images': images,
                'in_stock': bool(item['in_stock'])
            }
        }
        if item['variant_id']:
            formatted_item['variant'] = {
                'id': item['variant_id'],
                'name': item['variant_name'],
                'shade': item['shade']
            }
        order['items'].append(formatted_item)
        
    # Fetch address
    if order.get('address_id'):
        addr = query_db('SELECT * FROM addresses WHERE id = ?', (order['address_id'],), one=True)
        if addr:
            order['address'] = dict(addr)
            
    return order

@orders_bp.route('/', methods=['GET'])
@token_required
def get_orders():
    rows = query_db('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', (g.user['id'],))
    orders = [_format_order(row) for row in rows]
    return success(data=orders)

@orders_bp.route('/<order_id>', methods=['GET'])
@token_required
def get_order(order_id):
    row = query_db('SELECT * FROM orders WHERE id = ? AND user_id = ?', (order_id, g.user['id']), one=True)
    if not row:
        return not_found("Order not found")
    return success(data=_format_order(row))

@orders_bp.route('/', methods=['POST'])
@token_required
def create_order():
    data = request.get_json()
    if not data:
        return error("Invalid data")
        
    errors = validate_required_fields(data, ['address_id', 'payment_method'])
    if errors:
        return error("Validation failed", errors=errors)
        
    # Calculate total and get items
    total = 0
    items_to_insert = []
    
    if 'items' in data:
        # Frontend passed items directly
        for item in data['items']:
            price = item.get('price', 0)
            total += price * item.get('quantity', 1)
            items_to_insert.append({
                'product_id': item.get('product_id'),
                'variant_id': item.get('variant_id'),
                'quantity': item.get('quantity', 1),
                'price': price
            })
    else:
        # Get cart items
        cart_items = query_db('''
            SELECT c.*, p.price, v.price as variant_price
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN product_variants v ON c.variant_id = v.id
            WHERE c.user_id = ?
        ''', (g.user['id'],))
        
        if not cart_items:
            return error("Cart is empty")
            
        for item in cart_items:
            price = item['variant_price'] if item['variant_price'] is not None else item['price']
            total += price * item['quantity']
            items_to_insert.append({
                'product_id': item['product_id'],
                'variant_id': item['variant_id'],
                'quantity': item['quantity'],
                'price': price
            })
            
    if total < 50:
        total += 5.99
        
    order_id = f"ORD-{datetime.utcnow().strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"
    
    db = get_db()
    try:
        # Create order
        db.execute('''
            INSERT INTO orders (id, user_id, status, total, address_id, payment_method)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (order_id, g.user['id'], 'processing', total, data['address_id'], data['payment_method']))
        
        # Move items
        for item in items_to_insert:
            db.execute('''
                INSERT INTO order_items (order_id, product_id, variant_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?, ?)
            ''', (order_id, item['product_id'], item.get('variant_id'), item['quantity'], item['price']))
            
        # Clear cart
        db.execute('DELETE FROM cart_items WHERE user_id = ?', (g.user['id'],))
        
        db.commit()
    except Exception as e:
        db.rollback()
        return error(f"Failed to create order: {str(e)}")
        
    return success(data={'order_id': order_id}, message="Order created successfully")
