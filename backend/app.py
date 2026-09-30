import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from database.database import init_db, close_db

def create_app(config_name='default'):
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
    app = Flask(__name__, instance_relative_config=True, static_folder=static_dir, static_url_path='/')
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Load configuration
    from config import config
    app.config.from_object(config[config_name])
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
        
    # Register teardown
    app.teardown_appcontext(close_db)
    
    # Initialize DB (creates tables if not exists)
    init_db(app)
    
    # Register Blueprints
    from routes.auth import auth_bp
    from routes.products import products_bp
    from routes.cart import cart_bp
    from routes.orders import orders_bp
    from routes.profile import profile_bp
    from routes.addresses import addresses_bp
    from routes.wishlist import wishlist_bp
    from routes.reviews import reviews_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(addresses_bp, url_prefix='/api/addresses')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    
    # Basic health check
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok'})
        
    # Serve React Frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
            
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith('/api/'):
            return jsonify({'success': False, 'message': 'Endpoint not found'}), 404
        return send_from_directory(app.static_folder, 'index.html')
        
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

    return app

app = create_app('default')

if __name__ == '__main__':
    app = create_app('development')
    app.run(debug=True, port=5000)
