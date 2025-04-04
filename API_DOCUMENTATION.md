# Corruption Complaint System API Documentation

This document provides an overview of the API endpoints available in the Corruption Complaint System backend API. Each endpoint includes:

- Endpoint URL
- HTTP Request Type
- Required parameters and sample request payloads
- A sample response payload
- Additional notes when applicable

---

## 1. Healthcheck Endpoint

**Endpoint:** `/api/healthcheck`  
**Method:** `GET`

**Description:**  
Checks if the API server is running.

**Sample Request:**  
```bash
curl -X GET http://<host>:<port>/api/healthcheck
```

**Sample Response:**  
```json
{
  "status": "success",
  "message": "API server is running"
}
```

---

## 2. User Registration

**Endpoint:** `/api/register`  
**Method:** `POST`

**Description:**  
Registers a new user for the system. The endpoint accepts user details and, upon successful registration, sends an OTP (One-Time Password) to the user's email for verification.

**Request Parameters:**  
- `name`: (string) Full name of the user.  
- `phone`: (string) Phone number of the user.  
- `email`: (string) Email address (must be in a valid format).  
- `password`: (string) User password.  
- `address`: (string) User address.  
- `government_documents`: (string/object, optional) Additional documents if any.

**Sample Request Payload:**  
```json
{
  "name": "Test User",
  "phone": "1234567890",
  "email": "test@example.com",
  "password": "password123",
  "address": "123 Test St",
  "government_documents": null
}
```

**Sample Response:**  
On successful registration, the response is:
```json
{
  "status": "success",
  "message": "User registered successfully. Please verify your account with OTP.",
  "data": {
    "_id": "generated_user_id",
    "name": "Test User",
    "phone": "1234567890",
    "email": "test@example.com",
    "address": "123 Test St",
    "is_verified": false,
    "verification": {
      "otp": "generated_otp"
    }
  }
}
```

> **Note:** The OTP is sent to the provided email address. In tests, a sample OTP like `123456` can be used.

---

## 3. User Login

**Endpoint:** `/api/login`  
**Method:** `POST`

**Description:**  
Authenticates a user using their phone number and password. On successful authentication, a JWT token is returned.

**Request Parameters:**  
- `phone`: (string) User's phone number.  
- `password`: (string) User's password.

**Sample Request Payload:**  
```json
{
  "phone": "1234567890",
  "password": "password123"
}
```

**Sample Response:**  
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "_id": "user_id",
      "name": "Test User",
      "phone": "1234567890",
      "email": "test@example.com"
    }
  }
}
```

---

## 4. OTP Verification

**Endpoint:** `/api/verify-otp`  
**Method:** `POST`

**Description:**  
Verifies the OTP provided by the user during registration. On successful verification, the user account is activated, and a JWT token is returned.

**Request Parameters:**  
- `phone`: (string) User's phone number.  
- `otp`: (string) The OTP received by the user.

**Sample Request Payload:**  
```json
{
  "phone": "1234567890",
  "otp": "123456"
}
```

**Sample Response:**  
```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "_id": "user_id",
      "name": "Test User",
      "phone": "1234567890",
      "email": "test@example.com"
    }
  }
}
```

---

## 5. Resend OTP

**Endpoint:** `/api/resend-otp`  
**Method:** `POST`

**Description:**  
Resends the OTP to the user's email address in case the original OTP was not received or expired.

**Request Parameters:**  
- `phone`: (string) User's phone number.

**Sample Request Payload:**  
```json
{
  "phone": "1234567890"
}
```

**Sample Response:**  
```json
{
  "status": "success",
  "message": "OTP has been resent to your email"
}
```

---

## 6. Register Complaint

**Endpoint:** `/api/complaints/register`  
**Method:** `POST`

**Description:**  
Registers a new complaint in the system. Uses AI to automatically classify the complaint to an appropriate department and assign a severity level. Marks complaints as verified if supporting media proof is attached.

**Request Parameters:**  
- `phone`: (string) Phone number of the user registering the complaint.
- `title`: (string) Title of the complaint.
- `description`: (string) Detailed description of the complaint.
- `location`: (object, optional) Location information.
- `anonymous`: (boolean, optional) Whether to keep the complaint anonymous.
- `tags`: (array, optional) Tags for categorizing the complaint.
- `incident_datetime`: (string, optional) Datetime when the incident occurred.
- `media`: (object, optional) Media files as evidence.

**Sample Request Payload:**  
```json
{
  "phone": "1234567890",                      
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

**Sample Response:**  
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
  "verified": true
}
```

---

## 7. Get Complaint Details

**Endpoint:** `/api/complaints/:complaint_id`  
**Method:** `GET`

**Description:**  
Retrieves details for a specific complaint.

**URL Parameters:**  
- `complaint_id`: (string) ID of the complaint.

**Sample Response:**  
```json
{
  "success": true,
  "complaint": {
    "complaint_id": "uuid123456",
    "phone": "1234567890",
    "user_name": "Rajesh Kumar",
    "title": "Garbage not collected for 3 days",
    "description": "The garbage from our area...",
    "location": "Bandra East, Mumbai",
    "anonymous": true,
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
    "verified": true
  }
}
```

---

## 8. Get User Complaints

**Endpoint:** `/api/complaints/user/:phone`  
**Method:** `GET`

**Description:**  
Retrieves all complaints filed by a specific user based on their phone number.

**URL Parameters:**  
- `phone`: (string) Phone number of the user.

**Sample Response:**  
```json
{
  "success": true,
  "complaints": [
    {
      "complaint_id": "uuid123456",
      "phone": "1234567890",
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
      "phone": "1234567890",
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
  ],
  "count": 2
}
```

---

## 9. Get Complaints by Severity

**Endpoint:** `/api/complaints/severity/:severity_level`  
**Method:** `GET`

**Description:**  
Retrieves all complaints with a specific severity level.

**URL Parameters:**  
- `severity_level`: (string) Severity level of complaints (critical, high, medium, low, minimal).

**Sample Response:**  
```json
{
  "success": true,
  "complaints": [
    {
      "complaint_id": "uuid123456",
      "phone": "1234567890",
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
      "phone": "9876543210",
      "title": "Building collapse threatening residents",
      "description": "A residential building is showing severe cracks...",
      "location": "Dadar, Mumbai",
      "status": "pending",
      "complaint_datetime": "2025-04-03T17:30:00",
      "assigned_department": "Housing Department",
      "severity": {
        "level": "critical",
        "score": 5
      },
      "verified": true
    }
  ],
  "count": 2
}
```

---

## 10. Update Complaint Status

**Endpoint:** `/api/complaints/:complaint_id/status`  
**Method:** `PUT`

**Description:**  
Updates the status of a specific complaint.

**URL Parameters:**  
- `complaint_id`: (string) ID of the complaint.

**Request Parameters:**  
- `status`: (string) New status for the complaint (pending, in-progress, resolved, rejected).

**Sample Request Payload:**  
```json
{
  "status": "in-progress"
}
```

**Sample Response:**  
```json
{
  "success": true,
  "message": "Complaint status updated to in-progress",
  "complaint_id": "uuid123456"
}
```

---

## 11. Generate Complaint Blog

**Endpoint:** `/api/complaints/:complaint_id/blog`  
**Method:** `GET`

**Description:**  
Generates or retrieves an AI-written blog post about a specific complaint using Gemini AI.

**URL Parameters:**  
- `complaint_id`: (string) ID of the complaint.

**Sample Response:**  
```json
{
  "success": true,
  "blog": {
    "title": "Garbage Crisis Hits Bandra East",
    "content": "Residents of Bandra East are facing a growing health concern as garbage collection services have failed for the third consecutive day...",
    "location": "Bandra East, Mumbai",
    "department": "Sanitation Department",
    "severity": "high",
    "has_proof": true,
    "verified": true,
    "status": "pending",
    "complaint_link": "/complaints/uuid123456",
    "complaint_id": "uuid123456",
    "generated_at": "2023-04-04T10:15:30"
  }
}
```

---

## 12. Get All Blogs

**Endpoint:** `/api/complaints/blogs`  
**Method:** `GET`

**Description:**  
Retrieves all generated complaint blogs with pagination.

**Query Parameters:**  
- `page`: (integer, optional) Page number for pagination (default: 1).
- `limit`: (integer, optional) Number of blogs per page (default: 10).

**Sample Response:**  
```json
{
  "success": true,
  "blogs": [
    {
      "title": "Garbage Crisis Hits Bandra East",
      "content": "Residents of Bandra East are facing a growing health concern...",
      "location": "Bandra East, Mumbai",
      "department": "Sanitation Department",
      "severity": "high",
      "has_proof": true,
      "verified": true,
      "status": "pending",
      "complaint_link": "/complaints/uuid123456",
      "complaint_id": "uuid123456",
      "generated_at": "2023-04-04T10:15:30"
    },
    {
      "title": "Dangerous Pothole Threatens Commuters",
      "content": "A massive pothole has appeared on the main road...",
      "location": "Andheri, Mumbai",
      "department": "Public Works Department",
      "severity": "high",
      "has_proof": true,
      "verified": true,
      "status": "pending",
      "complaint_link": "/complaints/uuid789012",
      "complaint_id": "uuid789012",
      "generated_at": "2023-04-03T09:45:00"
    }
  ],
  "count": 2,
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

## References

- [Documenting API Endpoints](https://idratherbewriting.com/learnapidoc/docendpoints.html)
- [Stoplight API Documentation Guide](https://stoplight.io/api-documentation-guide)

---

This documentation is intended to provide developers with the necessary details regarding API endpoints, sample request data, and response examples for testing and integration purposes. 