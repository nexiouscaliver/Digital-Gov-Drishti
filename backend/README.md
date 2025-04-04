# Citizen Grievance Redressal System - Backend

This is the backend service for the Citizen Grievance Redressal System, built with Python, Flask, and MongoDB.

## Setup Instructions

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up MongoDB:
   - Install MongoDB locally or use a cloud MongoDB instance
   - Set the following environment variables:
     ```
     MONGODB_USERNAME=your_username  # Required for cloud MongoDB
     MONGODB_PASSWORD=your_password  # Required for cloud MongoDB
     MONGODB_HOST=localhost          # Default is localhost
     MONGODB_PORT=27017              # Default is 27017
     MONGODB_TYPE=local              # Use 'atlas' for MongoDB Atlas
     ```

3. Set up Gemini API:
   - Get an API key from the [Google AI Studio](https://ai.google.dev/)
   - Add the API key to your .env file:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     ```

4. Start the Flask server:
   ```
   python app.py
   ```
   The server will start on `http://localhost:5000`

## API Documentation

### Register Complaint
**Endpoint:** `POST /api/complaints/register`

**Description:** Registers a new complaint in the system. Uses AI to automatically classify the complaint to an appropriate department and assign a severity level. Marks complaints as verified if supporting media proof is attached.

**Request Payload:**
```json
{
  "user_id": "user12345",                      
  "location": "Bandra East, Mumbai",
  "title": "Garbage not collected for 3 days",
  "description": "The garbage from our area hasn't been picked up...",
  "anonymous": true,                           
  "tags": ["swachh bharat", "local authority"],
  "incident_datetime": "2025-04-03T10:30:00",  
  "media": {
    "images": ["base64string1", "base64string2"],
    "videos": ["base64videostring"],
    "documents": ["base64docstring"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint registered successfully",
  "complaint_id": "uuid123456",
  "assigned_department": "Sanitation Department",
  "severity": {
    "level": "high",
    "score": 4
  },
  "verified": true,
  "tracking_url": "/complaints/track/uuid123456"
}
```

### Get Complaint Details
**Endpoint:** `GET /api/complaints/:complaint_id`

**Description:** Retrieves details for a specific complaint.

**Response:**
```json
{
  "success": true,
  "data": {
    "complaint_id": "uuid123456",
    "user_id": "user12345",
    "user_name": "Rajesh Kumar",
    "title": "Garbage not collected for 3 days",
    "description": "The garbage from our area...",
    "location": "Bandra East, Mumbai",
    "anonymous": true,
    "incident_datetime": "2025-04-03T10:30:00",
    "complaint_datetime": "2025-04-04T10:00:00",
    "tags": ["swachh bharat", "local authority"],
    "media": {
      "images": ["base64img1", "base64img2"],
      "videos": ["base64video1"],
      "documents": ["base64doc1"]
    },
    "status": "pending",
    "assigned_department": "Sanitation Department",
    "severity": {
      "level": "high",
      "score": 4
    },
    "verified": true,
    "tracking": [
      {
        "status": "pending",
        "timestamp": "2025-04-04T10:00:00",
        "description": "Complaint registered successfully"
      }
    ]
  }
}
```

### Get User Complaints
**Endpoint:** `GET /api/user/:user_id/complaints`

**Description:** Retrieves all complaints filed by a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "complaint_id": "uuid123456",
      "title": "Garbage not collected for 3 days",
      "description": "The garbage from our area...",
      "location": "Bandra East, Mumbai",
      "status": "pending",
      "complaint_datetime": "2025-04-04T10:00:00",
      "assigned_department": "Sanitation Department",
      "severity": {
        "level": "high",
        "score": 4
      },
      "verified": true
    },
    {
      "complaint_id": "uuid789012",
      "title": "Street light not working",
      "description": "The street light at the corner...",
      "location": "Bandra East, Mumbai",
      "status": "in-progress",
      "complaint_datetime": "2025-04-01T15:30:00",
      "assigned_department": "Electricity Department",
      "severity": {
        "level": "low",
        "score": 2
      },
      "verified": false
    }
  ]
}
```

### Get Complaints by Severity
**Endpoint:** `GET /api/complaints/by-severity`

**Description:** Retrieves all complaints sorted by severity (highest to lowest).

**Query Parameters:**
- `department` (optional): Filter by assigned department
- `status` (optional): Filter by complaint status
- `min_severity` (optional): Minimum severity score to include (1-5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "complaint_id": "uuid123456",
      "title": "Major water pipeline burst flooding area",
      "description": "A main water pipeline has burst...",
      "location": "Andheri West, Mumbai",
      "status": "pending",
      "complaint_datetime": "2025-04-04T10:00:00",
      "assigned_department": "Water Department",
      "severity": {
        "level": "critical",
        "score": 5
      },
      "verified": true
    },
    {
      "complaint_id": "uuid456789",
      "title": "Garbage not collected for 3 days",
      "description": "The garbage from our area...",
      "location": "Bandra East, Mumbai",
      "status": "pending",
      "complaint_datetime": "2025-04-04T10:00:00",
      "assigned_department": "Sanitation Department",
      "severity": {
        "level": "high",
        "score": 4
      },
      "verified": true
    }
  ]
}
```

### Get Complaint Blog
**Endpoint:** `GET /api/complaints/:complaint_id/blog`

**Description:** Generates or retrieves an AI-written blog post about a specific complaint. The blog post is automatically generated using Gemini AI and includes details about the complaint, its impact, and the expected resolution.

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Garbage Crisis Hits Bandra East",
    "content": "<h1>Garbage Crisis Hits Bandra East</h1><p>Residents of Bandra East are facing a growing health concern as garbage collection services have failed for the third consecutive day...</p><h2>The Situation</h2><p>...</p><h2>Impact on Citizens</h2><p>...</p><h2>Official Response</h2><p>...</p><h2>What Happens Next</h2><p>...</p>",
    "has_proof": true,
    "complaint_link": "/complaints/track/uuid123456",
    "verified": true,
    "department": "Sanitation Department",
    "severity": "high",
    "created_at": "2025-04-04T10:00:00",
    "generated_at": "2025-04-04T10:15:30"
  }
}
```

### Get All Blogs
**Endpoint:** `GET /api/complaints/blogs`

**Description:** Retrieves all generated complaint blogs with pagination.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of blogs per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Garbage Crisis Hits Bandra East",
      "content": "<h1>Garbage Crisis Hits Bandra East</h1><p>Residents of Bandra East are facing...</p>",
      "has_proof": true,
      "complaint_link": "/complaints/track/uuid123456",
      "verified": true,
      "department": "Sanitation Department",
      "severity": "high",
      "created_at": "2025-04-04T10:00:00",
      "generated_at": "2025-04-04T10:15:30",
      "complaint_id": "uuid123456"
    },
    {
      "title": "Dangerous Pothole Threatens Commuters",
      "content": "<h1>Dangerous Pothole Threatens Commuters</h1><p>A massive pothole has appeared...</p>",
      "has_proof": true,
      "complaint_link": "/complaints/track/uuid789012",
      "verified": true,
      "department": "Public Works Department",
      "severity": "high",
      "created_at": "2025-04-03T09:45:00",
      "generated_at": "2025-04-03T10:00:12",
      "complaint_id": "uuid789012"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### Update Complaint Status
**Endpoint:** `PUT /api/complaints/update-status/:complaint_id`

**Description:** Updates the status of a complaint and adds an entry to the tracking timeline.

**Request Payload:**
```json
{
  "status": "in-progress",
  "description": "Assigned to field team"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Complaint status updated successfully",
  "current_status": "in-progress"
}
```

## Features

1. **Complaint Registration:** API to register new complaints with detailed information.
2. **AI-Powered Department Assignment:** Uses Google's Gemini AI model to intelligently assign complaints to appropriate departments.
3. **Severity Classification:** AI-based severity assessment of complaints for prioritization.
4. **Complaint Tracking:** Maintains a timeline of status changes for each complaint.
5. **User Complaint History:** API to retrieve all complaints filed by a user.
6. **Status Updates:** API to update the status of a complaint and track the changes.
7. **Severity-Based Retrieval:** API to retrieve and sort complaints based on severity levels.
8. **Verification Status:** Tracks whether complaints have supporting evidence attached.
9. **AI-Generated Blogs:** Creates engaging, structured blog posts about complaints using Gemini AI.

## Severity Levels

The system uses the following severity levels to prioritize complaints:

1. **Critical (5):** Immediate attention required, major public safety concerns, life-threatening situations, or large-scale infrastructure failures.
2. **High (4):** Urgent issues that significantly affect quality of life, important infrastructure, or services for multiple citizens.
3. **Medium (3):** Standard priority issues that cause inconvenience but aren't urgent or threatening.
4. **Low (2):** Minor issues that have minimal impact and can be addressed in regular maintenance.
5. **Minimal (1):** Very minor issues with negligible impact. 