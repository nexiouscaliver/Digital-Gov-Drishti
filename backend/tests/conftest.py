import pytest
import os
import sys
import json
from unittest.mock import patch, MagicMock

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import application
from backend.app import create_app

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app({
        'TESTING': True,
        'DEBUG': True,
        'JWT_SECRET_KEY': 'test-key'
    })
    
    # Setup test context
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    """Test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Command line test runner."""
    return app.test_cli_runner()

@pytest.fixture
def mock_db():
    """Mock MongoDB connection."""
    with patch('backend.app.utils.mongodb_utils.get_mongodb_client') as mock:
        db_client = MagicMock()
        mock.return_value = db_client
        yield mock 