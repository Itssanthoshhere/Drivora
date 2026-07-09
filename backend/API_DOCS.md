# API Documentation

> Base URL: `http://localhost:3000`

---

## Health Check

### `GET /api/v1/health`

Check if the server is running.

```bash
curl http://localhost:3000/api/v1/health
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Drivora",
  "env": "development",
  "timestamp": "2026-07-08T18:48:00.000Z"
}
```

---

## Authentication

All auth routes are prefixed with `/api/v1/auth`.

---

### `POST /api/v1/auth/register`

Create a new user account.

**Request Body**

| Field       | Type   | Required | Validation                       |
| ----------- | ------ | -------- | -------------------------------- |
| `email`     | string | ✅       | Valid email                      |
| `phone`     | string | ✅       | Indian mobile (`/^[6-9]\d{9}$/`) |
| `password`  | string | ✅       | Min 8 characters                 |
| `firstName` | string | ✅       | 1–50 characters                  |
| `lastName`  | string | ✅       | 1–50 characters                  |

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "santhosh02vs@gmail.com",
    "phone": "9940310662",
    "password": "pass",
    "firstName": "Santhosh",
    "lastName": "V S"
  }'
```

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Registration Successful",
  "data": {
    "user": {
      "id": "c517336e-...",
      "email": "santhosh02vs@gmail.com",
      "phone": "9940310662",
      "firstName": "Santhosh",
      "lastName": "V S",
      "role": "USER",
      "isVerified": false
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Error Responses**

| Status | Condition                         |
| ------ | --------------------------------- |
| `409`  | Email or phone already registered |
| `422`  | Validation error (Zod)            |

---

### `POST /api/v1/auth/login`

Authenticate an existing user.

**Request Body**

| Field      | Type   | Required | Validation             |
| ---------- | ------ | -------- | ---------------------- |
| `email`    | string | ✅       | Email or Indian mobile |
| `password` | string | ✅       | Min 1 char             |

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "santhosh02vs@gmail.com",
    "password": "password123"
  }'
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Login Successful",
  "data": {
    "user": {
      "id": "c517336e-...",
      "email": "santhosh02vs@gmail.com",
      "phone": "9940310662",
      "firstName": "Santhosh",
      "lastName": "V S",
      "role": "USER",
      "isVerified": false
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Error Responses**

| Status | Condition                            |
| ------ | ------------------------------------ |
| `401`  | Invalid credentials or inactive user |
| `422`  | Validation error (Zod)               |

> **Note:** On login, all previous refresh tokens for the user are revoked.

---

### `POST /api/v1/auth/refresh`

Exchange a valid refresh token for a new access/refresh token pair.

**Request Body**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `refreshToken` | string | ✅       |

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbG..."
  }'
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbG...(new)",
    "refreshToken": "eyJhbG...(new)"
  }
}
```

**Error Responses**

| Status | Condition                        |
| ------ | -------------------------------- |
| `401`  | Invalid or expired refresh token |
| `422`  | Validation error (Zod)           |

> **Note:** The old refresh token is deleted (single-use rotation).

---

### `POST /api/v1/auth/logout`

Revoke a refresh token.

**Request Body**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `refreshToken` | string | ✅       |

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbG..."
  }'
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Using Authenticated Routes

For endpoints that require authentication, include the access token in the `Authorization` header:

```bash
curl http://localhost:3000/api/v1/some-protected-route \
  -H "Authorization: Bearer eyJhbG..."
```

**Error Responses**

| Status | Condition             |
| ------ | --------------------- |
| `401`  | Missing/invalid token |
| `401`  | Token expired         |
| `403`  | Admin access required |

---

## Standard Error Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev only)"
}
```
