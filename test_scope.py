
def test_func():
    try:
        print(f"Time: {datetime.now()}")
        print(f"Req: {requests.__name__}")
        print("Test Passed")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    from datetime import datetime
    import requests
    test_func()
