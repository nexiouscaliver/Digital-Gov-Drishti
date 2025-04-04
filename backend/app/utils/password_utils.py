import bcrypt
import logging
import secrets
import string
from datetime import datetime, timedelta

def hash_password(password):
    """
    Hash a password using bcrypt
    
    Args:
        password (str): Plain-text password to hash
        
    Returns:
        str: Hashed password
    """
    try:
        # Generate a salt and hash the password
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        return hashed_password.decode('utf-8')
    except Exception as e:
        logging.error(f"Error hashing password: {str(e)}")
        raise

def verify_password(plain_password, hashed_password):
    """
    Verify a password against a hash
    
    Args:
        plain_password (str): Plain-text password to verify
        hashed_password (str): Hashed password to check against
        
    Returns:
        bool: True if password matches, False otherwise
    """
    try:
        plain_password_bytes = plain_password.encode('utf-8')
        hashed_password_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_password_bytes, hashed_password_bytes)
    except Exception as e:
        logging.error(f"Error verifying password: {str(e)}")
        return False

def generate_otp(length=6):
    """
    Generate a random OTP
    
    Args:
        length (int): Length of the OTP to generate (default: 6)
        
    Returns:
        str: The generated OTP
    """
    # Generate a random OTP using digits only
    otp = ''.join(secrets.choice(string.digits) for _ in range(length))
    return otp

def calculate_otp_expiry(minutes=10):
    """
    Calculate OTP expiry time
    
    Args:
        minutes (int): Minutes from now when the OTP will expire (default: 10)
        
    Returns:
        datetime: Expiry datetime
    """
    return datetime.utcnow() + timedelta(minutes=minutes)

def is_otp_expired(expiry_time):
    """
    Check if the OTP has expired
    
    Args:
        expiry_time (datetime): The expiry time to check against
        
    Returns:
        bool: True if expired, False otherwise
    """
    return datetime.utcnow() > expiry_time
