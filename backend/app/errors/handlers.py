from flask import jsonify

class APIError(Exception):
    """Base class for API errors"""
    status_code = 400
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        rv['status'] = 'error'
        return rv

class BadRequestError(APIError):
    """Exception for bad request errors (400)"""
    status_code = 400

class UnauthorizedError(APIError):
    """Exception for unauthorized errors (401)"""
    status_code = 401

class ForbiddenError(APIError):
    """Exception for forbidden errors (403)"""
    status_code = 403

class NotFoundError(APIError):
    """Exception for not found errors (404)"""
    status_code = 404

class ConflictError(APIError):
    """Exception for conflict errors (409)"""
    status_code = 409

class ServerError(APIError):
    """Exception for server errors (500)"""
    status_code = 500

def register_error_handlers(app):
    """Register error handlers with the Flask app"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        """Handler for custom API errors"""
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(400)
    def handle_bad_request(error):
        """Handler for 400 Bad Request errors"""
        return jsonify({
            'status': 'error',
            'error': 'Bad request',
            'message': str(error)
        }), 400
    
    @app.errorhandler(401)
    def handle_unauthorized(error):
        """Handler for 401 Unauthorized errors"""
        return jsonify({
            'status': 'error',
            'error': 'Unauthorized',
            'message': 'Authentication is required'
        }), 401
    
    @app.errorhandler(403)
    def handle_forbidden(error):
        """Handler for 403 Forbidden errors"""
        return jsonify({
            'status': 'error',
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource'
        }), 403
    
    @app.errorhandler(404)
    def handle_not_found(error):
        """Handler for 404 Not Found errors"""
        return jsonify({
            'status': 'error',
            'error': 'Not found',
            'message': 'The requested resource was not found'
        }), 404
    
    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        """Handler for 405 Method Not Allowed errors"""
        return jsonify({
            'status': 'error',
            'error': 'Method not allowed',
            'message': 'The method is not allowed for the requested URL'
        }), 405
    
    @app.errorhandler(500)
    def handle_server_error(error):
        """Handler for 500 Internal Server Error"""
        return jsonify({
            'status': 'error',
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }), 500
