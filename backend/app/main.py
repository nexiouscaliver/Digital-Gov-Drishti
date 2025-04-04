import os
import logging
from dotenv import load_dotenv
from app import create_app

# Load environment variables
load_dotenv()

# Create Flask application
app = create_app()

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.getenv('PORT', 5000))
    
    # Run the app with gunicorn in production
    if os.getenv('FLASK_ENV') == 'production':
        # Gunicorn will be used through command line
        pass
    else:
        # Run with Flask development server for local development
        app.run(host='0.0.0.0', port=port, debug=True)
