from flask import Blueprint, request, g
from database.database import query_db, execute_db
from utils.response import success, error
from utils.auth_middleware import token_required
from utils.validators import validate_required_fields

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/product/<product_id>', methods=['GET'])
def get_product_reviews(product_id):
    rows = query_db('''
        SELECT r.*, u.name as user_name, u.avatar_url 
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    ''', (product_id,))
    
    return success(data=[dict(r) for r in rows])

@reviews_bp.route('/product/<product_id>', methods=['POST'])
@token_required
def add_review(product_id):
    data = request.get_json()
    errors = validate_required_fields(data, ['rating', 'title', 'body'])
    if errors:
        return error("Validation failed", errors=errors)
        
    rating = int(data['rating'])
    if rating < 1 or rating > 5:
        return error("Rating must be between 1 and 5")
        
    # Check if product exists
    product = query_db('SELECT id FROM products WHERE id = ?', (product_id,), one=True)
    if not product:
        return error("Product not found", 404)
        
    try:
        execute_db('''
            INSERT INTO reviews (product_id, user_id, rating, title, body, skin_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            product_id, g.user['id'], rating, data['title'], data['body'], data.get('skin_type')
        ))
        
        # Update product rating and count
        execute_db('''
            UPDATE products 
            SET review_count = review_count + 1,
                rating = (
                    SELECT CAST(SUM(rating) AS REAL) / COUNT(rating)
                    FROM reviews WHERE product_id = ?
                )
            WHERE id = ?
        ''', (product_id, product_id))
        
        return success(message="Review submitted successfully")
    except Exception as e:
        if 'UNIQUE constraint failed' in str(e):
            return error("You have already reviewed this product", 409)
        return error(str(e))
