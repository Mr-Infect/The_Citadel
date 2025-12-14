#!/bin/bash

# LLM Cyber Range - Challenge Upload Script
# This script uploads all challenge sets to the database

echo "🚀 LLM Cyber Range - Challenge Upload Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API endpoint
API_URL="http://localhost:5000/api"

# Get admin token
echo -e "${BLUE}Step 1: Logging in as admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to login. Please check admin credentials.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Login successful!${NC}"
echo ""

# Upload Practitioner challenges
echo -e "${BLUE}Step 2: Uploading Practitioner challenges (10 challenges)...${NC}"
PRAC_RESPONSE=$(curl -s -X POST "$API_URL/admin/upload-vulnerabilities" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@challenges-practitioner.json")

PRAC_CREATED=$(echo $PRAC_RESPONSE | grep -o '"created":[0-9]*' | cut -d':' -f2)
echo -e "${GREEN}✓ Uploaded $PRAC_CREATED Practitioner challenges${NC}"
echo ""

# Upload Expert challenges
echo -e "${BLUE}Step 3: Uploading Expert challenges (10 challenges)...${NC}"
EXPERT_RESPONSE=$(curl -s -X POST "$API_URL/admin/upload-vulnerabilities" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@challenges-expert.json")

EXPERT_CREATED=$(echo $EXPERT_RESPONSE | grep -o '"created":[0-9]*' | cut -d':' -f2)
echo -e "${GREEN}✓ Uploaded $EXPERT_CREATED Expert challenges${NC}"
echo ""

# Upload Enterprise challenges
echo -e "${BLUE}Step 4: Uploading Enterprise challenges (10 challenges)...${NC}"
ENTERPRISE_RESPONSE=$(curl -s -X POST "$API_URL/admin/upload-vulnerabilities" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@challenges-enterprise.json")

ENTERPRISE_CREATED=$(echo $ENTERPRISE_RESPONSE | grep -o '"created":[0-9]*' | cut -d':' -f2)
echo -e "${GREEN}✓ Uploaded $ENTERPRISE_CREATED Enterprise challenges${NC}"
echo ""

# Summary
TOTAL=$((PRAC_CREATED + EXPERT_CREATED + ENTERPRISE_CREATED))
echo "=============================================="
echo -e "${GREEN}✅ Upload Complete!${NC}"
echo ""
echo "📊 Summary:"
echo "  - Practitioner: $PRAC_CREATED challenges"
echo "  - Expert: $EXPERT_CREATED challenges"
echo "  - Enterprise: $ENTERPRISE_CREATED challenges"
echo "  - Total: $TOTAL challenges"
echo ""
echo "🎯 All OWASP Top 10 LLM vulnerabilities are now available!"
echo "   Students can start practicing at http://localhost:5173"
echo ""
