#!/bin/bash

# MENTAS Tobacco Traceability API - Test Script
# This script tests all Petani endpoints
# Make sure the server is running on http://localhost:3000

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print section header
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
}

print_header "MENTAS API Test Suite"

# Test 1: Health Check
print_header "1. Testing Health Check"
echo "GET $BASE_URL/health"
curl -s $BASE_URL/health | python3 -m json.tool
print_result $?

# Test 2: Get Statistics
print_header "2. Testing Get Statistics"
echo "GET $API_URL/petani/stats"
curl -s $API_URL/petani/stats | python3 -m json.tool
print_result $?

# Test 3: Get All Petani (Empty)
print_header "3. Testing Get All Petani (should be empty)"
echo "GET $API_URL/petani"
curl -s "$API_URL/petani" | python3 -m json.tool
print_result $?

# Test 4: Create Petani #1
print_header "4. Testing Create Petani #1"
echo "POST $API_URL/petani"
PETANI_1=$(curl -s -X POST $API_URL/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3507021234567890",
    "nama_lengkap": "Ahmad Suryadi",
    "tanggal_lahir": "1985-05-15",
    "jenis_kelamin": "L",
    "alamat": "Jl. Tembakau No. 123, RT 02/RW 05",
    "kelurahan": "Sanan Wetan",
    "kecamatan": "Blimbing",
    "kota_kabupaten": "Malang",
    "provinsi": "Jawa Timur",
    "kode_pos": "65131",
    "no_telepon": "081234567890",
    "email": "ahmad.suryadi@example.com",
    "status": "aktif"
  }')
echo $PETANI_1 | python3 -m json.tool
print_result $?
PETANI_1_ID=$(echo $PETANI_1 | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('id', ''))")
echo -e "${YELLOW}Created Petani ID: $PETANI_1_ID${NC}"

# Test 5: Create Petani #2
print_header "5. Testing Create Petani #2"
echo "POST $API_URL/petani"
PETANI_2=$(curl -s -X POST $API_URL/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3507029876543210",
    "nama_lengkap": "Siti Nurhaliza",
    "tanggal_lahir": "1990-08-20",
    "jenis_kelamin": "P",
    "alamat": "Jl. Mawar No. 45, RT 03/RW 02",
    "kelurahan": "Lowokwaru",
    "kecamatan": "Lowokwaru",
    "kota_kabupaten": "Malang",
    "provinsi": "Jawa Timur",
    "kode_pos": "65141",
    "no_telepon": "082345678901",
    "email": "siti.nurhaliza@example.com",
    "status": "aktif"
  }')
echo $PETANI_2 | python3 -m json.tool
print_result $?
PETANI_2_ID=$(echo $PETANI_2 | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('id', ''))")
echo -e "${YELLOW}Created Petani ID: $PETANI_2_ID${NC}"

# Test 6: Create Petani #3
print_header "6. Testing Create Petani #3"
echo "POST $API_URL/petani"
PETANI_3=$(curl -s -X POST $API_URL/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3507025555666677",
    "nama_lengkap": "Budi Santoso",
    "tanggal_lahir": "1978-12-10",
    "jenis_kelamin": "L",
    "alamat": "Jl. Raya Turen No. 88",
    "kelurahan": "Turen",
    "kecamatan": "Turen",
    "kota_kabupaten": "Malang",
    "provinsi": "Jawa Timur",
    "no_telepon": "083456789012",
    "status": "aktif"
  }')
echo $PETANI_3 | python3 -m json.tool
print_result $?

# Test 7: Try to create duplicate NIK (should fail)
print_header "7. Testing Duplicate NIK (should fail with 409)"
echo "POST $API_URL/petani (duplicate NIK)"
curl -s -X POST $API_URL/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3507021234567890",
    "nama_lengkap": "Duplicate Test",
    "tanggal_lahir": "1990-01-01",
    "jenis_kelamin": "L",
    "alamat": "Test Address",
    "kelurahan": "Test",
    "kecamatan": "Test",
    "kota_kabupaten": "Test",
    "provinsi": "Test",
    "no_telepon": "081111111111"
  }' | python3 -m json.tool
echo -e "${YELLOW}(Expected: 409 Conflict)${NC}"

# Test 8: Invalid validation (should fail)
print_header "8. Testing Invalid Validation (should fail with 400)"
echo "POST $API_URL/petani (invalid NIK length)"
curl -s -X POST $API_URL/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "123",
    "nama_lengkap": "Invalid Test",
    "tanggal_lahir": "1990-01-01",
    "jenis_kelamin": "X",
    "alamat": "Test",
    "kelurahan": "Test",
    "kecamatan": "Test",
    "kota_kabupaten": "Test",
    "provinsi": "Test",
    "no_telepon": "081111111111"
  }' | python3 -m json.tool
echo -e "${YELLOW}(Expected: 400 Validation Error)${NC}"

# Test 9: Get all petani (should have 3 records)
print_header "9. Testing Get All Petani (should have 3 records)"
echo "GET $API_URL/petani"
curl -s "$API_URL/petani" | python3 -m json.tool
print_result $?

# Test 10: Get petani with pagination
print_header "10. Testing Pagination (page 1, limit 2)"
echo "GET $API_URL/petani?page=1&limit=2"
curl -s "$API_URL/petani?page=1&limit=2" | python3 -m json.tool
print_result $?

# Test 11: Search petani
print_header "11. Testing Search (search=Siti)"
echo "GET $API_URL/petani?search=Siti"
curl -s "$API_URL/petani?search=Siti" | python3 -m json.tool
print_result $?

# Test 12: Filter by status
print_header "12. Testing Filter (status=aktif)"
echo "GET $API_URL/petani?status=aktif"
curl -s "$API_URL/petani?status=aktif" | python3 -m json.tool
print_result $?

# Test 13: Sort by name
print_header "13. Testing Sort (sort_by=nama_lengkap, order=ASC)"
echo "GET $API_URL/petani?sort_by=nama_lengkap&order=ASC"
curl -s "$API_URL/petani?sort_by=nama_lengkap&order=ASC" | python3 -m json.tool
print_result $?

# Test 14: Get single petani by ID
if [ ! -z "$PETANI_1_ID" ]; then
    print_header "14. Testing Get Petani by ID"
    echo "GET $API_URL/petani/$PETANI_1_ID"
    curl -s $API_URL/petani/$PETANI_1_ID | python3 -m json.tool
    print_result $?
fi

# Test 15: Update petani
if [ ! -z "$PETANI_1_ID" ]; then
    print_header "15. Testing Update Petani"
    echo "PUT $API_URL/petani/$PETANI_1_ID"
    curl -s -X PUT $API_URL/petani/$PETANI_1_ID \
      -H "Content-Type: application/json" \
      -d '{
        "no_telepon": "081999888777",
        "status": "nonaktif"
      }' | python3 -m json.tool
    print_result $?
fi

# Test 16: Get statistics (updated)
print_header "16. Testing Get Statistics (updated)"
echo "GET $API_URL/petani/stats"
curl -s $API_URL/petani/stats | python3 -m json.tool
print_result $?

# Test 17: Get petani with status filter (should show 1 nonaktif)
print_header "17. Testing Filter (status=nonaktif)"
echo "GET $API_URL/petani?status=nonaktif"
curl -s "$API_URL/petani?status=nonaktif" | python3 -m json.tool
print_result $?

# Test 18: Delete petani
if [ ! -z "$PETANI_2_ID" ]; then
    print_header "18. Testing Delete Petani"
    echo "DELETE $API_URL/petani/$PETANI_2_ID"
    curl -s -X DELETE $API_URL/petani/$PETANI_2_ID | python3 -m json.tool
    print_result $?
fi

# Test 19: Try to get deleted petani (should fail with 404)
if [ ! -z "$PETANI_2_ID" ]; then
    print_header "19. Testing Get Deleted Petani (should fail with 404)"
    echo "GET $API_URL/petani/$PETANI_2_ID"
    curl -s $API_URL/petani/$PETANI_2_ID | python3 -m json.tool
    echo -e "${YELLOW}(Expected: 404 Not Found)${NC}"
fi

# Test 20: Final statistics
print_header "20. Final Statistics"
echo "GET $API_URL/petani/stats"
curl -s $API_URL/petani/stats | python3 -m json.tool
print_result $?

# Test 21: Final list
print_header "21. Final Petani List"
echo "GET $API_URL/petani"
curl -s "$API_URL/petani" | python3 -m json.tool
print_result $?

print_header "Test Suite Completed!"
echo -e "${GREEN}All tests executed. Check results above.${NC}\n"
