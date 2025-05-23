# Peenly-backend

# API Documentation
This document describes the available API endpoints for tutor/guardian registration, login, OTP verification, and profile management.

# Register Tutor
# Endpoint: POST api/v1/auth/register-tutor

Description: Registers a new tutor.

```json

{
  "phoneNumber": "+2348123456789",
  "password": "yourPassword123",
}
Response (Success):

{
  "message": "Tutor registered successfully",
  "tutor": { /* tutor data */ }
}

```
# Register Guardian
# Endpoint: POST api/v1/auth/register-guardian

Description: Registers a new guardian (parent).

```json
{
  "phoneNumber": "+2348123456789",
  "password": "securePassword",
}
Response (Success):

{
  "message": "Guardian registered successfully",
  "guardian": { /* guardian data */ }
}
```
# Login
# Endpoint: POST api/v1/auth/login

# Description: Logs in a tutor or guardian and sends an OTP to verify.

```json

{
  "phoneNumber": "+2348123456789",
  "password": "yourPassword123"
}
Response (Success):

{
  "message": "Log in successfull",
  "token": ****
}

```
# Verify OTP
# Endpoint: POST api/v1/auth/verify-otp

# Description: Verifies the OTP sent to the user's phone.

```json
{
  "phoneNumber": "+2348123456789",
  "otp": "123456"
}
Response (Success):

{
  "message": "OTP verified successfully",
}

```

## Add Child

- **Endpoint:** `PUT api/v1/child/add-child`
- **Description:** Adds a child to a guardian's profile.
- **Authentication:** Requires Bearer token in headers.
- **Request Body:**
```json
{
  "name": "Tommy Doe",
  "age": 8,
  "classLevel": "Primary 3"
}
```
- **Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

---

##  Complete Guardian Profile

- **Endpoint:** `PUT api/v1/guardian/complete-profile`
- **Description:** Completes the user’s profile (e.g., address, photo, bio, etc.).
- **Authentication:** Requires Bearer token in headers.
- **Request Body:**
```json
{
  "address": "123 Main Street",
  "relationship": "Mother",
  "profilePictureUrl": "https://example.com/profile.jpg"
}
```
- **Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

---

##  Complete Tutor Profile

- **Endpoint:** `PUT api/v1/tutor/complete-profile`
- **Description:** Completes the user’s profile (e.g., address, photo, bio, etc.).
- **Authentication:** Requires Bearer token in headers.
- **Request Body:**
```json
{
  "address": "123 Main Street",
  "bio": "Experienced tutor with a passion for education",
  "profilePictureUrl": "https://example.com/profile.jpg"
}
```
- **Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

---

##  Notes

- All endpoints expect `Content-Type: application/json` headers.
- Authenticated routes require a valid JWT token in the `Authorization` header.
