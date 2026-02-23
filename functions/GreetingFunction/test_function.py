"""Test module for the GreetingFunction handler."""

import importlib
import unittest
from unittest.mock import patch

from crowdstrike.foundry.function import Request

import main


def mock_handler(*_args, **_kwargs):
    """Mock handler decorator for testing."""

    def identity(func):
        return func

    return identity


class TestGreetingFunction(unittest.TestCase):
    """Test case class for greeting function handler tests."""

    def setUp(self):
        """Set up test fixtures before each test method."""
        patcher = patch("crowdstrike.foundry.function.Function.handler", new=mock_handler)
        self.addCleanup(patcher.stop)
        self.handler_patch = patcher.start()

        importlib.reload(main)

    def test_valid_greeting(self):
        """Test successful greeting with a valid name."""
        request = Request()
        request.body = {"name": "Alice"}

        response = main.on_post(request)
        self.assertEqual(response.code, 200)
        self.assertIn("Alice", response.body["message"])
        self.assertEqual(response.body["name"], "Alice")

    def test_missing_name(self):
        """Test error response when name is missing."""
        request = Request()
        request.body = {}

        response = main.on_post(request)
        self.assertEqual(response.code, 400)
        self.assertTrue(response.errors)

    def test_no_body(self):
        """Test error response when body is None."""
        request = Request()
        request.body = None

        response = main.on_post(request)
        self.assertEqual(response.code, 400)
        self.assertTrue(response.errors)
