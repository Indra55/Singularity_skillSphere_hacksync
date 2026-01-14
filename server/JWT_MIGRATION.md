# JWT Migration Summary

## ✅ Completed Changes

### 1. **Dependencies Updated** (`package.json`)
   - ❌ Removed: `passport`, `passport-local`, `express-session`, `express-flash`
   - ✅ Added: `jsonwebtoken`, `cookie-parser`

### 2. **Files Modified**

#### `server.js`
   - Removed Passport initialization and session middleware
   - Added `cookie-parser` middleware
   - Added `express.json()` for JSON body parsing
   - Removed flash messages

#### `middleware/auth.js`
   - Completely rewritten to use JWT verification
   - `authenticateToken()`: Verifies JWT from cookies and attaches user to request
   - `checkAuthenticated()`: Redirects to dashboard if already logged in
   - `checkNotAuthenticated()`: Requires authentication, redirects to login if not authenticated

#### `routes/users.js`
   - `/login` POST: Now generates JWT token and stores in HTTP-only cookie
   - `/logout` GET: Clears the JWT cookie
   - `/register` POST: Converted to async/await, removed flash messages
   - Removed all Passport.js authentication code

#### `routes/posts.js`
   - Removed flash message from post creation

### 3. **Files Deleted**
   - ❌ `config/passportConfig.js` (no longer needed)

### 4. **Files Created**
   - ✅ `.env.example` - Environment variables template
   - ✅ `API_TEST.md` - Complete cURL testing guide

---

## 🔧 Required Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Update Your `.env` File
Add the following variable to your `.env` file:

```env
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random_123456789
```

**Important:** Use a strong, random string for `JWT_SECRET`. You can generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Remove Old Session Secret (Optional)
You can remove `SESSION_SECRET` from your `.env` file as it's no longer needed.

---

## 🔑 How JWT Authentication Works Now

1. **Registration**: User registers → Password hashed → Stored in database
2. **Login**: 
   - User submits credentials
   - Server verifies password
   - Server generates JWT token with user ID and email
   - Token stored in HTTP-only cookie (secure, not accessible via JavaScript)
   - Token expires in 7 days
3. **Protected Routes**:
   - Middleware reads token from cookie
   - Verifies token signature using `JWT_SECRET`
   - Fetches user from database
   - Attaches user to `req.user`
4. **Logout**: Clears the cookie

---

## 🧪 Testing

See `API_TEST.md` for complete cURL testing commands.

Quick test:
```bash
# Register
curl -X POST http://localhost:4100/users/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&email=test@test.com&password=password123" \
  -c cookies.txt

# Login
curl -X POST http://localhost:4100/users/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@test.com&password=password123" \
  -c cookies.txt

# Access protected route
curl -X GET http://localhost:4100/users/dashboard \
  -b cookies.txt -L
```

---

## 🔒 Security Improvements

1. **Stateless Authentication**: No server-side session storage needed
2. **HTTP-Only Cookies**: Prevents XSS attacks (JavaScript can't access the token)
3. **Secure Flag**: In production, cookies only sent over HTTPS
4. **Token Expiration**: Tokens expire after 7 days
5. **No Session Store**: Reduces server memory usage and complexity

---

## 📝 Migration Benefits

- ✅ Simpler codebase (removed Passport complexity)
- ✅ Stateless authentication (easier to scale)
- ✅ Modern JWT standard
- ✅ Better for API development
- ✅ Easier to add mobile app support later
- ✅ No session store dependency

---

## 🚀 Next Steps (Optional Enhancements)

1. **Refresh Tokens**: Implement refresh token mechanism for better security
2. **Token Blacklist**: Add logout token blacklisting for immediate invalidation
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **Email Verification**: Add email verification on registration
5. **Password Reset**: Implement password reset with JWT tokens
6. **API Endpoints**: Create JSON API endpoints alongside EJS views
