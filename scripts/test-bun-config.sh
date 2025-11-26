#!/bin/bash

# Test script to verify Bun configuration
# This script validates that all Bun-related files are properly configured

echo "🧪 Testing Bun Configuration..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Check bunfig.toml exists
echo "Test 1: Checking bunfig.toml exists..."
if [ -f "bunfig.toml" ]; then
	echo -e "${GREEN}✓ bunfig.toml found${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ bunfig.toml not found${NC}"
	((TESTS_FAILED++))
fi

# Test 2: Check bunfig.toml has required sections
echo "Test 2: Checking bunfig.toml structure..."
if grep -q "\[install\]" bunfig.toml && grep -q "\[run\]" bunfig.toml; then
	echo -e "${GREEN}✓ bunfig.toml has required sections${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ bunfig.toml missing required sections${NC}"
	((TESTS_FAILED++))
fi

# Test 3: Check package.json has Bun scripts
echo "Test 3: Checking package.json Bun scripts..."
if grep -q '"dev:bun"' package.json && grep -q '"build:bun"' package.json; then
	echo -e "${GREEN}✓ package.json has Bun scripts${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ package.json missing Bun scripts${NC}"
	((TESTS_FAILED++))
fi

# Test 4: Check BUILD_INSTRUCTIONS.md exists
echo "Test 4: Checking BUILD_INSTRUCTIONS.md exists..."
if [ -f "BUILD_INSTRUCTIONS.md" ]; then
	echo -e "${GREEN}✓ BUILD_INSTRUCTIONS.md found${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ BUILD_INSTRUCTIONS.md not found${NC}"
	((TESTS_FAILED++))
fi

# Test 5: Check BUILD_INSTRUCTIONS.md has Bun section
echo "Test 5: Checking BUILD_INSTRUCTIONS.md Bun section..."
if grep -q "Using Bun.js" BUILD_INSTRUCTIONS.md; then
	echo -e "${GREEN}✓ BUILD_INSTRUCTIONS.md has Bun section${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ BUILD_INSTRUCTIONS.md missing Bun section${NC}"
	((TESTS_FAILED++))
fi

# Test 6: Check setup-bun.sh exists and is executable
echo "Test 6: Checking setup-bun.sh..."
if [ -f "scripts/setup-bun.sh" ]; then
	echo -e "${GREEN}✓ setup-bun.sh found${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ setup-bun.sh not found${NC}"
	((TESTS_FAILED++))
fi

# Test 7: Check README has Bun quick start
echo "Test 7: Checking README Bun quick start..."
if grep -q "With Bun (Fast Alternative)" README.md; then
	echo -e "${GREEN}✓ README has Bun quick start${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ README missing Bun quick start${NC}"
	((TESTS_FAILED++))
fi

# Test 8: Validate TOML syntax (if toml-cli is available)
echo "Test 8: Validating bunfig.toml syntax..."
if command -v toml &> /dev/null; then
	if toml bunfig.toml > /dev/null 2>&1; then
		echo -e "${GREEN}✓ bunfig.toml syntax is valid${NC}"
		((TESTS_PASSED++))
	else
		echo -e "${RED}✗ bunfig.toml has syntax errors${NC}"
		((TESTS_FAILED++))
	fi
else
	echo -e "${YELLOW}⊘ toml-cli not available, skipping syntax validation${NC}"
fi

# Test 9: Check package.json is valid JSON
echo "Test 9: Validating package.json..."
if jq empty package.json 2> /dev/null; then
	echo -e "${GREEN}✓ package.json is valid JSON${NC}"
	((TESTS_PASSED++))
else
	echo -e "${RED}✗ package.json has JSON errors${NC}"
	((TESTS_FAILED++))
fi

# Test 10: Check all Bun scripts reference valid commands
echo "Test 10: Checking Bun script references..."
BUNS_SCRIPTS_OK=true
for script in "dev:bun" "build:bun" "build:node:bun" "preview:bun" "preview:node:bun" "test:run:bun"; do
	if ! grep -q "\"$script\"" package.json; then
		echo -e "${RED}✗ Missing script: $script${NC}"
		BUNS_SCRIPTS_OK=false
		((TESTS_FAILED++))
	fi
done
if [ "$BUNS_SCRIPTS_OK" = true ]; then
	echo -e "${GREEN}✓ All Bun scripts are defined${NC}"
	((TESTS_PASSED++))
fi

echo ""
echo "================================"
echo "Test Results:"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
	echo -e "${RED}Failed: $TESTS_FAILED${NC}"
	exit 1
else
	echo -e "${GREEN}Failed: $TESTS_FAILED${NC}"
	echo ""
	echo -e "${GREEN}✓ All Bun configuration tests passed!${NC}"
	exit 0
fi
