from flask import Blueprint, request, jsonify, current_app
import json
import logging
from email_validator import validate_email, EmailNotValidError
from app.models.user import User
from app.utils.email_utils import send_otp_email, EmailError
from app.utils.auth_utils import generate_token
from app.errors.handlers import (
    BadRequestError, 
    UnauthorizedError, 
    ConflictError, 
    ServerError
)

# Create a blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    User registration endpoint
    
    Required fields:
    - name: string
    - phone: string
    - email: string
    - password: string
    - address: string
    - government_documents: string or object (optional)
    
    Returns:
        JSON response with user data and 201 status code
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Basic validation
        required_fields = ['name', 'phone', 'email', 'password', 'address']
        for field in required_fields:
            if field not in data or not data[field]:
                raise BadRequestError(f'Missing required field: {field}')
                
        # Validate email format
        try:
            valid_email = validate_email(data['email'])
            data['email'] = valid_email.normalized
        except EmailNotValidError as e:
            raise BadRequestError(f'Invalid email: {str(e)}')
            
        # Parse government documents if provided
        gov_docs = None
        if 'government_documents' in data and data['government_documents']:
            gov_docs = data['government_documents']
            
        # Create new user
        user = User.create(
            name=data['name'],
            phone=data['phone'],
            email=data['email'],
            password=data['password'],
            address=data['address'],
            government_documents=gov_docs
        )
        
        # Send OTP email
        try:
            # Get OTP from user
            phone = data['phone']
            otp = User.get_by_phone(phone)['verification']['otp']
            send_otp_email(data['email'], otp, data['name'])
            logging.info(f"OTP email sent to {data['email']}")
        except EmailError as e:
            logging.error(f"Failed to send OTP email: {str(e)}")
            # We continue even if email fails, as we can resend it later
            
        # Return response
        return jsonify({
            'status': 'success',
            'message': 'User registered successfully. Please verify your account with OTP.',
            'data': user
        }), 201
        
    except ConflictError as e:
        raise e
    except BadRequestError as e:
        raise e
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        raise ServerError(f"Failed to register user: {str(e)}")

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    
    Required fields:
    - phone: string
    - password: string
    
    Returns:
        JSON response with token and user data
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Basic validation
        if 'phone' not in data or not data['phone']:
            raise BadRequestError('Phone number is required')
            
        if 'password' not in data or not data['password']:
            raise BadRequestError('Password is required')
            
        # Authenticate user
        user = User.authenticate(data['phone'], data['password'])
        
        if not user:
            raise UnauthorizedError('Invalid credentials or account not verified')
            
        # Generate JWT token
        token = generate_token(user['_id'])
        
        if not token:
            raise ServerError('Failed to generate authentication token')
            
        # Return response
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'data': {
                'token': token,
                'user': user
            }
        })
        
    except BadRequestError as e:
        raise e
    except UnauthorizedError as e:
        raise e
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        raise ServerError(f"Failed to login: {str(e)}")

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """
    OTP verification endpoint
    
    Required fields:
    - phone: string
    - otp: string
    
    Returns:
        JSON response with verification status
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Basic validation
        if 'phone' not in data or not data['phone']:
            raise BadRequestError('Phone number is required')
            
        if 'otp' not in data or not data['otp']:
            raise BadRequestError('OTP is required')
            
        # Verify OTP
        verified = User.verify_otp(data['phone'], data['otp'])
        
        if verified:
            # Get user
            user = User.get_by_phone(data['phone'])
            
            # Generate JWT token
            token = generate_token(user['_id'])
            
            if not token:
                raise ServerError('Failed to generate authentication token')
                
            # Return user without sensitive information
            user_copy = user.copy()
            user_copy.pop('password', None)
            if 'verification' in user_copy:
                user_copy.pop('verification', None)
                
            # Return response
            return jsonify({
                'status': 'success',
                'message': 'OTP verified successfully',
                'data': {
                    'token': token,
                    'user': user_copy
                }
            })
        else:
            raise BadRequestError('OTP verification failed')
            
    except BadRequestError as e:
        raise e
    except Exception as e:
        logging.error(f"OTP verification error: {str(e)}")
        raise ServerError(f"Failed to verify OTP: {str(e)}")

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    """
    Resend OTP endpoint
    
    Required fields:
    - phone: string
    
    Returns:
        JSON response with resend status
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Basic validation
        if 'phone' not in data or not data['phone']:
            raise BadRequestError('Phone number is required')
            
        # Regenerate OTP
        new_otp = User.regenerate_otp(data['phone'])
        
        # Get user
        user = User.get_by_phone(data['phone'])
        
        # Send OTP email
        try:
            send_otp_email(user['email'], new_otp, user['name'])
            logging.info(f"OTP email resent to {user['email']}")
        except EmailError as e:
            logging.error(f"Failed to resend OTP email: {str(e)}")
            raise ServerError(f"Failed to send OTP: {str(e)}")
            
        # Return response
        return jsonify({
            'status': 'success',
            'message': 'OTP has been resent to your email'
        })
        
    except BadRequestError as e:
        raise e
    except Exception as e:
        logging.error(f"Resend OTP error: {str(e)}")
        raise ServerError(f"Failed to resend OTP: {str(e)}")
