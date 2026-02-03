"""
Tests for PRONUBE main module
"""
import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

def test_main_import():
    """Test that main module can be imported"""
    try:
        import main
        assert hasattr(main, 'main')
        print("✓ Test passed: main module imports correctly")
        return True
    except ImportError as e:
        print(f"✗ Test failed: {e}")
        return False

def test_main_execution():
    """Test that main function executes without errors"""
    try:
        import main
        # Run main function (it prints output but shouldn't raise errors)
        main.main()
        print("✓ Test passed: main function executes correctly")
        return True
    except Exception as e:
        print(f"✗ Test failed: {e}")
        return False

if __name__ == "__main__":
    print("Running PRONUBE tests...\n")
    
    results = []
    results.append(test_main_import())
    results.append(test_main_execution())
    
    print(f"\n{'='*50}")
    print(f"Tests run: {len(results)}")
    print(f"Tests passed: {sum(results)}")
    print(f"Tests failed: {len(results) - sum(results)}")
    
    if all(results):
        print("All tests passed! ✓")
        sys.exit(0)
    else:
        print("Some tests failed! ✗")
        sys.exit(1)
