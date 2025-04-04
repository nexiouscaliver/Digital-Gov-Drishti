import os
import sys
import json
from datetime import datetime

# Add parent directory to path to import mongodb_utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from mongodb_utils import get_collection, insert_document, check_document_exists

def initialize_database():
    """Initialize MongoDB with test data"""
    print("Initializing database with test data...")
    
    # Initialize users collection with a test user
    users_collection = "users"
    test_user = {
        "_id": "user12345",
        "user_id": "user12345",
        "name": "Rajesh Kumar",
        "email": "rajesh.kumar@example.com",
        "phone": "+91 9876543210",
        "address": "123 Main Street, Bandra East, Mumbai",
        "created_at": datetime.now().isoformat()
    }
    
    # Delete existing user if it exists
    collection = get_collection(users_collection)
    collection.delete_one({"_id": "user12345"})
    print("Deleted existing test user if it existed")
    
    # Create the user with correct fields
    insert_document(users_collection, test_user)
    print(f"Created test user: {test_user['name']}")
    
    # Initialize status options
    status_options = [
        {"code": "pending", "label": "Pending", "description": "Complaint is registered but not yet assigned"},
        {"code": "assigned", "label": "Assigned", "description": "Complaint has been assigned to a department"},
        {"code": "in-progress", "label": "In Progress", "description": "Department is working on the complaint"},
        {"code": "resolved", "label": "Resolved", "description": "Complaint has been resolved"},
        {"code": "closed", "label": "Closed", "description": "Complaint is closed after resolution"},
        {"code": "rejected", "label": "Rejected", "description": "Complaint was rejected for some reason"}
    ]
    
    # Insert status options into a configuration collection
    config_collection = "configuration"
    
    if not check_document_exists_by_field(config_collection, "config_type", "status_options"):
        insert_document(config_collection, {
            "_id": "status_options",
            "config_type": "status_options",
            "values": status_options,
            "updated_at": datetime.now().isoformat()
        })
        print("Created status options configuration")
    else:
        print("Status options configuration already exists")
    
    print("Database initialization complete!")

def check_document_exists_by_field(collection_name, field_name, field_value):
    """Check if a document exists by a field value"""
    collection = get_collection(collection_name)
    return collection.count_documents({field_name: field_value}, limit=1) > 0

if __name__ == "__main__":
    initialize_database() 