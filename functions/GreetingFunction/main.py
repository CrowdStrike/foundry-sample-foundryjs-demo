"""Simple greeting function for Foundry demo application."""
from crowdstrike.foundry.function import Function, Request, Response, APIError

FUNC = Function.instance()


@FUNC.handler(method="POST", path="/greet")
def on_post(request: Request) -> Response:
    """Generate a personalized greeting message.

    This function demonstrates basic Foundry Cloud Function capabilities:
    - Receiving parameters from request body
    - Processing input data
    - Returning structured responses
    """

    # Extract name from request body
    name = request.body.get('name') if request.body else None

    # Validate input
    if not name:
        return Response(
            code=400,
            errors=[APIError(code=400, message="Name parameter is required")]
        )

    # Generate greeting message
    greeting_message = f"Hello {name}! Welcome to the Foundry Cloud Functions demo!"

    # Return successful response
    return Response(
        body={
            'message': greeting_message,
            'name': name,
            'timestamp': '2024-01-01T00:00:00Z',  # In real app, use datetime.utcnow().isoformat()
            'demo': True
        },
        code=200
    )


if __name__ == "__main__":
    FUNC.run()