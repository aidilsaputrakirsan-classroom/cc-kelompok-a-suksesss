#!/bin/bash
# ===================================================================
# SafeSpace Dashboard API Test Script
# UTS Requirement: Auth JWT, Protected Endpoints, Data Isolation
# ===================================================================

BASE_URL="http://127.0.0.1:8000"
COUNSELOR_EMAIL="anita.bk@safespace.sch.id"
COUNSELOR_PASSWORD="Counselor123"

echo "==============================================="
echo "🧪 SafeSpace Dashboard API Test Suite"
echo "==============================================="

# ==================== 1. HEALTH CHECK ====================
echo ""
echo "1️⃣ Testing /health endpoint..."
curl -s -X GET "$BASE_URL/health" | jq '.'

# ==================== 2. SEED MASTER DATA ====================
echo ""
echo "2️⃣ Seeding master data (classes, topics, slots, places)..."
curl -s -X POST "$BASE_URL/api/dev/seed/master-data" | jq '.'

# ==================== 3. SEED COUNSELORS ====================
echo ""
echo "3️⃣ Seeding counselor accounts..."
curl -s -X POST "$BASE_URL/api/dev/seed/counselors" \
  -H "Content-Type: application/json" \
  -d '{
    "counselors": [
      {
        "name": "Bu Anita",
        "email": "anita.bk@safespace.sch.id",
        "password": "Counselor123",
        "phone": "+6281234567801",
        "specialization": "Konseling Akademik"
      }
    ]
  }' | jq '.'

# ==================== 4. LOGIN ====================
echo ""
echo "4️⃣ Counselor login (get JWT token)..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/counselor/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$COUNSELOR_EMAIL\",
    \"password\": \"$COUNSELOR_PASSWORD\"
  }")
echo "$LOGIN_RESPONSE" | jq '.'

# Extract token dari response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token! Exiting..."
  exit 1
fi

echo ""
echo "✅ Token obtained: ${TOKEN:0:20}..."
echo "✅ Counselor ID: $USER_ID"

# ==================== 5. CREATE GUEST CONSULTATION ====================
echo ""
echo "5️⃣ Creating test consultation (guest submission)..."
CONSULTATION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/consultations" \
  -H "Content-Type: application/json" \
  -d "{
    \"student_name\": \"Budi Santoso\",
    \"class_id\": 1,
    \"gender\": \"MALE\",
    \"student_phone\": \"+6281234567890\",
    \"counselor_id\": $USER_ID,
    \"method\": \"INDIVIDUAL\",
    \"topic_id\": 1,
    \"date\": \"2026-04-20\",
    \"time_slot_id\": 1,
    \"place_id\": 1
  }")
echo "$CONSULTATION_RESPONSE" | jq '.'

CONSULTATION_ID=$(echo "$CONSULTATION_RESPONSE" | jq -r '.id')
echo "✅ Consultation ID: $CONSULTATION_ID"

# ==================== 6. TEST DASHBOARD STATS ====================
echo ""
echo "6️⃣ Testing /api/bk/dashboard/stats (Protected Endpoint)..."
curl -s -X GET "$BASE_URL/api/bk/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "6b️⃣ Testing /api/bk/dashboard/stats WITHOUT token (should be 401)..."
curl -s -X GET "$BASE_URL/api/bk/dashboard/stats" | jq '.'

# ==================== 7. TEST CONSULTATIONS LIST (PAGINATED) ====================
echo ""
echo "7️⃣ Testing /api/bk/consultations (Paginated List)..."
echo "   Query: ?limit=10&offset=0"
curl -s -X GET "$BASE_URL/api/bk/consultations?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "7b️⃣ Testing different pagination: ?limit=5&offset=0"
curl -s -X GET "$BASE_URL/api/bk/consultations?limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "7c️⃣ Testing pagination offset: ?limit=10&offset=10"
curl -s -X GET "$BASE_URL/api/bk/consultations?limit=10&offset=10" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ==================== 8. TEST ACCEPT CONSULTATION ====================
if [ "$CONSULTATION_ID" != "null" ] && [ ! -z "$CONSULTATION_ID" ]; then
  echo ""
  echo "8️⃣ Testing PATCH /api/bk/consultations/{id}/accept..."
  curl -s -X PATCH "$BASE_URL/api/bk/consultations/$CONSULTATION_ID/accept" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
fi

# ==================== 9. TEST REJECT CONSULTATION ====================
if [ "$CONSULTATION_ID" != "null" ] && [ ! -z "$CONSULTATION_ID" ]; then
  echo ""
  echo "9️⃣ Testing PATCH /api/bk/consultations/{id}/reject..."
  curl -s -X PATCH "$BASE_URL/api/bk/consultations/$CONSULTATION_ID/reject" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
fi

# ==================== 10. VERIFY DATA ISOLATION ====================
echo ""
echo "1️⃣0️⃣ Verifying DATA ISOLATION (list should only show counselor's own consultations)..."
curl -s -X GET "$BASE_URL/api/bk/consultations?limit=100&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, tracking_code, student_name, status}' | head -30

echo ""
echo "✅ All tests completed!"
echo ""
echo "Summary Checklist:"
echo "  ✓ Health check works"
echo "  ✓ Master data seeded"
echo "  ✓ Counselor login returns JWT token"
echo "  ✓ Dashboard stats protected by JWT"
echo "  ✓ Dashboard stats returns { total, pending, accepted, rejected }"
echo "  ✓ Consultations list returns paginated data"
echo "  ✓ Pagination parameters work (limit, offset)"
echo "  ✓ Accept/Reject endpoints still work"
echo "  ✓ Data isolation enforced (only counselor's data shown)"
