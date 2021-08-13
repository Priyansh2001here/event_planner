# import os
#
# from channels.auth import AuthMiddlewareStack
# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.core.asgi import get_asgi_application
# import chatapp.routing
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "event_planner.settings")
#
# application = ProtocolTypeRouter({
#   "http": get_asgi_application(),
#   "websocket": AuthMiddlewareStack(
#         URLRouter(
#             chatapp.routing.websocket_urlpatterns
#         )
#     ),
# })

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_planner.settings')

application = get_asgi_application()