"""
Tests for PRONUBE main module
"""
import sys
import os
from io import StringIO

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
    """Test that main function executes and prints correct output"""
    try:
        import main
        
        # Capture stdout to verify output
        captured_output = StringIO()
        sys.stdout = captured_output
        
        main.main()
        
        # Restore stdout
        sys.stdout = sys.__stdout__
        
        output = captured_output.getvalue()
        
        # Verify expected messages are in output
        assert "¡Bienvenido a PRONUBE!" in output
        assert "Sistema de gestión en la nube inicializado correctamente" in output
        assert "¡Sí, podemos empezar!" in output
        
        print("✓ Test passed: main function executes correctly with expected output")
        return True
    except Exception as e:
        sys.stdout = sys.__stdout__
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
