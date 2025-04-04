import jwt
import datetime
import logging
from functools import wraps
from flask import request, jsonify, current_app
from app.models.user import User
from app.errors.handlers import UnauthorizedError

def generate_token(user_id):
    """
    Generate a JWT token
    
    Args:
        user_id (str): User ID to encode in the token
        
    Returns:
        str: JWT token
    """
    try:
        # Create token payload
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        
        # Encode the token
        return jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        logging.error(f"Error generating token: {str(e)}")
        return None

def decode_token(token):
    """
    Decode a JWT token
    
    Args:
        token (str): JWT token to decode
        
    Returns:
        dict: Token payload
        
    Raises:
        UnauthorizedError: If token is invalid
    """
    try:
        # Decode the token
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise UnauthorizedError('Token has expired')
    except jwt.InvalidTokenError:
        raise UnauthorizedError('Invalid token')

def token_required(f):
    """
    Decorator to protect routes with JWT authentication
    
    Args:
        f (function): Function to decorate
        
    Returns:
        function: Decorated function
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in the headers
        auth_header = request.headers.get('Authorization')
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split()[1]
        
        # Return error if no token
        if not token:
            return jsonify({
                'status': 'error',
                'message': 'Authentication token is missing'
            }), 401
        
        try:
            # Decode token
            payload = decode_token(token)
            user_id = payload['sub']
            
            # Get user from database
            current_user = User.get_by_id(user_id)
            
            # Check if user is verified
            if not current_user.get('is_verified', False):
                return jsonify({
                    'status': 'error',
                    'message': 'User account is not verified'
                }), 401
                
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 401
            
        # Add current_user to kwargs
        kwargs['current_user'] = current_user
        return f(*args, **kwargs)
        
    return decorated
