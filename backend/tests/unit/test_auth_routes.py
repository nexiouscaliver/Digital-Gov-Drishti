import pytest
import json
from backend.app import create_app
from unittest.mock import patch, MagicMock

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app({
        'TESTING': True,
        'DEBUG': True,
        'JWT_SECRET_KEY': 'test-key'
    })
    yield app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

class TestAuthRoutes:
    
    @patch('backend.app.routes.auth.User')
    @patch('backend.app.routes.auth.send_otp_email')
    def test_register_success(self, mock_send_otp, mock_user, client):
        """Test successful user registration."""
        # Mock user creation
        mock_user_data = {
            '_id': '123456',
            'name': 'Test User',
            'phone': '1234567890',
            'email': 'test@example.com',
            'address': '123 Test St',
            'is_verified': False,
            'verification': {}
        }
        mock_user.create.return_value = mock_user_data
        mock_user.get_by_phone.return_value = {
            'verification': {'otp': '123456'}
        }
        
        # Mock email sending
        mock_send_otp.return_value = True
        
        # Test data
        test_data = {
            'name': 'Test User',
            'phone': '1234567890',
            'email': 'test@example.com',
            'password': 'password123',
            'address': '123 Test St'
        }
        
        # Make request
        response = client.post(
            '/api/register',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        # Assertions
        assert response.status_code == 201
        response_data = json.loads(response.data)
        assert response_data['status'] == 'success'
        assert 'User registered successfully' in response_data['message']
        assert response_data['data'] == mock_user_data
        
        # Verify mocks were called correctly
        mock_user.create.assert_called_once_with(
            name=test_data['name'],
            phone=test_data['phone'],
            email=test_data['email'],
            password=test_data['password'],
            address=test_data['address'],
            government_documents=None
        )
        mock_send_otp.assert_called_once()
        
    @patch('backend.app.routes.auth.User')
    def test_login_success(self, mock_user, client):
        """Test successful user login."""
        # Mock user authentication
        mock_user_data = {
            '_id': '123456',
            'name': 'Test User',
            'phone': '1234567890',
            'email': 'test@example.com'
        }
        mock_user.authenticate.return_value = mock_user_data
        
        # Test data
        test_data = {
            'phone': '1234567890',
            'password': 'password123'
        }
        
        # Make request
        with patch('backend.app.routes.auth.generate_token', return_value='mock-token'):
            response = client.post(
                '/api/login',
                data=json.dumps(test_data),
                content_type='application/json'
            )
            
        # Assertions
        assert response.status_code == 200
        response_data = json.loads(response.data)
        assert response_data['status'] == 'success'
        assert response_data['message'] == 'Login successful'
        assert response_data['data']['token'] == 'mock-token'
        assert response_data['data']['user'] == mock_user_data
        
        # Verify mock was called correctly
        mock_user.authenticate.assert_called_once_with(
            test_data['phone'], 
            test_data['password']
        )
        
    @patch('backend.app.routes.auth.User')
    def test_verify_otp_success(self, mock_user, client):
        """Test successful OTP verification."""
        # Mock OTP verification
        mock_user.verify_otp.return_value = True
        mock_user.get_by_phone.return_value = {
            '_id': '123456',
            'name': 'Test User',
            'phone': '1234567890',
            'email': 'test@example.com',
            'password': 'hashed_password',
            'verification': {'otp': '123456'}
        }
        
        # Test data
        test_data = {
            'phone': '1234567890',
            'otp': '123456'
        }
        
        # Make request
        with patch('backend.app.routes.auth.generate_token', return_value='mock-token'):
            response = client.post(
                '/api/verify-otp',
                data=json.dumps(test_data),
                content_type='application/json'
            )
            
        # Assertions
        assert response.status_code == 200
        response_data = json.loads(response.data)
        assert response_data['status'] == 'success'
        assert response_data['message'] == 'OTP verified successfully'
        assert 'token' in response_data['data']
        assert 'user' in response_data['data']
        
        # Verify mock was called correctly
        mock_user.verify_otp.assert_called_once_with(
            test_data['phone'],
            test_data['otp']
        ) 