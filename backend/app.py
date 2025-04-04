from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime
import os
import sys
import traceback
from bson import ObjectId, json_util

# Add parent directory to path to import mongodb_utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from mongodb_utils import insert_document, get_document, get_collection, get_document_by_field, upsert_document, check_document_exists, update_document
from utils import classify_complaint, determine_severity, generate_complaint_blog, sanitize_for_json, MongoJSONEncoder

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure JSON encoder for MongoDB ObjectId
app.json_encoder = MongoJSONEncoder

# MongoDB collection names
COMPLAINTS_COLLECTION = "complaints"
USERS_COLLECTION = "users"
BLOGS_COLLECTION = "blogs"

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "API is running", "success": True})

@app.route('/api/complaints', methods=['POST'])
def register_complaint():
    """Register a new complaint"""
    try:
        data = request.json
        logger.info(f"Received complaint registration request with data: {data}")
        
        # Validate required fields
        required_fields = ['user_id', 'title', 'description']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return jsonify({
                    'message': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Get user data (for verification)
        logger.info(f"Looking up user with user_id: {data['user_id']}")
        user_data = get_document_by_field(USERS_COLLECTION, 'user_id', data['user_id'])
        if not user_data:
            logger.warning(f"User not found with user_id: {data['user_id']}")
            return jsonify({
                'message': 'User not found',
                'success': False
            }), 404
            
        logger.info(f"Found user: {user_data.get('name')}")
            
        # Generate complaint ID
        complaint_id = str(uuid.uuid4())
        
        # Get current timestamp
        complaint_datetime = datetime.now().isoformat()
        
        # Check for media proof
        has_proof = False
        if 'media' in data and any(data['media'].get(media_type, []) for media_type in ['images', 'videos', 'documents']):
            has_proof = True
        
        # Set verified status based on proof
        verified = True if has_proof else False
        
        # Classify complaint and determine severity
        try:
            logger.info(f"Classifying complaint: {data['title']}")
            assigned_department = classify_complaint(data['title'], data['description'])
            logger.info(f"Classified to department: {assigned_department}")
            
            logger.info(f"Determining severity for: {data['title']}")
            severity = determine_severity(data['title'], data['description'])
            logger.info(f"Determined severity: {severity}")
        except Exception as e:
            logger.error(f"Error in classification or severity determination: {str(e)}")
            assigned_department = "General Department"
            severity = {"level": "medium", "score": 3}
        
        # Prepare complaint document
        complaint_data = {
            'complaint_id': complaint_id,
            'user_id': data['user_id'],
            'user_name': user_data.get('name', 'Anonymous'),
            'title': data['title'],
            'description': data['description'],
            'location': data.get('location', {}),
            'media': data.get('media', {}),
            'verified': verified,
            'status': 'pending',
            'complaint_datetime': complaint_datetime,
            'assigned_department': assigned_department,
            'severity': severity,
            'anonymous': data.get('anonymous', False)
        }
        
        # Insert complaint into database
        logger.info(f"Inserting complaint with ID: {complaint_id}")
        try:
            result = insert_document(COMPLAINTS_COLLECTION, complaint_data)
            
            if result:
                # Prepare response
                response_data = {
                    'message': 'Complaint registered successfully',
                    'complaint_id': complaint_id,
                    'assigned_department': assigned_department,
                    'severity': severity,
                    'verified': verified,
                    'success': True
                }
                logger.info(f"Complaint registered successfully with ID: {complaint_id}")
                return jsonify(response_data), 201
            else:
                logger.error("Failed to insert complaint into database - insert_document returned None")
                return jsonify({
                    'message': 'Failed to register complaint',
                    'success': False
                }), 500
        except Exception as e:
            logger.error(f"Failed to insert complaint into database: {str(e)}")
            return jsonify({
                'message': 'Failed to register complaint',
                'success': False
            }), 500
    
    except Exception as e:
        logger.error(f"Error in register_complaint: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/complaints/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """Get complaint details by ID"""
    try:
        # Get complaint from database
        complaint = get_document_by_field(COMPLAINTS_COLLECTION, 'complaint_id', complaint_id)
        
        if not complaint:
            return jsonify({
                'message': 'Complaint not found',
                'success': False
            }), 404
            
        # Sanitize for JSON serialization
        complaint = sanitize_for_json(complaint)
        
        # Remove MongoDB _id for the response
        if '_id' in complaint:
            del complaint['_id']
        
        return jsonify({
            'complaint': complaint,
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_complaint: {str(e)}")
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/users/<user_id>/complaints', methods=['GET'])
def get_user_complaints(user_id):
    """Get all complaints for a specific user"""
    try:
        # Get collection
        collection = get_collection(COMPLAINTS_COLLECTION)
        
        # Query for complaints by user_id
        complaints = list(collection.find({'user_id': user_id}))
        
        # Sanitize for JSON serialization
        complaints = sanitize_for_json(complaints)
        
        # Remove MongoDB _id for the response
        for complaint in complaints:
            if '_id' in complaint:
                del complaint['_id']
        
        return jsonify({
            'complaints': complaints,
            'count': len(complaints),
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_user_complaints: {str(e)}")
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/complaints/severity/<severity_level>', methods=['GET'])
def get_complaints_by_severity(severity_level):
    """Get complaints by severity level"""
    try:
        # Get collection
        collection = get_collection(COMPLAINTS_COLLECTION)
        
        # Query for complaints by severity level
        complaints = list(collection.find({'severity.level': severity_level.lower()}))
        
        # Sanitize for JSON serialization
        complaints = sanitize_for_json(complaints)
        
        # Remove MongoDB _id for the response
        for complaint in complaints:
            if '_id' in complaint:
                del complaint['_id']
        
        return jsonify({
            'complaints': complaints,
            'count': len(complaints),
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_complaints_by_severity: {str(e)}")
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/complaints/<complaint_id>/status', methods=['PUT'])
def update_complaint_status(complaint_id):
    """Update complaint status"""
    try:
        data = request.json
        
        if 'status' not in data:
            return jsonify({
                'message': 'Missing status field',
                'success': False
            }), 400
            
        # Get complaint from database
        complaint = get_document_by_field(COMPLAINTS_COLLECTION, 'complaint_id', complaint_id)
        
        if not complaint:
            return jsonify({
                'message': 'Complaint not found',
                'success': False
            }), 404
            
        # Update status
        new_status = data['status']
        valid_statuses = ['pending', 'in-progress', 'resolved', 'rejected']
        
        if new_status not in valid_statuses:
            return jsonify({
                'message': f'Invalid status. Must be one of {valid_statuses}',
                'success': False
            }), 400
            
        # Update the document
        result = update_document(
            COMPLAINTS_COLLECTION,
            {'complaint_id': complaint_id},
            {'$set': {'status': new_status}}
        )
        
        if result:
            return jsonify({
                'message': f'Complaint status updated to {new_status}',
                'complaint_id': complaint_id,
                'success': True
            }), 200
        else:
            return jsonify({
                'message': 'Failed to update status',
                'success': False
            }), 500
    
    except Exception as e:
        logger.error(f"Error in update_complaint_status: {str(e)}")
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/complaints/<complaint_id>/blog', methods=['GET'])
def get_complaint_blog(complaint_id):
    """Get blog for a specific complaint"""
    try:
        # Get complaint from database
        complaint = get_document_by_field(COMPLAINTS_COLLECTION, 'complaint_id', complaint_id)
        
        if not complaint:
            return jsonify({
                'message': 'Complaint not found',
                'success': False
            }), 404
        
        # Sanitize for JSON serialization
        complaint = sanitize_for_json(complaint)
        
        # Generate blog
        blog_data = generate_complaint_blog(complaint)
        
        # Add complaint_id to blog data
        blog_data['complaint_id'] = complaint_id
        blog_data['generated_at'] = datetime.now().isoformat()
        
        # Save blog to database
        insert_document(BLOGS_COLLECTION, blog_data)
        
        return jsonify({
            'blog': blog_data,
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_complaint_blog: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/complaints/blogs', methods=['GET'])
def get_all_blogs():
    """Get all generated blogs with pagination"""
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Calculate skip value
        skip = (page - 1) * limit
        
        # Get collection
        collection = get_collection(BLOGS_COLLECTION)
        
        # Query for blogs with pagination
        blogs = list(collection.find().skip(skip).limit(limit))
        
        # Get total count
        total_count = collection.count_documents({})
        
        # Sanitize for JSON serialization
        blogs = sanitize_for_json(blogs)
        
        # Remove MongoDB _id for the response
        for blog in blogs:
            if '_id' in blog:
                del blog['_id']
        
        return jsonify({
            'blogs': blogs,
            'count': len(blogs),
            'total': total_count,
            'page': page,
            'limit': limit,
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_all_blogs: {str(e)}")
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 