from social_core.pipeline.user import create_user

def social_auth_create_user(strategy, details, backend, user=None, *args, **kwargs):
    # If the user already exists, return the user
    if user:
        return {'user': user}

    # If the user does not exist, create a new user
    user = create_user(strategy, details, backend, user=None, *args, **kwargs)

    # Your custom logic for user creation can go here
    # For example, you might set additional user attributes or roles

    return {'user': user}