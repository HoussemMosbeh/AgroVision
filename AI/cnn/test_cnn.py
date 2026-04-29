import unittest

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

if __name__ == '__main__':
    unittest.main()