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
            # Verify app has the predict endpoint
            has_predict = False
            for route in app.routes:
                if route.path == "/predict" and "POST" in route.methods:
                    has_predict = True
                    break
            self.assertTrue(has_predict, "POST /predict endpoint not found")
        except ImportError as e:
            self.fail(f"App import failed: {e}")
    
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