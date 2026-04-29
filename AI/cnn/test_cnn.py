import unittest
import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

class TestCNNService(unittest.TestCase):
    
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
        """Test health check endpoint"""
        try:
            from predict import app
            from fastapi.testclient import TestClient
            
            client = TestClient(app)
            response = client.get("/health")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), {"status": "ok"})
        except ImportError as e:
            self.fail(f"Health endpoint test failed: {e}")
    
    def test_model_classes_loaded(self):
        """Test that class names are loaded"""
        try:
            import predict
            self.assertIsNotNone(predict.CLASS_NAMES)
            self.assertGreater(len(predict.CLASS_NAMES), 0)
        except ImportError as e:
            self.fail(f"Model classes test failed: {e}")

if __name__ == '__main__':
    unittest.main()