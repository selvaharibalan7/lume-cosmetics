import json
from flask import Blueprint, request, g
from database.database import query_db, execute_db, get_db
from utils.response import success, error, not_found
from utils.auth_middleware import token_required

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@token_required
def get_profile():
    user = query_db('SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?', (g.user['id'],), one=True)
    skin = query_db('SELECT * FROM skin_profiles WHERE user_id = ?', (g.user['id'],), one=True)
    
    profile = dict(user)
    if skin:
        s = dict(skin)
        s['concerns'] = json.loads(s['concerns'])
        s['avoid_ingredients'] = json.loads(s['avoid_ingredients'])
        s['preferred_ingredients'] = json.loads(s['preferred_ingredients'])
        profile['skin_profile'] = s
    else:
        profile['skin_profile'] = None
        
    return success(data=profile)

@profile_bp.route('/skin-profile', methods=['PUT', 'POST'])
@token_required
def update_skin_profile():
    data = request.get_json()
    if not data:
        return error("Invalid data")
        
    skin_type = data.get('skin_type', 'combination')
    concerns = json.dumps(data.get('concerns', []))
    skin_tone = data.get('skin_tone', 'medium')
    undertone = data.get('undertone', 'neutral')
    avoid = json.dumps(data.get('avoid_ingredients', []))
    pref = json.dumps(data.get('preferred_ingredients', []))
    
    existing = query_db('SELECT id FROM skin_profiles WHERE user_id = ?', (g.user['id'],), one=True)
    
    if existing:
        execute_db('''
            UPDATE skin_profiles SET
            skin_type = ?, concerns = ?, skin_tone = ?, undertone = ?, 
            avoid_ingredients = ?, preferred_ingredients = ?, updated_at = datetime('now')
            WHERE user_id = ?
        ''', (skin_type, concerns, skin_tone, undertone, avoid, pref, g.user['id']))
    else:
        execute_db('''
            INSERT INTO skin_profiles (user_id, skin_type, concerns, skin_tone, undertone, avoid_ingredients, preferred_ingredients)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (g.user['id'], skin_type, concerns, skin_tone, undertone, avoid, pref))
        
    return success(message="Skin profile updated successfully")

@profile_bp.route('/update', methods=['PUT'])
@token_required
def update_user_info():
    data = request.get_json()
    if not data:
        return error("Invalid data")
        
    name = data.get('name')
    if name:
        execute_db("UPDATE users SET name = ? WHERE id = ?", (name, g.user['id']))
        return success(message="Profile updated")
    
    return error("No valid fields to update")
