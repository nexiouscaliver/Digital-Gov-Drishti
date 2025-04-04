#!/usr/bin/env python
"""
Test script for Citizen Grievance Redressal System API
This script tests all API endpoints with sample data
"""

import requests
import json
import time
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define API base URL (change if needed)
BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api")

# Sample test data for complaints
SAMPLE_COMPLAINT_1 = {
    "user_id": "user12345",
    "location": "Bandra East, Mumbai",
    "title": "Garbage not collected for 3 days",
    "description": "The garbage from our street hasn't been picked up for 3 days, causing bad smell and health hazards to local residents. This is a recurring issue in our neighborhood.",
    "anonymous": False,
    "tags": ["sanitation", "public health"],
    "incident_datetime": (datetime.now() - timedelta(days=3)).isoformat(),
    "media": {
        "images": ["base64encodedstring1"],  # Would be actual base64 in real use
        "videos": [],
        "documents": []
    }
}

SAMPLE_COMPLAINT_2 = {
    "user_id": "user12345",
    "location": "Andheri West, Mumbai",
    "title": "Pothole causing accidents",
    "description": "A large pothole has developed on the main road near Flora Fountain and has already caused multiple accidents. It's especially dangerous at night due to poor lighting in the area.",
    "anonymous": True,
    "tags": ["road safety", "infrastructure"],
    "incident_datetime": (datetime.now() - timedelta(days=5)).isoformat(),
    "media": {
        "images": ["base64encodedstring2", "base64encodedstring3"],  # Would be actual base64 in real use
        "videos": ["base64encodedvideo1"],  # Would be actual base64 in real use
        "documents": []
    }
}

SAMPLE_COMPLAINT_3 = {
    "user_id": "user12345",
    "location": "Dadar, Mumbai",
    "title": "Water supply interruption",
    "description": "We have not had water supply for the past 24 hours in our building. This is affecting over 50 families. No prior notice was given for this interruption.",
    "anonymous": False,
    "tags": ["water", "basic amenities"],
    "incident_datetime": (datetime.now() - timedelta(days=1)).isoformat(),
    # No media attached - this should be marked as unverified
    "media": {
        "images": [],
        "videos": [],
        "documents": []
    }
}

# Status update data
STATUS_UPDATE = {
    "status": "in-progress",
    "description": "Assigned to field team for inspection"
}

def print_with_separator(message):
    """Prints a message with a separator for better readability"""
    print("\n" + "=" * 80)
    print(message)
    print("=" * 80 + "\n")

def check_response(response, expected_status_code=200):
    """Checks if the API response is as expected"""
    print(f"Response Status Code: {response.status_code}")
    
    if response.status_code != expected_status_code:
        print(f"Error: Expected status code {expected_status_code}, got {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    try:
        response_data = response.json()
        print(f"Success: {response_data.get('success', False)}")
        if not response_data.get('success', False):
            print(f"Error message: {response_data.get('message', 'No message')}")
            return False
        return response_data
    except json.JSONDecodeError:
        print("Error: Invalid JSON response")
        print(f"Response: {response.text}")
        return False

def test_register_complaint(complaint_data):
    """Tests the complaint registration endpoint"""
    print_with_separator("Testing Complaint Registration")
    print(f"Registering complaint: {complaint_data['title']}")
    
    response = requests.post(f"{BASE_URL}/complaints", json=complaint_data)
    response_data = check_response(response, 201)
    
    if response_data:
        print(f"Complaint registered with ID: {response_data.get('complaint_id')}")
        print(f"Assigned to department: {response_data.get('assigned_department')}")
        print(f"Severity: {response_data.get('severity')}")
        print(f"Verified: {response_data.get('verified')}")
        return response_data.get('complaint_id')
    
    return None

def test_get_complaint(complaint_id):
    """Tests retrieving a specific complaint"""
    print_with_separator(f"Testing Get Complaint Details for ID: {complaint_id}")
    
    response = requests.get(f"{BASE_URL}/complaints/{complaint_id}")
    response_data = check_response(response)
    
    if response_data and 'complaint' in response_data:
        complaint = response_data['complaint']
        print(f"Title: {complaint.get('title')}")
        print(f"Department: {complaint.get('assigned_department')}")
        print(f"Status: {complaint.get('status')}")
        print(f"Severity: {complaint.get('severity')}")
        print(f"Verified: {complaint.get('verified')}")
        return complaint
    
    return None

def test_update_complaint_status(complaint_id, status_data):
    """Tests updating a complaint's status"""
    print_with_separator(f"Testing Update Complaint Status for ID: {complaint_id}")
    print(f"New status: {status_data['status']}")
    
    response = requests.put(f"{BASE_URL}/complaints/{complaint_id}/status", json=status_data)
    response_data = check_response(response)
    
    if response_data:
        print(f"Status updated successfully to: {status_data['status']}")
        return True
    
    return False

def test_get_user_complaints(user_id):
    """Tests retrieving all complaints for a user"""
    print_with_separator(f"Testing Get User Complaints for User ID: {user_id}")
    
    response = requests.get(f"{BASE_URL}/users/{user_id}/complaints")
    response_data = check_response(response)
    
    if response_data and 'complaints' in response_data:
        complaints = response_data['complaints']
        print(f"Total complaints found: {len(complaints)}")
        for i, complaint in enumerate(complaints, 1):
            print(f"\nComplaint {i}:")
            print(f"ID: {complaint.get('complaint_id')}")
            print(f"Title: {complaint.get('title')}")
            print(f"Department: {complaint.get('assigned_department')}")
            print(f"Status: {complaint.get('status')}")
            print(f"Severity: {complaint.get('severity')}")
            print(f"Verified: {complaint.get('verified')}")
        return complaints
    
    return []

def test_get_complaints_by_severity(severity_level="high"):
    """Tests retrieving complaints by severity level"""
    print_with_separator(f"Testing Get Complaints by Severity: {severity_level}")
    
    response = requests.get(f"{BASE_URL}/complaints/severity/{severity_level}")
    response_data = check_response(response)
    
    if response_data and 'complaints' in response_data:
        complaints = response_data['complaints']
        print(f"Total complaints found: {len(complaints)}")
        for i, complaint in enumerate(complaints, 1):
            print(f"\nComplaint {i}:")
            print(f"ID: {complaint.get('complaint_id')}")
            print(f"Title: {complaint.get('title')}")
            print(f"Severity: {complaint.get('severity')}")
            print(f"Department: {complaint.get('assigned_department')}")
        return complaints
    
    return []

def test_get_complaint_blog(complaint_id):
    """Tests generating/retrieving a blog for a complaint"""
    print_with_separator(f"Testing Get Complaint Blog for ID: {complaint_id}")
    
    response = requests.get(f"{BASE_URL}/complaints/{complaint_id}/blog")
    response_data = check_response(response)
    
    if response_data and 'blog' in response_data:
        blog = response_data['blog']
        print(f"Blog Title: {blog.get('title')}")
        print(f"Has Proof: {blog.get('has_proof')}")
        print(f"Verified: {blog.get('verified')}")
        print(f"Complaint Link: {blog.get('complaint_link')}")
        print(f"Generated At: {blog.get('generated_at')}")
        
        # Print a snippet of the content (first 150 characters)
        content = blog.get('content', '')
        print(f"Content Snippet: {content[:150]}...")
        
        return blog
    
    return None

def test_get_all_blogs():
    """Tests retrieving all blogs with pagination"""
    print_with_separator("Testing Get All Blogs")
    
    response = requests.get(f"{BASE_URL}/complaints/blogs?page=1&limit=5")
    response_data = check_response(response)
    
    if response_data and 'blogs' in response_data:
        blogs = response_data['blogs']
        
        print(f"Page: {response_data.get('page')}")
        print(f"Total blogs: {response_data.get('total')}")
        print(f"Blogs per page: {response_data.get('limit')}")
        print(f"Blogs in current page: {len(blogs)}")
        
        for i, blog in enumerate(blogs, 1):
            print(f"\nBlog {i}:")
            print(f"Title: {blog.get('title')}")
            print(f"Complaint ID: {blog.get('complaint_id')}")
            print(f"Department: {blog.get('department')}")
            print(f"Severity: {blog.get('severity')}")
            print(f"Has Proof: {blog.get('has_proof')}")
            print(f"Generated At: {blog.get('generated_at')}")
        
        return blogs
    
    return []

def run_all_tests():
    """Runs all API tests in sequence"""
    print_with_separator("STARTING API TESTS")
    
    # Register complaints
    complaint_id_1 = test_register_complaint(SAMPLE_COMPLAINT_1)
    time.sleep(1)  # Wait a bit to avoid flooding the API
    complaint_id_2 = test_register_complaint(SAMPLE_COMPLAINT_2)
    time.sleep(1)
    complaint_id_3 = test_register_complaint(SAMPLE_COMPLAINT_3)
    time.sleep(1)
    
    # Skip remaining tests if registration failed
    if not complaint_id_1 or not complaint_id_2 or not complaint_id_3:
        print_with_separator("ERROR: Failed to register one or more complaints. Aborting remaining tests.")
        return
    
    # Get complaint details
    complaint_1 = test_get_complaint(complaint_id_1)
    time.sleep(1)
    
    # Update complaint status
    if complaint_1:
        test_update_complaint_status(complaint_id_1, STATUS_UPDATE)
        time.sleep(1)
    
    # Get user complaints
    test_get_user_complaints("user12345")
    time.sleep(1)
    
    # Get complaints by severity
    test_get_complaints_by_severity("high")
    time.sleep(1)
    
    # Generate and get blog for a complaint
    if complaint_id_1:
        test_get_complaint_blog(complaint_id_1)
        time.sleep(2)  # Generating the blog might take a bit longer
    
    # Get all blogs
    test_get_all_blogs()
    
    print_with_separator("ALL TESTS COMPLETED")

if __name__ == "__main__":
    run_all_tests() 