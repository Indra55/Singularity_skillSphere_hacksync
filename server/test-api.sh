#!/bin/bash

# Quick Test Script for HackSync REST API
# Make this file executable: chmod +x test-api.sh

BASE_URL="http://localhost:5555"
COOKIE_FILE="cookies.txt"

echo "🚀 Testing HackSync REST API (Port 5555)"
echo "========================================"
echo ""

# Clean up old cookies
rm -f $COOKIE_FILE

echo "1️⃣  Health Check..."
curl -X GET $BASE_URL/ \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "2️⃣  Registering new user..."
curl -X POST $BASE_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "3️⃣  Logging in..."
curl -X POST $BASE_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c $COOKIE_FILE \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "4️⃣  Getting current user profile (protected)..."
curl -X GET $BASE_URL/api/users/me \
  -b $COOKIE_FILE \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "5️⃣  Creating a post..."
curl -X POST $BASE_URL/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test post from the automated script!"
  }' \
  -b $COOKIE_FILE \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "6️⃣  Viewing all posts..."
curl -X GET $BASE_URL/api/posts \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "7️⃣  Logging out..."
curl -X POST $BASE_URL/api/users/logout \
  -b $COOKIE_FILE \
  -c $COOKIE_FILE \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "8️⃣  Testing protected route without auth (should fail)..."
curl -X GET $BASE_URL/api/users/me \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "✅ Test complete!"
echo ""
echo "Expected results:"
echo "  - Steps 1, 3, 4, 6, 7: Status 200"
echo "  - Steps 2, 5: Status 201"
echo "  - Step 8: Status 401 (Unauthorized)"
echo ""
echo "Cookie file saved to: $COOKIE_FILE"
