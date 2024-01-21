from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import *
from organizer.models import *
from accounts.models import User
from myadmin.signals import event_request_submitted

class EventAPI(APIView):

    def get(self, request):
        events = Events.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    
    def post(self, request):

        try:
            print(request.data)
            serializer = AddEventSerializer(data=request.data)

            if serializer.is_valid():
                print('valid serializer')
                event = serializer.save()
                print('event id',event.id)
                if 'image' in request.FILES:
                    event.image=request.FILES['image']
                    event.save()
                event_request_submitted.send(sender=self.__class__, event_request=event)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print('invalid serializer')
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ChangeEventAPI(APIView):
    def put(self, request, event_id):
        print(event_id)
        try:
            event = Events.objects.get(id=event_id)
        except Events.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, event_id):
        try:
            event = Events.objects.get(id=event_id)
        except Events.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
