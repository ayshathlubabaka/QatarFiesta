from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed

from .serializers import *
from accounts.emails import send_otp_via_email, send_reset_password_email

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import *
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.urls import reverse
from django.http import HttpResponsePermanentRedirect

import os
import jwt,datetime


class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes = [os.environ.get('APP_SCHEME'), 'http', 'https']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.name
        token['email'] = user.email

        print('token', token)

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserRegisterAPI(APIView):

    def post(self, request):
        try:
            data = request.data
            serializer = UserRegisterSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                send_otp_via_email(serializer.data['email'])
                
                return Response({'message': 'Registration successful. Check your email for OTP.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'errors': 'Email already exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class VerifyOTP(APIView):

    def post(self, request):
        try:
            data = request.data
            serializer = VerifyAccountSerializer(data = data)
            if serializer.is_valid():
                email = serializer.data['email']
                otp = serializer.data['otp']

                user = User.objects.filter(email=email)
                if not user.exists():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                user = user.first()
                if user.otp != otp:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                user.is_registered = True
                user.is_active = True
                user.save()

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# class UserLoginAPI(APIView):

#     def post(self, request):
#         email = request.data['email']
#         password = request.data['password']

#         user = User.objects.filter(email=email, is_registered = True, is_active = True, is_organizer = False).first()

#         if user is None:
#             raise AuthenticationFailed('User not found')
        
#         if not user.check_password(password):
#             raise AuthenticationFailed('Incorrect Password')
        
#         refresh_token = RefreshToken.for_user(user)
#         access_token = str(refresh_token.access_token)
#         print('refresh_token', refresh_token)
#         print('access_token', access_token)

#         response =  Response()
#         response.set_cookie(key='refresh_token', value=refresh_token, httponly=True )
#         response.data = {
#             'access_token':access_token,
#         }
#         return response
    
class UserViewAPI(APIView):
    def get(self, request):
        user = request.user
        print("inside user view")
        if user:
            serializer = UserSerializer(user)
            data = serializer.data
            return Response(data)
        else:
            return Response({"detail": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
    
class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data['email']
        print(email)
    
        try:
            user = User.objects.get(email=email)
            print(user.name)
        except User.DoesNotExist:
            print('user not found')
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ForgotPasswordSerializer(data=request.data)
        print(serializer.is_valid)
        if serializer.is_valid():
            print('valid')
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = settings.REDIRECT_URL
            reset_url = 'http://'+current_site + relativeLink
            send_reset_password_email(email=email, reset_url=reset_url, redirect_url=redirect_url)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordTokenCheckAPI(APIView):
    def get(self, request, uidb64, token):
        redirect_url = settings.REDIRECT_URL
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except(TypeError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            print(token, uidb64)
            return HttpResponsePermanentRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class SetNewPasswordAPIView(APIView):

    def patch(self, request):
        try:
            data = request.data
            serializer = SetNewPasswordSerializer(data=data)
            print('inside try-block')
            if serializer.is_valid():
                print('valid set password serializer')
                return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)

        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        
        print(serializer.errors)

        return Response({'success': False, 'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    

    
class UserLogoutAPI(APIView):
    
    def post(self,request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message' : 'success'
        }
        return response

class OrganizerRegisterAPI(APIView):

    def post(self, request):
        try:
            data = request.data
            serializer = OrganizerRegisterSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                send_otp_via_email(serializer.data['email'])
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class OrganizerLoginAPI(APIView):

    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email, is_registered = True, is_active = True, is_organizer = True).first()

        if user is None:
            raise AuthenticationFailed('User not found')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        payload = {
            'id' : user.id,
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat' : datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        
        response =  Response()
        response.set_cookie(key='jwt', value=token, httponly=True )
        response.data = {
            'jwt':token
        }
        return response
    
    
# class AdminLoginAPI(APIView):

#     def post(self, request):
#         email = request.data['email']
#         password = request.data['password']

#         user = User.objects.filter(email=email, is_superuser = True).first()

#         if user is None:
#             raise AuthenticationFailed('User not found')
        
#         if not user.check_password(password):
#             raise AuthenticationFailed('Incorrect Password')
        
#         payload = {
#             'id' : user.id,
#             'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
#             'iat' : datetime.datetime.utcnow()
#         }

#         token = jwt.encode(payload, 'secret', algorithm='HS256')
        
#         response =  Response()
#         response.set_cookie(key='jwt', value=token, httponly=True )
#         response.data = {
#             'jwt':token
#         }
#         return response
    
class AdminViewAPI(APIView):

    def get(self, request):
        user = request.user
        if user:
            print("inside admin view")
            print("user name is ",user.name)
            serializer = AdminSerializer(user)
            data = serializer.data
            return Response(data)
        else:
            return Response({"detail": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

    
class OrganizerViewAPI(APIView):

    def get(self, request):
        user = request.user
        if user:
            serializer = OrganizerSerializer(user)
            data = serializer.data
            return Response(data)
        else:
            return Response({"detail": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
    
# class OrganizerLogoutAPI(APIView):
    
#     def post(self,request):
#         response = Response()
#         response.delete_cookie('jwt')
#         response.data = {
#             'message' : 'success'
#         }
#         return response
        

class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.filter(is_organizer = False, is_superuser = False)
        serializer = UserSerializer(users, many = True)
        return Response(serializer.data)
    
class OrganizerListAPI(APIView):
    def get(self, request):
        users = User.objects.filter(is_organizer = True, is_superuser = False)
        serializer = UserSerializer(users, many = True)
        return Response(serializer.data)
    
class UserOrganizerBlockAPI(APIView):
    # permission_classes = [IsAuthenticated]\

    def patch(self, request, user_id):
            return self.toggle_block_status(user_id, block=True)

    def put(self, request, user_id):
        return self.toggle_block_status(user_id, block=False)

    def toggle_block_status(self, user_id, block):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.is_active = not block
        user.save()

        status_message = 'User blocked' if block else 'User unblocked'
        return Response({'message': f'{status_message} successfully'}, status=status.HTTP_200_OK)