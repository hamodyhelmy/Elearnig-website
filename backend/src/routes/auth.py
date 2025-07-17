from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from sqlalchemy.exc import IntegrityError
import traceback

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        print(f"Signup request data: {data}")
        
        # Validate required fields
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.username == data['username']) | (User.email == data['email'])
        ).first()
        
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Set session
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201
        
    except IntegrityError as e:
        print(f"IntegrityError: {e}")
        db.session.rollback()
        return jsonify({'error': 'Username or email already exists'}), 400
    except Exception as e:
        print(f"Exception in signup: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == data['username']) | (User.email == data['username'])
        ).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Set session
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'error': 'Logout failed'}), 500

@auth_bp.route('/auth/check', methods=['GET'])
def check_auth():
    try:
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                return jsonify({
                    'authenticated': True,
                    'user': user.to_dict()
                }), 200
        
        return jsonify({'authenticated': False}), 200
        
    except Exception as e:
        return jsonify({'error': 'Auth check failed'}), 500


@auth_bp.route('/auth/admin-check', methods=['GET'])
def check_admin():
    """Check if the current user is an admin"""
    try:
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user and user.is_admin:
                return jsonify({
                    'is_admin': True,
                    'user': user.to_dict()
                }), 200
        
        return jsonify({'is_admin': False}), 200
        
    except Exception as e:
        return jsonify({'error': 'Admin check failed'}), 500

