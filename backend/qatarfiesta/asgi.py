import os

from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.channels_middleware import JWTWebsocketMiddleware
from chat import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qatarfiesta.settings')

application = ProtocolTypeRouter({
    "http":django_asgi_app,
    "websocket":JWTWebsocketMiddleware(AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))),
})
