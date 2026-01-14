# REST API Testing Guide - HackSync API

## Base URL
```
http://localhost:5555
```

All API routes are prefixed with `/api`

> **Tip**: If you get a "Malformed JSON request" error, use the one-liner versions below.

### ⚡ Quick Start (One-Liners)
```bash
# Register
curl -X POST http://localhost:5555/api/users/register -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login (Saves cookie)
curl -X POST http://localhost:5555/api/users/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}' -c cookies.txt

# Get Profile (Uses cookie)
curl -X GET http://localhost:5555/api/users/me -b cookies.txt
```

---

## 📋 Table of Contents
1. [Health Check](#health-check)
2. [User Authentication](#user-authentication)
3. [Posts](#posts)
4. [Comments](#comments)
5. [Voting](#voting)

---

## Health Check

### Check API Status
```bash
curl -X GET http://localhost:5555/
```

**Response:**
```json
{
  "message": "HackSync API Server",
  "version": "1.0.0",
  "status": "running"
}
```

---

## User Authentication

### 1. Register New User
```bash
curl -X POST http://localhost:5555/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' \
  -v
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

### 2. Login
```bash
curl -X POST http://localhost:5555/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt \
  -v
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** The JWT token is automatically stored in an HTTP-only cookie and also returned in the response.

---

### 3. Get Current User Profile
```bash
curl -X GET http://localhost:5555/api/users/me \
  -b cookies.txt \
  -v
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

### 4. Update Profile
```bash
curl -X PUT http://localhost:5555/api/users/me \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername"
  }' \
  -b cookies.txt \
  -v
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "newusername",
    "email": "test@example.com"
  }
}
```

---

### 5. Logout
```bash
curl -X POST http://localhost:5555/api/users/logout \
  -b cookies.txt \
  -c cookies.txt \
  -v
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## Posts

### 1. Get All Posts
```bash
curl -X GET http://localhost:5555/api/posts \
  -v
```

**Response (200):**
```json
{
  "posts": [
    {
      "id": 1,
      "content": "This is my first post!",
      "upvotes": 5,
      "downvotes": 1,
      "user_id": 1,
      "created": "2026-01-14T15:00:00.000Z",
      "username": "testuser",
      "comment_count": "3"
    }
  ],
  "count": 1
}
```

---

### 2. Get Single Post
```bash
curl -X GET http://localhost:5555/api/posts/1 \
  -v
```

**Response (200):**
```json
{
  "post": {
    "id": 1,
    "content": "This is my first post!",
    "upvotes": 5,
    "downvotes": 1,
    "user_id": 1,
    "created": "2026-01-14T15:00:00.000Z",
    "username": "testuser"
  },
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "content": "Great post!",
      "created_at": "2026-01-14T15:05:00.000Z",
      "username": "anotheruser"
    }
  ],
  "userVote": null
}
```

---

### 3. Create New Post (Requires Auth)
```bash
curl -X POST http://localhost:5555/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my awesome post!"
  }' \
  -b cookies.txt \
  -v
```

**Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 2,
    "content": "This is my awesome post!",
    "upvotes": 0,
    "downvotes": 0,
    "user_id": 1,
    "created": "2026-01-14T15:10:00.000Z"
  }
}
```

---

## Comments

### 1. Get Comments for a Post
```bash
curl -X GET http://localhost:5555/api/posts/1/comments \
  -v
```

**Response (200):**
```json
{
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "content": "Great post!",
      "created_at": "2026-01-14T15:05:00.000Z",
      "username": "anotheruser"
    }
  ],
  "count": 1
}
```

---

### 2. Add Comment to Post (Requires Auth)
```bash
curl -X POST http://localhost:5555/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a great post!"
  }' \
  -b cookies.txt \
  -v
```

**Response (201):**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": 2,
    "post_id": 1,
    "user_id": 1,
    "content": "This is a great post!",
    "created_at": "2026-01-14T15:15:00.000Z"
  }
}
```

---

## Voting

### 1. Upvote a Post (Requires Auth)
```bash
curl -X POST http://localhost:5555/api/posts/1/upvote \
  -b cookies.txt \
  -v
```

**Response (200):**
```json
{
  "message": "Post upvoted",
  "action": "upvoted"
}
```

**Possible actions:**
- `upvoted` - Post was upvoted
- `removed` - Upvote was removed (clicked again)

---

### 2. Downvote a Post (Requires Auth)
```bash
curl -X POST http://localhost:5555/api/posts/1/downvote \
  -b cookies.txt \
  -v
```

**Response (200):**
```json
{
  "message": "Post downvoted",
  "action": "downvoted"
}
```

**Possible actions:**
- `downvoted` - Post was downvoted
- `removed` - Downvote was removed (clicked again)

---

## Complete Test Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:5555/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# 2. Login
curl -X POST http://localhost:5555/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# 3. Get current user
curl -X GET http://localhost:5555/api/users/me \
  -b cookies.txt

# 4. Create a post
curl -X POST http://localhost:5555/api/posts \
  -H "Content-Type: application/json" \
  -d '{"content":"My first API post!"}' \
  -b cookies.txt

# 5. Get all posts
curl -X GET http://localhost:5555/api/posts

# 6. Get single post (replace 1 with actual post ID)
curl -X GET http://localhost:5555/api/posts/1

# 7. Upvote the post
curl -X POST http://localhost:5555/api/posts/1/upvote \
  -b cookies.txt

# 8. Add a comment
curl -X POST http://localhost:5555/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post!"}' \
  -b cookies.txt

# 9. Get comments
curl -X GET http://localhost:5555/api/posts/1/comments

# 10. Logout
curl -X POST http://localhost:5555/api/users/logout \
  -b cookies.txt
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Please provide username, email, and password"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 409 Conflict
```json
{
  "error": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred during registration"
}
```

---

## Authentication Methods

### Option 1: Using Cookies (Recommended)
The API automatically sets an HTTP-only cookie on login. Use `-c cookies.txt` to save and `-b cookies.txt` to send cookies.

```bash
# Login and save cookie
curl -X POST http://localhost:5555/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Use cookie for authenticated requests
curl -X GET http://localhost:5555/api/users/me \
  -b cookies.txt
```

### Option 2: Using Bearer Token
You can also use the token from the login response as a Bearer token (requires adding Authorization header support).

---

## Tips

1. **Pretty Print JSON:**
   ```bash
   curl http://localhost:5555/api/posts | jq
   ```

2. **View Response Headers:**
   ```bash
   curl -i http://localhost:5555/api/posts
   ```

3. **Save Response to File:**
   ```bash
   curl http://localhost:5555/api/posts > posts.json
   ```

4. **Test with Different Users:**
   Create multiple users and test interactions between them.

---

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Health check |
| POST | `/api/users/register` | No | Register new user |
| POST | `/api/users/login` | No | Login user |
| POST | `/api/users/logout` | No | Logout user |
| GET | `/api/users/me` | Yes | Get current user |
| PUT | `/api/users/me` | Yes | Update profile |
| GET | `/api/posts` | No | Get all posts |
| GET | `/api/posts/:id` | No | Get single post |
| POST | `/api/posts` | Yes | Create post |
| POST | `/api/posts/:id/upvote` | Yes | Upvote post |
| POST | `/api/posts/:id/downvote` | Yes | Downvote post |
| GET | `/api/posts/:id/comments` | No | Get comments |
| POST | `/api/posts/:id/comments` | Yes | Add comment |
