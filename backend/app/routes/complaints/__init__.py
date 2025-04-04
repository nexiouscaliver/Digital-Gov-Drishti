from flask import Blueprint

complaints_bp = Blueprint('complaints', __name__, url_prefix='/api/complaints')

# Import routes to register them with the blueprint
from . import routes 