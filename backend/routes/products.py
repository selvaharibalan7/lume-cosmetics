import json
from flask import Blueprint, request
from database.database import query_db
from utils.response import success, error, not_found

products_bp = Blueprint('products', __name__)

def _format_product(row):
    """Helper to deserialize JSON fields from sqlite."""
    p = dict(row)
    p['images'] = json.loads(p['images']) if p['images'] else []
    p['benefits'] = json.loads(p['benefits']) if p['benefits'] else []
    p['ingredients'] = json.loads(p['ingredients']) if p['ingredients'] else []
    p['tags'] = json.loads(p['tags']) if p['tags'] else []
    # Fetch variants
    variants = query_db('SELECT * FROM product_variants WHERE product_id = ?', (p['id'],))
    p['variants'] = [dict(v) for v in variants]
    
    # In SQLite, booleans are 1/0
    p['in_stock'] = bool(p['in_stock'])
    return p

@products_bp.route('/', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    query = request.args.get('q', '').lower()
    
    sql = 'SELECT p.*, c.name as category FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1'
    args = []
    
    if category_id:
        sql += ' AND p.category_id = ?'
        args.append(category_id)
        
    rows = query_db(sql, tuple(args))
    products = [_format_product(row) for row in rows]
    
    if query:
        products = [
            p for p in products 
            if query in p['name'].lower() or query in p['brand'].lower() or query in p['category'].lower()
        ]
        
    return success(data=products)

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    row = query_db(
        'SELECT p.*, c.name as category FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?', 
        (product_id,), 
        one=True
    )
    if not row:
        return not_found("Product not found")
        
    return success(data=_format_product(row))

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    rows = query_db('SELECT * FROM categories ORDER BY sort_order')
    return success(data=[dict(r) for r in rows])
