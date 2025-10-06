# Bar Event Booking API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format

All API responses follow a standardized format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }  // Optional
  }
}
```

## HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Request succeeded with no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Endpoints

---

### Sessions

#### Get All Sessions
```http
GET /api/sessions
```

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Session 1",
      "start_time": "2025-10-04T18:00:00Z",
      "end_time": "2025-10-04T20:00:00Z",
      "total_slots": 10,
      "available_slots": 5,
      "created_at": "2025-10-01T10:00:00Z"
    }
  ]
}
```

---

#### Get Session by ID
```http
GET /api/sessions/:id
```

**Parameters**
- `id` (path) - Session ID

**Response (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Session 1",
    "start_time": "2025-10-04T18:00:00Z",
    "end_time": "2025-10-04T20:00:00Z",
    "total_slots": 10,
    "available_slots": 5,
    "created_at": "2025-10-01T10:00:00Z"
  }
}
```

**Error Response (404)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Session not found"
  }
}
```

---

#### Create Session
```http
POST /api/sessions
```

**Access**: Private (Admin)

**Request Body**
```json
{
  "name": "Session 1",
  "start_time": "2025-10-04T18:00:00Z",
  "end_time": "2025-10-04T20:00:00Z",
  "total_slots": 10
}
```

**Validation Rules**
- `name` - Required, string
- `start_time` - Required, valid ISO 8601 datetime
- `end_time` - Required, valid ISO 8601 datetime, must be after start_time
- `total_slots` - Required, positive number

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Session 1",
    "start_time": "2025-10-04T18:00:00Z",
    "end_time": "2025-10-04T20:00:00Z",
    "total_slots": 10,
    "available_slots": 10,
    "created_at": "2025-10-01T10:00:00Z"
  },
  "message": "Session created successfully"
}
```

**Error Response (400)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Missing required fields",
    "details": {
      "fields": ["name", "start_time"]
    }
  }
}
```

---

#### Update Session
```http
PUT /api/sessions/:id
```

**Access**: Private (Admin)

**Parameters**
- `id` (path) - Session ID

**Request Body**
```json
{
  "name": "Updated Session",
  "start_time": "2025-10-04T18:00:00Z",
  "end_time": "2025-10-04T20:00:00Z",
  "total_slots": 15
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Session",
    "start_time": "2025-10-04T18:00:00Z",
    "end_time": "2025-10-04T20:00:00Z",
    "total_slots": 15,
    "available_slots": 10,
    "created_at": "2025-10-01T10:00:00Z"
  },
  "message": "Session updated successfully"
}
```

---

### Bookings

#### Get All Bookings
```http
GET /api/bookings
```

**Access**: Private (Admin)

**Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "session_id": 1,
      "session_name": "Session 1",
      "start_time": "2025-10-04T18:00:00Z",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 234 567 8900",
      "created_at": "2025-10-02T12:00:00Z"
    }
  ]
}
```

---

#### Create Booking
```http
POST /api/bookings
```

**Access**: Public

**Request Body**
```json
{
  "session_id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1 234 567 8900"
}
```

**Validation Rules**
- `session_id` - Required, valid session ID
- `name` - Required, minimum 2 characters
- `email` - Required, valid email format
- `phone` - Optional, minimum 8 characters if provided

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 234 567 8900",
    "created_at": "2025-10-02T12:00:00Z"
  },
  "message": "Booking created successfully"
}
```

**Error Responses**

**Invalid Email (400)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid email format"
  }
}
```

**No Available Slots (400)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "No available slots for this session"
  }
}
```

**Session Not Found (404)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Session not found"
  }
}
```

---

#### Delete Booking
```http
DELETE /api/bookings/:id
```

**Access**: Private (Admin)

**Parameters**
- `id` (path) - Booking ID

**Response (204)**
No content returned

**Error Response (404)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Booking not found"
  }
}
```

---

### Authentication

#### Login
```http
POST /api/auth/login
```

**Access**: Public

**Request Body**
```json
{
  "username": "Avana",
  "password": "L3VentSeLève!"
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "username": "Avana"
  },
  "message": "Login successful"
}
```

**Error Response (401)**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials"
  }
}
```

---

### Health Check

#### Health Check
```http
GET /api/health
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-10-04T12:00:00Z",
    "uptime": 3600
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `BAD_REQUEST` | Invalid request data or validation error |
| `UNAUTHORIZED` | Authentication failed |
| `NOT_FOUND` | Requested resource not found |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The API uses JSON for all requests and responses
- Content-Type header should be `application/json` for all POST/PUT requests
- Authentication is currently basic (username/password). In production, implement JWT tokens.
