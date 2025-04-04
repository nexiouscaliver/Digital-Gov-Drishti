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

## References

- [Documenting API Endpoints](https://idratherbewriting.com/learnapidoc/docendpoints.html)
- [Stoplight API Documentation Guide](https://stoplight.io/api-documentation-guide)

---

This documentation is intended to provide developers with the necessary details regarding API endpoints, sample request data, and response examples for testing and integration purposes. 