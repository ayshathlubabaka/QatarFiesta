from django.urls import path
from .views import  *

urlpatterns = [
    path('event/', EventAPI.as_view()),
    path('event-change/<int:event_id>/', ChangeEventAPI.as_view()),
]