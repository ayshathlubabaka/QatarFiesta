from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import *
from myadmin.models import Category
from organizer.models import Events

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404



class CategoryAPI(APIView):
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many = True)
        return Response(serializer.data)

    def post(self, request):
        try:
            data = request.data
            serializer = CategoryCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CategoryChangeAPI(APIView):
    
    def put(self, request, category_id):
        print(category_id)
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = CategoryCreateSerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class TicketTypeAPI(APIView):

    def get(self, request):
        ticketTypes = TicketType.objects.all()
        serializer = TicketTypeSerializer(ticketTypes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            data = request.data
            serializer = CreateTicketTypeSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangeTicketTypeAPI(APIView):
    def put(self, request, ticketType_id):
        print(ticketType_id)
        try:
            ticketType = TicketType.objects.get(id=ticketType_id)
        except TicketType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = CreateTicketTypeSerializer(ticketType, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, ticketType_id):
        try:
            ticketType = TicketType.objects.get(id=ticketType_id)
        except TicketType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        ticketType.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AgeGroupAPI(APIView):

    def get(self, request):
        ageGroups = AgeGroup.objects.all()
        serializer = AgeGroupSerializer(ageGroups, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            data = request.data
            serializer = CreateAgeGroupSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangeAgeGroupAPI(APIView):
    def put(self, request, ageGroup_id):
        print(ageGroup_id)
        try:
            ageGroup = AgeGroup.objects.get(id=ageGroup_id)
        except AgeGroup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = CreateAgeGroupSerializer(ageGroup, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, ageGroup_id):
        try:
            ageGroup = AgeGroup.objects.get(id=ageGroup_id)
        except AgeGroup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        ageGroup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ApproveEventAPI(APIView):
    def put(self, request, event_request_id):
        try:
            event_request = Events.objects.get(id=event_request_id)
            event_request.is_active = True
            event_request.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class RejectEventAPI(APIView):
    def put(self, request, event_request_id):
        try:
            event_request = Events.objects.get(id=event_request_id)
            event_request.is_active = False
            event_request.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)



