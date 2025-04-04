import os
import logging
from flask import Flask
from flask_cors import CORS
from app.config import get_config
from app.errors.handlers import register_error_handlers

def setup_logging(app):
    """Configure logging for the application"""
    log_level = logging.DEBUG if app.config['DEBUG'] else logging.INFO
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Set the log level for werkzeug (Flask's WSGI server)
    logging.getLogger('werkzeug').setLevel(logging.INFO)
    
    app.logger.setLevel(log_level)
    return app

def create_app(test_config=None):
    """
    Flask application factory function
    
    Args:
        test_config (dict, optional): Test configuration override
        
    Returns:
        Flask: Configured Flask application
    """
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Load configuration
    if test_config is None:
        app.config.from_object(get_config())
    else:
        app.config.from_mapping(test_config)
        
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass
        
    # Enable CORS
    CORS(app)
    
    # Setup logging
    setup_logging(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    
    # Register complaints blueprint
    from app.routes.complaints import complaints_bp
    app.register_blueprint(complaints_bp)
    
    # Test route
    @app.route('/api/healthcheck')
    def healthcheck():
        return {
            'status': 'success',
            'message': 'API server is running'
        }
        
    return app
