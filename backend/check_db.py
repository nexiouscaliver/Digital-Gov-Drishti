import os
import sys
import json
from datetime import datetime

# Add parent directory to path to import mongodb_utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from mongodb_utils import get_collection, get_document_by_field

def check_user():
    """Check if test user exists in the database"""
    user_id = "user12345"
    user = get_document_by_field("users", "user_id", user_id)
    
    if user:
        print(f"User found with user_id={user_id}:")
        print(json.dumps(user, indent=2, default=str))
    else:
        print(f"No user found with user_id={user_id}")
    
    # Check with _id field
    user = get_document_by_field("users", "_id", user_id)
    if user:
        print(f"\nUser found with _id={user_id}:")
        print(json.dumps(user, indent=2, default=str))
    else:
        print(f"\nNo user found with _id={user_id}")
    
    # List all users in the collection
    collection = get_collection("users")
    users = list(collection.find())
    print(f"\nTotal users in collection: {len(users)}")
    for i, user in enumerate(users, 1):
        print(f"\nUser {i}:")
        print(json.dumps(user, indent=2, default=str))

if __name__ == "__main__":
    check_user() 