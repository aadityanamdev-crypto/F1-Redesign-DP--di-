#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class F1HubAPITester:
    def __init__(self, base_url="https://race-theory-lab.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.test_user_id = None

    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, cookies=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if not endpoint.startswith('/') else f"{self.base_url}{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        self.log(f"Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}", "ERROR")
                try:
                    error_detail = response.json()
                    self.log(f"   Error details: {error_detail}", "ERROR")
                except:
                    self.log(f"   Response: {response.text}", "ERROR")
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Exception: {str(e)}", "ERROR")
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        self.log("=== Testing Basic Endpoints ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test F1 data endpoints
        success, teams = self.run_test("Get F1 Teams", "GET", "f1/teams", 200)
        if success and isinstance(teams, list):
            self.log(f"   Found {len(teams)} teams")
            if len(teams) != 10:
                self.log(f"   Warning: Expected 10 teams, got {len(teams)}", "WARN")
        
        success, drivers = self.run_test("Get F1 Drivers", "GET", "f1/drivers", 200)
        if success and isinstance(drivers, list):
            self.log(f"   Found {len(drivers)} drivers")
            if len(drivers) != 20:
                self.log(f"   Warning: Expected 20 drivers, got {len(drivers)}", "WARN")
        
        # Test standings endpoint
        self.run_test("Get F1 Standings", "GET", "f1/standings", 200)
        
        # Test quiz endpoints
        success, quizzes = self.run_test("Get Quizzes", "GET", "quizzes", 200)
        if success and isinstance(quizzes, list):
            self.log(f"   Found {len(quizzes)} quizzes")
            expected_quizzes = ['basics', 'flags', 'strategy']
            for quiz_id in expected_quizzes:
                self.run_test(f"Get {quiz_id} Quiz", "GET", f"quizzes/{quiz_id}", 200)

    def test_auth_flow(self):
        """Test authentication flow"""
        self.log("=== Testing Authentication Flow ===")
        
        # Test admin login
        admin_data = {
            "email": "admin@f1hub.com",
            "password": "admin123"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, admin_data)
        if success:
            self.log("   Admin login successful")
            
            # Test /me endpoint
            success, user_data = self.run_test("Get Current User", "GET", "auth/me", 200)
            if success:
                self.log(f"   User: {user_data.get('name', 'Unknown')} ({user_data.get('role', 'Unknown')})")
        
        # Test user registration
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@test.com"
        register_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Test User"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, register_data)
        if success:
            self.test_user_id = response.get('id')
            self.log(f"   Registered user: {response.get('name')} (ID: {self.test_user_id})")
            
            # Test logout
            self.run_test("User Logout", "POST", "auth/logout", 200)
            
            # Test login with new user
            login_data = {
                "email": test_email,
                "password": "TestPass123!"
            }
            success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        
        # Test invalid login
        invalid_data = {
            "email": "invalid@test.com",
            "password": "wrongpass"
        }
        self.run_test("Invalid Login", "POST", "auth/login", 401, invalid_data)

    def test_progress_tracking(self):
        """Test progress tracking functionality"""
        self.log("=== Testing Progress Tracking ===")
        
        # Test updating progress
        progress_data = {
            "section_id": "basics",
            "completed": True
        }
        self.run_test("Update Progress", "POST", "progress", 200, progress_data)
        
        # Test getting progress
        success, progress = self.run_test("Get Progress", "GET", "progress", 200)
        if success:
            self.log(f"   Progress data: {progress}")

    def test_bookmarks(self):
        """Test bookmark functionality"""
        self.log("=== Testing Bookmarks ===")
        
        # Test adding bookmark
        bookmark_data = {
            "item_type": "driver",
            "item_id": "1"
        }
        self.run_test("Add Bookmark", "POST", "bookmarks", 200, bookmark_data)
        
        # Test removing bookmark
        self.run_test("Remove Bookmark", "DELETE", "bookmarks/driver/1", 200)

    def test_quiz_submission(self):
        """Test quiz submission"""
        self.log("=== Testing Quiz Submission ===")
        
        # Submit a quiz with sample answers
        quiz_answers = [
            {"quiz_id": "basics", "question_id": "q1", "answer": "Drag Reduction System"},
            {"quiz_id": "basics", "question_id": "q2", "answer": "10"},
            {"quiz_id": "basics", "question_id": "q3", "answer": "2"},
            {"quiz_id": "basics", "question_id": "q4", "answer": "Halo"},
            {"quiz_id": "basics", "question_id": "q5", "answer": "Wings and aerodynamic elements"}
        ]
        
        success, result = self.run_test("Submit Quiz", "POST", "quizzes/basics/submit", 200, quiz_answers)
        if success:
            score = result.get('score', 0)
            self.log(f"   Quiz score: {score}%")

    def test_brute_force_protection(self):
        """Test brute force protection"""
        self.log("=== Testing Brute Force Protection ===")
        
        # Try multiple failed logins
        invalid_data = {
            "email": "brute@test.com",
            "password": "wrongpass"
        }
        
        for i in range(6):  # Try 6 times to trigger lockout
            expected_status = 429 if i >= 5 else 401
            self.run_test(f"Brute Force Attempt {i+1}", "POST", "auth/login", expected_status, invalid_data)

    def run_all_tests(self):
        """Run all tests"""
        self.log("Starting F1 Hub API Tests")
        self.log(f"Testing against: {self.base_url}")
        
        try:
            self.test_basic_endpoints()
            self.test_auth_flow()
            self.test_progress_tracking()
            self.test_bookmarks()
            self.test_quiz_submission()
            self.test_brute_force_protection()
            
        except Exception as e:
            self.log(f"Test suite error: {str(e)}", "ERROR")
        
        # Print results
        self.log("=== Test Results ===")
        self.log(f"Tests passed: {self.tests_passed}/{self.tests_run}")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        self.log(f"Success rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = F1HubAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())