# AI/xgboost/test_xgboost.py
import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

class TestXGBoostService(unittest.TestCase):
    
    def setUp(self):
        """Setup before each test"""
        # Apply numpy compatibility patch
        try:
            import numpy._core
        except ImportError:
            try:
                from numpy import core as _core
                sys.modules['numpy._core'] = _core
            except ImportError:
                pass
    
    def test_import_predict(self):
        """Test that predict module can be imported"""
        try:
            import predict
            self.assertIsNotNone(predict)
            print("✅ Predict module imported successfully")
        except Exception as e:
            self.fail(f"Import failed: {e}")
    
    def test_app_exists(self):
        """Test that FastAPI app exists"""
        try:
            from predict import app
            self.assertIsNotNone(app)
            print("✅ FastAPI app exists")
        except Exception as e:
            self.fail(f"App import failed: {e}")
    
    def test_health_endpoint(self):
        """Test health endpoint"""
        try:
            from predict import app
            from fastapi.testclient import TestClient
            
            client = TestClient(app)
            response = client.get("/health")
            
            self.assertEqual(response.status_code, 200)
            self.assertIn("status", response.json())
            print("✅ Health endpoint works")
        except Exception as e:
            self.fail(f"Health endpoint test failed: {e}")

if __name__ == "__main__":
    unittest.main()