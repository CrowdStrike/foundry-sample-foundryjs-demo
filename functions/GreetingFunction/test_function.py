#!/usr/bin/env python3
"""
Simple test script for the Greeting Function.
This demonstrates how the function works locally before deployment.
"""
import json
import sys
import os

# Add the function directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from main import FUNC
from crowdstrike.foundry.function import Request


def test_greeting_function():
    """Test the greeting function with sample data."""

    # Test case 1: Valid request
    print("Test 1: Valid greeting request")
    test_request = Request(
        body={'name': 'Alice'},
        method='POST',
        path='/greet'
    )

    response = FUNC.handlers[0].handler(test_request)
    print(f"Response code: {response.code}")
    print(f"Response body: {json.dumps(response.body, indent=2)}")
    print()

    # Test case 2: Missing name parameter
    print("Test 2: Missing name parameter")
    test_request_empty = Request(
        body={},
        method='POST',
        path='/greet'
    )

    response_empty = FUNC.handlers[0].handler(test_request_empty)
    print(f"Response code: {response_empty.code}")
    print(f"Response errors: {[error.message for error in response_empty.errors] if response_empty.errors else 'None'}")
    print()

    # Test case 3: No body
    print("Test 3: No request body")
    test_request_no_body = Request(
        body=None,
        method='POST',
        path='/greet'
    )

    response_no_body = FUNC.handlers[0].handler(test_request_no_body)
    print(f"Response code: {response_no_body.code}")
    print(f"Response errors: {[error.message for error in response_no_body.errors] if response_no_body.errors else 'None'}")


if __name__ == "__main__":
    test_greeting_function()