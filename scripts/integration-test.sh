#!/bin/bash

# Integration Test Script for reskill CLI
# Usage: ./scripts/integration-test.sh
#
# This script tests the built CLI by running actual commands
# against a temporary directory.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Get the project root directory (where this script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# CLI path (absolute)
CLI="node $PROJECT_ROOT/dist/cli/index.js"

# Create temp directory for tests
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "=============================================="
echo "  reskill Integration Tests"
echo "=============================================="
echo ""
echo "Using temp directory: $TEMP_DIR"
echo ""

# Helper function to run a test
run_test() {
  local name="$1"
  local cmd="$2"
  local expected_exit_code="${3:-0}"
  
  echo -n "Testing: $name... "
  
  set +e
  output=$(eval "$cmd" 2>&1)
  actual_exit_code=$?
  set -e
  
  if [ "$actual_exit_code" -eq "$expected_exit_code" ]; then
    echo -e "${GREEN}PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    echo "  Expected exit code: $expected_exit_code, got: $actual_exit_code"
    echo "  Output: $output"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# Helper function to check output contains string
run_test_output() {
  local name="$1"
  local cmd="$2"
  local expected_output="$3"
  
  echo -n "Testing: $name... "
  
  set +e
  output=$(eval "$cmd" 2>&1)
  actual_exit_code=$?
  set -e
  
  if echo "$output" | grep -q "$expected_output"; then
    echo -e "${GREEN}PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    echo "  Expected output to contain: $expected_output"
    echo "  Actual output: $output"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# Helper function to check file exists
check_file_exists() {
  local name="$1"
  local file="$2"
  
  echo -n "Testing: $name... "
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    echo "  File not found: $file"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# Helper function to check JSON field
check_json_field() {
  local name="$1"
  local file="$2"
  local jq_query="$3"
  local expected="$4"
  
  echo -n "Testing: $name... "
  
  # Use node to parse JSON since jq may not be available
  # Read file content and parse with JSON.parse
  actual=$(node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('$file', 'utf8')); console.log(JSON.stringify(data$jq_query));" 2>/dev/null | tr -d '"')
  
  if [ "$actual" = "$expected" ]; then
    echo -e "${GREEN}PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    echo "  Expected: $expected, got: $actual"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

echo "--- Version & Help ---"
run_test_output "version flag" "$CLI --version" "0.17.0"
run_test_output "help flag" "$CLI --help" "AI Skills Package Manager"
run_test_output "help shows init" "$CLI --help" "init"
run_test_output "help shows install" "$CLI --help" "install"

echo ""
echo "--- Init Command ---"
cd "$TEMP_DIR"

run_test "init creates skills.json" "$CLI init -y" 0
check_file_exists "skills.json exists" "$TEMP_DIR/skills.json"
check_json_field "skills.json has empty skills" "$TEMP_DIR/skills.json" ".skills" "{}"
check_json_field "skills.json has default installDir" "$TEMP_DIR/skills.json" ".defaults.installDir" ".skills"

run_test_output "init warns if exists" "$CLI init -y" "already exists"

# Test custom install dir
rm -f "$TEMP_DIR/skills.json"
run_test "init with custom dir" "$CLI init -y -d custom-skills" 0
check_json_field "custom installDir" "$TEMP_DIR/skills.json" ".defaults.installDir" "custom-skills"

echo ""
echo "--- List Command ---"
run_test_output "list shows no skills" "$CLI list" "No skills installed"
run_test "list json format" "$CLI list --json" 0

echo ""
echo "--- Info Command ---"
run_test_output "info missing skill" "$CLI info nonexistent" "not found" 

echo ""
echo "--- Outdated Command ---"
run_test_output "outdated no skills" "$CLI outdated" "No skills defined"

echo ""
echo "=============================================="
echo "  Test Results"
echo "=============================================="
echo ""
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ "$TESTS_FAILED" -gt 0 ]; then
  echo -e "${RED}Some tests failed!${NC}"
  exit 1
else
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
fi
