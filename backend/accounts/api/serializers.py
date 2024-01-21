from rest_framework import serializers
from accounts.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.exceptions import AuthenticationFailed

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'is_registered', 'is_active')

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'is_registered', 'is_organizer')

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'is_registered', 'is_active', 'is_superuser')

class UserRegisterSerializer(serializers.ModelSerializer):
   
    password = serializers.CharField(min_length=6, write_only=True)  
    password2 = serializers.CharField(min_length=6, write_only=True)  

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'password2')  
    
    # def validate(self, attrs):
    #     return super().validate(attrs)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            print('User with this email already exists.')
            raise serializers.ValidationError('User with this email already exists.')
        return value

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            name=validated_data['name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class VerifyAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()

class OrganizerRegisterSerializer(serializers.ModelSerializer):
   
    password2 = serializers.CharField(read_only=True)  

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'password2') 


    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            name=validated_data['name'],
            is_organizer = True
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class ForgotPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        model = User
        fields = ['email', 'redirect_url']

class SetNewPasswordSerializer(serializers.Serializer):

    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)
   

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            print(password)
            token = attrs.get('token')
            print(token)
            uidb64 = attrs.get('uidb64')
            print(uidb64)

            id = force_str(urlsafe_base64_decode(uidb64))

            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)
            
            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)
        

 

    