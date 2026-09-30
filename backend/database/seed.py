"""Seed the database with initial product and category data."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import create_app
from database.database import get_db, execute_db

CATEGORIES = [
    {'name': 'Skincare', 'icon_name': 'leaf', 'sort_order': 1},
    {'name': 'Foundation', 'icon_name': 'foundation', 'sort_order': 2},
    {'name': 'Serums', 'icon_name': 'sparkle', 'sort_order': 3},
    {'name': 'Moisturizers', 'icon_name': 'droplet', 'sort_order': 4},
    {'name': 'Eye Care', 'icon_name': 'eye', 'sort_order': 5},
    {'name': 'Lip Care', 'icon_name': 'lipstick', 'sort_order': 6},
    {'name': 'Setting', 'icon_name': 'star', 'sort_order': 7},
    {'name': 'Cleansers', 'icon_name': 'shield', 'sort_order': 8},
]

PRODUCTS = [
    {
        'id': 'p1',
        'name': 'Luminous Glow Serum',
        'brand': 'Aurelia',
        'category': 'Serums',
        'price': 68,
        'original_price': 85,
        'rating': 4.7,
        'review_count': 342,
        'images': json.dumps([
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&h=600&fit=crop&auto=format',
        ]),
        'description': 'A lightweight brightening serum that delivers an instant glow and visibly reduces dark spots over time.',
        'benefits': json.dumps(['Brightens complexion', 'Reduces dark spots', 'Antioxidant protection', 'Hydrating']),
        'ingredients': json.dumps([
            {'id': 'i1', 'name': 'Ascorbic Acid (Vitamin C)', 'purpose': 'Brightening', 'safe': True, 'description': 'Potent antioxidant'},
            {'id': 'i2', 'name': 'Niacinamide', 'purpose': 'Pore minimizing', 'safe': True, 'description': 'Reduces pores'},
            {'id': 'i3', 'name': 'Hyaluronic Acid', 'purpose': 'Hydration', 'safe': True, 'description': 'Draws moisture'},
        ]),
        'tags': json.dumps(['brightening', 'vitamin-c', 'anti-aging', 'fragrance-free']),
        'in_stock': 1,
        'vendor_name': 'Aurelia Beauty Co.',
        'variants': [],
    },
    {
        'id': 'p2',
        'name': 'Velvet Matte Foundation',
        'brand': 'Lumiere',
        'category': 'Foundation',
        'price': 48,
        'original_price': None,
        'rating': 4.5,
        'review_count': 891,
        'images': json.dumps([
            'https://images.unsplash.com/photo-1631214524020-3c69606a9d5a?w=600&h=600&fit=crop&auto=format',
        ]),
        'description': 'Full-coverage matte foundation with 16-hour wear.',
        'benefits': json.dumps(['Full coverage', '16-hour wear', 'Oil control', 'SPF 20']),
        'ingredients': json.dumps([
            {'id': 'i5', 'name': 'Dimethicone', 'purpose': 'Silky texture', 'safe': True, 'description': 'Smooth application'},
            {'id': 'i7', 'name': 'Fragrance', 'purpose': 'Scent', 'safe': False, 'flagged': True, 'commonlyAvoided': True, 'description': 'May cause irritation'},
        ]),
        'tags': json.dumps(['matte', 'full-coverage', 'oil-control']),
        'in_stock': 1,
        'vendor_name': 'Lumiere Cosmetics',
        'variants': [
            {'id': 'v1', 'name': 'N10 - Porcelain', 'shade': 'Porcelain', 'hex_color': '#F8E6D0', 'price': 48, 'stock': 12, 'sku': 'LUM-F-N10'},
            {'id': 'v2', 'name': 'N20 - Ivory', 'shade': 'Ivory', 'hex_color': '#F2D5B5', 'price': 48, 'stock': 34, 'sku': 'LUM-F-N20'},
            {'id': 'v3', 'name': 'W30 - Sand', 'shade': 'Sand', 'hex_color': '#DFBF98', 'price': 48, 'stock': 8, 'sku': 'LUM-F-W30'},
        ],
    },
    {
        'id': 'p3',
        'name': 'Soothing Barrier Cream',
        'brand': 'Gentle Earth',
        'category': 'Moisturizers',
        'price': 42,
        'original_price': None,
        'rating': 4.9,
        'review_count': 1204,
        'images': json.dumps([
            'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop&auto=format',
        ]),
        'description': 'Clinically formulated for sensitive and reactive skin.',
        'benefits': json.dumps(['Barrier repair', 'Reduces redness', '72hr hydration', 'Hypoallergenic']),
        'ingredients': json.dumps([
            {'id': 'i8', 'name': 'Ceramide NP', 'purpose': 'Barrier repair', 'safe': True, 'description': 'Restores skin barrier'},
            {'id': 'i9', 'name': 'Centella Asiatica', 'purpose': 'Soothing', 'safe': True, 'description': 'Calms inflammation'},
        ]),
        'tags': json.dumps(['sensitive-skin', 'fragrance-free', 'hypoallergenic', 'barrier-repair']),
        'in_stock': 1,
        'vendor_name': 'Gentle Earth Lab',
        'variants': [],
    },
    {
        'id': 'p4',
        'name': 'Rose Petal Lip Balm',
        'brand': 'Petale',
        'category': 'Lip Care',
        'price': 18,
        'original_price': None,
        'rating': 4.6,
        'review_count': 567,
        'images': json.dumps([
            'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&auto=format',
        ]),
        'description': 'Deeply nourishing lip balm with rose petal extract.',
        'benefits': json.dumps(['Deep moisture', 'Natural tint', 'Rose extract', 'SPF 15']),
        'ingredients': json.dumps([
            {'id': 'i12', 'name': 'Shea Butter', 'purpose': 'Nourishing', 'safe': True, 'description': 'Rich emollient'},
        ]),
        'tags': json.dumps(['lip-care', 'natural', 'tinted', 'spf']),
        'in_stock': 1,
        'vendor_name': 'Petale Natural',
        'variants': [
            {'id': 'v7', 'name': 'Clear', 'shade': 'Clear', 'hex_color': '#F5E6D8', 'price': 18, 'stock': 45, 'sku': 'PET-L-CLR'},
            {'id': 'v8', 'name': 'Petal Pink', 'shade': 'Petal Pink', 'hex_color': '#F0B8C0', 'price': 18, 'stock': 28, 'sku': 'PET-L-PPK'},
        ],
    },
    {
        'id': 'p5',
        'name': 'Midnight Recovery Eye Cream',
        'brand': 'Nocturne',
        'category': 'Eye Care',
        'price': 72,
        'original_price': 90,
        'rating': 4.4,
        'review_count': 234,
        'images': json.dumps([
            'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&h=600&fit=crop&auto=format',
        ]),
        'description': 'Intensive overnight eye treatment.',
        'benefits': json.dumps(['Reduces dark circles', 'De-puffs', 'Firms skin', 'Anti-aging']),
        'ingredients': json.dumps([
            {'id': 'i15', 'name': 'Retinol', 'purpose': 'Anti-aging', 'safe': True, 'description': 'Accelerates cell turnover'},
            {'id': 'i16', 'name': 'Caffeine', 'purpose': 'Depuffing', 'safe': True, 'description': 'Constricts blood vessels'},
        ]),
        'tags': json.dumps(['eye-cream', 'anti-aging', 'dark-circles']),
        'in_stock': 1,
        'vendor_name': 'Nocturne Beauty',
        'variants': [],
    },
    {
        'id': 'p6',
        'name': 'Cloud Nine Setting Powder',
        'brand': 'Aurelia',
        'category': 'Setting',
        'price': 36,
        'original_price': None,
        'rating': 4.8,
        'review_count': 768,
        'images': json.dumps([
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format',
        ]),
        'description': 'Ultra-fine translucent setting powder.',
        'benefits': json.dumps(['Sets makeup', 'Blurs pores', '12hr wear', 'Lightweight']),
        'ingredients': json.dumps([
            {'id': 'i18', 'name': 'Silica', 'purpose': 'Oil absorption', 'safe': True, 'description': 'Absorbs excess oil'},
            {'id': 'i19', 'name': 'Mica', 'purpose': 'Luminosity', 'safe': True, 'description': 'Subtle luminosity'},
        ]),
        'tags': json.dumps(['setting', 'translucent', 'oil-control']),
        'in_stock': 1,
        'vendor_name': 'Aurelia Beauty Co.',
        'variants': [],
    },
]


def seed():
    app = create_app()
    with app.app_context():
        db = get_db()

        # Seed categories
        for cat in CATEGORIES:
            db.execute(
                'INSERT OR IGNORE INTO categories (name, icon_name, sort_order) VALUES (?, ?, ?)',
                (cat['name'], cat['icon_name'], cat['sort_order'])
            )
        db.commit()

        # Seed products
        for product in PRODUCTS:
            cat_row = db.execute('SELECT id FROM categories WHERE name = ?', (product['category'],)).fetchone()
            if not cat_row:
                print(f"Warning: category '{product['category']}' not found, skipping product {product['id']}")
                continue
            cat_id = cat_row['id']

            db.execute(
                '''INSERT OR REPLACE INTO products
                   (id, name, brand, category_id, price, original_price, rating, review_count,
                    images, description, benefits, ingredients, tags, in_stock, vendor_name)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (product['id'], product['name'], product['brand'], cat_id,
                 product['price'], product.get('original_price'), product['rating'],
                 product['review_count'], product['images'], product['description'],
                 product['benefits'], product['ingredients'], product['tags'],
                 product['in_stock'], product['vendor_name'])
            )

            # Seed variants
            for v in product.get('variants', []):
                db.execute(
                    '''INSERT OR REPLACE INTO product_variants
                       (id, product_id, name, shade, hex_color, price, stock, sku)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                    (v['id'], product['id'], v['name'], v.get('shade'), v.get('hex_color'),
                     v['price'], v['stock'], v['sku'])
                )

        db.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")


if __name__ == '__main__':
    seed()
