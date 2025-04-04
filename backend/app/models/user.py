import uuid
from datetime import datetime
from app.utils.mongodb_utils import (
    get_collection,
    get_gridfs_instance,
    check_document_exists_by_field,
    insert_document,
    get_document
)
from app.utils.password_utils import (
    hash_password,
    verify_password,
    generate_otp,
    calculate_otp_expiry,
    is_otp_expired
)
from app.errors.handlers import NotFoundError, ConflictError, BadRequestError

class User:
    """User model for MongoDB"""
    
    COLLECTION = 'users'
    
    @staticmethod
    def create(name, phone, email, password, address, government_documents=None):
        """
        Create a new user
        
        Args:
            name (str): User's full name
            phone (str): User's phone number
            email (str): User's email address
            password (str): User's plain text password (will be hashed)
            address (str): User's address
            government_documents (dict): Government documents data
            
        Returns:
            dict: Created user document (without password)
            
        Raises:
            ConflictError: If user with phone or email already exists
        """
        # Check if user with this phone or email already exists
        if check_document_exists_by_field(User.COLLECTION, 'phone', phone):
            raise ConflictError('User with this phone number already exists')
            
        if check_document_exists_by_field(User.COLLECTION, 'email', email):
            raise ConflictError('User with this email already exists')
        
        # Generate OTP for verification
        otp = generate_otp()
        otp_expiry = calculate_otp_expiry()
        
        # Create user document
        user_id = str(uuid.uuid4())
        user = {
            '_id': user_id,
            'name': name,
            'phone': phone,
            'email': email,
            'password': hash_password(password),
            'address': address,
            'is_verified': False,
            'verification': {
                'otp': otp,
                'expiry': otp_expiry,
                'attempts': 0
            },
            'government_documents': None,  # Will be updated with file ID if documents are provided
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Store government documents in GridFS if provided
        if government_documents:
            fs = get_gridfs_instance()
            if isinstance(government_documents, dict):
                # Store document metadata
                file_id = str(uuid.uuid4())
                fs.put(
                    str(government_documents).encode('utf-8'),
                    _id=file_id,
                    filename=f"docs_{user_id}",
                    user_id=user_id,
                    content_type='application/json'
                )
                user['government_documents'] = file_id
        
        # Insert user into database
        insert_document(User.COLLECTION, user)
        
        # Return user without sensitive information
        user_copy = user.copy()
        user_copy.pop('password')
        user_copy['verification'].pop('otp')
        
        return user_copy
    
    @staticmethod
    def get_by_phone(phone):
        """
        Get a user by phone number
        
        Args:
            phone (str): User's phone number
            
        Returns:
            dict: User document
            
        Raises:
            NotFoundError: If user not found
        """
        collection = get_collection(User.COLLECTION)
        user = collection.find_one({'phone': phone})
        
        if not user:
            raise NotFoundError('User not found')
            
        return user
    
    @staticmethod
    def get_by_id(user_id):
        """
        Get a user by ID
        
        Args:
            user_id (str): User ID
            
        Returns:
            dict: User document
            
        Raises:
            NotFoundError: If user not found
        """
        user = get_document(User.COLLECTION, user_id)
        
        if not user:
            raise NotFoundError('User not found')
            
        return user
    
    @staticmethod
    def authenticate(phone, password):
        """
        Authenticate a user
        
        Args:
            phone (str): User's phone number
            password (str): User's plain text password
            
        Returns:
            dict: User document (without password)
            
        Raises:
            UnauthorizedError: If authentication fails
        """
        try:
            user = User.get_by_phone(phone)
        except NotFoundError:
            # Use the same error message for security
            return None
            
        # Check if user is verified
        if not user.get('is_verified', False):
            return None
        
        # Verify password
        if not verify_password(password, user['password']):
            return None
            
        # Return user without sensitive information
        user_copy = user.copy()
        user_copy.pop('password', None)
        if 'verification' in user_copy:
            user_copy.pop('verification', None)
            
        return user_copy
    
    @staticmethod
    def verify_otp(phone, otp):
        """
        Verify a user's OTP
        
        Args:
            phone (str): User's phone number
            otp (str): OTP to verify
            
        Returns:
            bool: True if verified successfully
            
        Raises:
            BadRequestError: If verification fails
        """
        collection = get_collection(User.COLLECTION)
        
        try:
            user = User.get_by_phone(phone)
        except NotFoundError:
            raise BadRequestError('Invalid OTP verification request')
            
        # Check if user is already verified
        if user.get('is_verified', False):
            return True
            
        # Get verification data
        verification = user.get('verification', {})
        stored_otp = verification.get('otp')
        expiry = verification.get('expiry')
        attempts = verification.get('attempts', 0)
        
        # Check if OTP has expired
        if is_otp_expired(expiry):
            raise BadRequestError('OTP has expired')
            
        # Increment attempt counter
        collection.update_one(
            {'_id': user['_id']},
            {'$inc': {'verification.attempts': 1}}
        )
        
        # Check if max attempts reached (5 attempts)
        if attempts >= 4:  # This will be the 5th attempt
            raise BadRequestError('Maximum OTP verification attempts exceeded')
            
        # Verify OTP
        if otp != stored_otp:
            raise BadRequestError('Invalid OTP')
            
        # Mark user as verified
        collection.update_one(
            {'_id': user['_id']},
            {
                '$set': {
                    'is_verified': True,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        return True
    
    @staticmethod
    def regenerate_otp(phone):
        """
        Regenerate OTP for a user
        
        Args:
            phone (str): User's phone number
            
        Returns:
            str: New OTP
            
        Raises:
            NotFoundError: If user not found
        """
        collection = get_collection(User.COLLECTION)
        
        try:
            user = User.get_by_phone(phone)
        except NotFoundError:
            raise NotFoundError('User not found')
            
        # Check if user is already verified
        if user.get('is_verified', False):
            raise BadRequestError('User is already verified')
            
        # Generate new OTP
        otp = generate_otp()
        otp_expiry = calculate_otp_expiry()
        
        # Update user
        collection.update_one(
            {'_id': user['_id']},
            {
                '$set': {
                    'verification.otp': otp,
                    'verification.expiry': otp_expiry,
                    'verification.attempts': 0,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        return otp
