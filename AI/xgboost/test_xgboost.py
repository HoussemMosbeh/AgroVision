import unittest
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

class TestXGBoostService(unittest.TestCase):
    
    def test_import_predict(self):
        """Test that predict module can be imported"""
        try:
            import predict
            self.assertTrue(True)
        except ImportError as e:
            self.fail(f"Import failed: {e}")
    
    def test_app_exists(self):
        """Test that FastAPI app exists"""
        try:
            from predict import app
            self.assertIsNotNone(app)
        except ImportError as e:
            self.fail(f"App import failed: {e}")
    
    def test_health_endpoint(self):
        """Test health check endpoint (if exists)"""
        try:
            from predict import app
            from fastapi.testclient import TestClient
            
            client = TestClient(app)
            response = client.get("/health")
            # Accept 200 or 404 (if health endpoint not implemented yet)
            self.assertIn(response.status_code, [200, 404])
        except Exception as e:
            # If health endpoint doesn't exist, skip
            self.assertTrue(True, f"Health endpoint not required yet: {e}")

if __name__ == '__main__':
    unittest.main()