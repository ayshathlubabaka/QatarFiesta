from django.urls import path
from .views import  *


urlpatterns = [
    path('category/', CategoryAPI.as_view()),
    path('category-change/<int:category_id>/', CategoryChangeAPI.as_view()),
    path('ticketType/', TicketTypeAPI.as_view()),
    path('ticketType-change/<int:ticketType_id>/', ChangeTicketTypeAPI.as_view()),
    path('ageGroup/', AgeGroupAPI.as_view()),
    path('ageGroup-change/<int:ageGroup_id>/', ChangeAgeGroupAPI.as_view()),
    path('approve-event-request/<int:event_request_id>/', ApproveEventAPI.as_view()),
    path('reject-event-request/<int:event_request_id>/', RejectEventAPI.as_view()),
]