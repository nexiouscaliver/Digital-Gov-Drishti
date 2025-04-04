from flask import request, jsonify, current_app
import uuid
from datetime import datetime
import traceback
import logging
import json
import functools
from time import time
from . import complaints_bp
from app.utils.mongodb_utils import (
    insert_document, 
    get_document, 
    get_collection, 
    get_document_by_field, 
    update_document, 
    check_document_exists,
    find_documents,
    delete_document,
    check_document_exists_by_field
)
from app.utils.complaint_utils import (
    classify_complaint,
    determine_severity,
    generate_complaint_blog,
    sanitize_for_json,
    MongoJSONEncoder,
    detect_abusive_content
)

# MongoDB collection names
COMPLAINTS_COLLECTION = "complaints"
USERS_COLLECTION = "users"
BLOGS_COLLECTION = "blogs"
DISCUSSIONS_COLLECTION = "discussions"
BLOCKED_USERS_COLLECTION = "blocked_users"

# Define minimum confidence threshold for abusive content detection
ABUSE_CONFIDENCE_THRESHOLD = 0.7

logger = logging.getLogger(__name__)

# Simple in-memory rate limiter
rate_limit_data = {}

def rate_limit(limit=5, window=60):
    """
    Simple rate limiting decorator
    
    Args:
        limit (int): Maximum number of requests allowed in the time window
        window (int): Time window in seconds
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            phone = None
            
            # Try to get phone from JSON data or query params
            if request.is_json and request.json and 'phone' in request.json:
                phone = request.json.get('phone')
            else:
                phone = request.args.get('phone')
                
            if not phone:
                logger.warning("Rate limiting failed: no phone provided")
                return f(*args, **kwargs)
                
            # Check rate limit
            now = time()
            key = f"{phone}:{request.path}"
            
            if key not in rate_limit_data:
                rate_limit_data[key] = []
                
            # Remove old timestamps
            rate_limit_data[key] = [t for t in rate_limit_data[key] if t > now - window]
            
            # Check if rate limit exceeded
            if len(rate_limit_data[key]) >= limit:
                logger.warning(f"Rate limit exceeded for {phone} on {request.path}")
                return jsonify({
                    'message': 'Too many requests. Please try again later.',
                    'success': False
                }), 429
                
            # Add current timestamp
            rate_limit_data[key].append(now)
            
            return f(*args, **kwargs)
        return wrapped
    return decorator

@complaints_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Complaints API is running", "success": True})

@complaints_bp.route('/register', methods=['POST'])
def register_complaint():
    """Register a new complaint"""
    try:
        data = request.json
        logger.info(f"Received complaint registration request with data: {data}")
        
        # Validate required fields
        required_fields = ['phone', 'title', 'description']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return jsonify({
                    'message': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Get user data (for verification)
        logger.info(f"Looking up user with phone: {data['phone']}")
        user_data = get_document_by_field(USERS_COLLECTION, 'phone', data['phone'])
        if not user_data:
            logger.warning(f"User not found with phone: {data['phone']}")
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
            'phone': data['phone'],
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

@complaints_bp.route('/<complaint_id>', methods=['GET'])
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

@complaints_bp.route('/user/<phone>', methods=['GET'])
def get_user_complaints(phone):
    """Get all complaints for a specific user by phone number"""
    try:
        # Get collection
        collection = get_collection(COMPLAINTS_COLLECTION)
        
        # Query for complaints by phone
        complaints = list(collection.find({'phone': phone}))
        
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

@complaints_bp.route('/severity/<severity_level>', methods=['GET'])
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

@complaints_bp.route('/<complaint_id>/status', methods=['PUT'])
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

@complaints_bp.route('/<complaint_id>/blog', methods=['GET'])
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
        
        # Use MongoJSONEncoder for manual serialization to ensure all ObjectId values are converted to strings
        blog_data = json.loads(json.dumps(blog_data, cls=MongoJSONEncoder))
        
        # Save blog to database
        insert_document(BLOGS_COLLECTION, blog_data)
        
        return jsonify({
            'blog': f"{blog_data}",
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_complaint_blog: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@complaints_bp.route('/blogs', methods=['GET'])
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

@complaints_bp.route('/<complaint_id>/discussion', methods=['POST'])
@rate_limit(limit=5, window=60)  # 5 comments per minute
def add_discussion_comment(complaint_id):
    """Add a discussion comment to a complaint"""
    try:
        data = request.json
        logger.info(f"Received discussion comment request for complaint {complaint_id}: {data}")
        
        # Validate required fields
        required_fields = ['phone', 'comment']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return jsonify({
                    'message': f'Missing required field: {field}',
                    'success': False
                }), 400
                
        # Validate comment is not empty
        if not data['comment'].strip():
            return jsonify({
                'message': 'Comment cannot be empty',
                'success': False
            }), 400
        
        # Check if user is blocked
        blocked_user = is_user_blocked(data['phone'])
        if blocked_user:
            logger.warning(f"Blocked user {data['phone']} attempted to post a comment")
            return jsonify({
                'message': 'Your account has been blocked from posting comments due to violation of community guidelines',
                'blocked': True,
                'success': False
            }), 403
            
        # Detect abusive content in comment
        detection_result = detect_abusive_content(data['comment'])
        logger.info(f"Abuse detection result: {detection_result}")
        
        # If comment is abusive with high confidence, block user and reject comment
        if detection_result.get('is_abusive', False) and detection_result.get('confidence', 0) >= ABUSE_CONFIDENCE_THRESHOLD:
            # Block the user
            block_user(data['phone'], data['comment'], detection_result)
            
            # Return error response
            return jsonify({
                'message': 'Your comment has been flagged as inappropriate and has been rejected. Your account has been blocked due to violation of community guidelines.',
                'blocked': True,
                'detection_result': {
                    'is_abusive': detection_result.get('is_abusive', False),
                    'explanation': detection_result.get('explanation', 'Violation of community guidelines')
                },
                'success': False
            }), 403
        
        # Verify complaint exists
        complaint = get_document_by_field(COMPLAINTS_COLLECTION, 'complaint_id', complaint_id)
        if not complaint:
            logger.warning(f"Complaint not found with ID: {complaint_id}")
            return jsonify({
                'message': 'Complaint not found',
                'success': False
            }), 404
        
        # Verify user exists
        logger.info(f"Looking up user with phone: {data['phone']}")
        user_data = get_document_by_field(USERS_COLLECTION, 'phone', data['phone'])
        if not user_data:
            logger.warning(f"User not found with phone: {data['phone']}")
            return jsonify({
                'message': 'User not found',
                'success': False
            }), 404
        
        # Generate discussion ID
        discussion_id = str(uuid.uuid4())
        
        # Get current timestamp
        comment_datetime = datetime.now().isoformat()
        
        # Prepare discussion document
        discussion_data = {
            'discussion_id': discussion_id,
            'complaint_id': complaint_id,
            'phone': data['phone'],
            'user_name': user_data.get('name', 'Anonymous'),
            'comment': data['comment'],
            'comment_datetime': comment_datetime,
            'anonymous': data.get('anonymous', False),
            'abuse_check_result': {
                'checked': True,
                'is_abusive': detection_result.get('is_abusive', False),
                'confidence': detection_result.get('confidence', 0)
            }
        }
        
        # Insert discussion into database
        logger.info(f"Inserting discussion with ID: {discussion_id}")
        try:
            result = insert_document(DISCUSSIONS_COLLECTION, discussion_data)
            
            if result:
                # Prepare response
                response_data = {
                    'message': 'Discussion comment added successfully',
                    'discussion_id': discussion_id,
                    'success': True
                }
                logger.info(f"Discussion comment added successfully with ID: {discussion_id}")
                return jsonify(response_data), 201
            else:
                logger.error("Failed to insert discussion into database - insert_document returned None")
                return jsonify({
                    'message': 'Failed to add discussion comment',
                    'success': False
                }), 500
        except Exception as e:
            logger.error(f"Failed to insert discussion into database: {str(e)}")
            return jsonify({
                'message': 'Failed to add discussion comment',
                'success': False
            }), 500
    
    except Exception as e:
        logger.error(f"Error in add_discussion_comment: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@complaints_bp.route('/discussion/<discussion_id>', methods=['DELETE'])
def delete_discussion_comment(discussion_id):
    """Delete a discussion comment"""
    try:
        # Get phone from query parameters (for authorization check)
        phone = request.args.get('phone')
        if not phone:
            return jsonify({
                'message': 'Missing phone parameter',
                'success': False
            }), 400
            
        # Check if discussion exists
        discussion = get_document_by_field(DISCUSSIONS_COLLECTION, 'discussion_id', discussion_id)
        if not discussion:
            return jsonify({
                'message': 'Discussion comment not found',
                'success': False
            }), 404
            
        # Check if user is authorized to delete this comment
        if discussion.get('phone') != phone:
            # Check if the user is the complaint owner
            complaint = get_document_by_field(COMPLAINTS_COLLECTION, 'complaint_id', discussion.get('complaint_id'))
            if complaint and complaint.get('phone') != phone:
                return jsonify({
                    'message': 'Not authorized to delete this comment',
                    'success': False
                }), 403
        
        # Delete discussion
        result = delete_document(DISCUSSIONS_COLLECTION, {'discussion_id': discussion_id})
        
        if result and result.deleted_count > 0:
            return jsonify({
                'message': 'Discussion comment deleted successfully',
                'success': True
            }), 200
        else:
            return jsonify({
                'message': 'Failed to delete discussion comment',
                'success': False
            }), 500
            
    except Exception as e:
        logger.error(f"Error in delete_discussion_comment: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

@complaints_bp.route('/<complaint_id>/discussion', methods=['GET'])
def get_complaint_discussions(complaint_id):
    """Get all discussions for a specific complaint with pagination"""
    try:
        # Verify complaint exists
        complaint = get_document_by_field(COMPLAINTS_COLLECTION, 'complaint_id', complaint_id)
        if not complaint:
            logger.warning(f"Complaint not found with ID: {complaint_id}")
            return jsonify({
                'message': 'Complaint not found',
                'success': False
            }), 404
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Calculate skip value
        skip = (page - 1) * limit
        
        # Query for discussions with pagination
        discussions = list(find_documents(
            DISCUSSIONS_COLLECTION, 
            {'complaint_id': complaint_id}, 
            sort=[('comment_datetime', -1)],  # Sort by newest first
            skip=skip,
            limit=limit
        ))
        
        # Get total count
        collection = get_collection(DISCUSSIONS_COLLECTION)
        total_count = collection.count_documents({'complaint_id': complaint_id})
        
        # Sanitize for JSON serialization
        discussions = sanitize_for_json(discussions)
        
        # Remove MongoDB _id for the response
        for discussion in discussions:
            if '_id' in discussion:
                del discussion['_id']
        
        return jsonify({
            'discussions': discussions,
            'count': len(discussions),
            'total': total_count,
            'page': page,
            'limit': limit,
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_complaint_discussions: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500

# Helper function to check if a user is blocked
def is_user_blocked(phone):
    """
    Check if a user is blocked from posting comments
    
    Args:
        phone (str): User's phone number
    
    Returns:
        dict or None: Blocked user record if blocked, None otherwise
    """
    try:
        return get_document_by_field(BLOCKED_USERS_COLLECTION, 'phone', phone)
    except Exception as e:
        logger.error(f"Error checking if user is blocked: {str(e)}")
        return None

# Helper function to block a user
def block_user(phone, comment_text, detection_result):
    """
    Block a user for posting abusive content
    
    Args:
        phone (str): User's phone number
        comment_text (str): The abusive comment
        detection_result (dict): The AI detection result
    
    Returns:
        bool: True if the user was successfully blocked, False otherwise
    """
    try:
        # Check if user already exists in blocked_users collection
        if check_document_exists_by_field(BLOCKED_USERS_COLLECTION, 'phone', phone):
            # Update existing record
            update_document(
                BLOCKED_USERS_COLLECTION,
                {'phone': phone},
                {'$set': {
                    'last_blocked_at': datetime.now().isoformat(),
                    'last_comment': comment_text,
                    'last_detection_result': detection_result
                }, 
                '$inc': {'violation_count': 1}}
            )
        else:
            # Create new blocked user record
            block_data = {
                'phone': phone,
                'first_blocked_at': datetime.now().isoformat(),
                'last_blocked_at': datetime.now().isoformat(),
                'violation_count': 1,
                'last_comment': comment_text,
                'last_detection_result': detection_result
            }
            
            # Get user data if available
            user_data = get_document_by_field(USERS_COLLECTION, 'phone', phone)
            if user_data:
                block_data['user_name'] = user_data.get('name', 'Unknown')
                block_data['email'] = user_data.get('email', 'Unknown')
                
            # Insert block record
            insert_document(BLOCKED_USERS_COLLECTION, block_data)
            
        logger.warning(f"User {phone} has been blocked for posting abusive content")
        return True
        
    except Exception as e:
        logger.error(f"Error blocking user: {str(e)}")
        logger.error(traceback.format_exc())
        return False

@complaints_bp.route('/discussion/blocked/<phone>', methods=['GET'])
def check_user_block_status(phone):
    """Check if a user is blocked from posting discussions"""
    try:
        # Check if user is blocked
        blocked_user = is_user_blocked(phone)
        
        if blocked_user:
            # Sanitize for JSON response
            blocked_user = sanitize_for_json(blocked_user)
            
            # Remove MongoDB _id
            if '_id' in blocked_user:
                del blocked_user['_id']
                
            return jsonify({
                'blocked': True,
                'block_details': blocked_user,
                'success': True
            }), 200
        else:
            return jsonify({
                'blocked': False,
                'success': True
            }), 200
            
    except Exception as e:
        logger.error(f"Error checking user block status: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'message': f'Server error: {str(e)}',
            'success': False
        }), 500 