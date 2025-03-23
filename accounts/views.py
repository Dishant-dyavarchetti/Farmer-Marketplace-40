from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Farmer, Consumer
from .serializers import FarmerSerializer, ConsumerSerializer, LoginSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class RegisterFarmerView(generics.CreateAPIView):
    serializer_class = FarmerSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        logger.info(f"RegisterFarmerView received data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response({
                'error': 'Registration failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.exception("Error creating farmer")
            return Response({
                'error': 'Registration failed',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterConsumerView(generics.CreateAPIView):
    serializer_class = ConsumerSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        logger.info(f"RegisterConsumerView received data: {request.data}")
        print(f"CONSUMER REGISTRATION DATA: {request.data}")  # Print to console for easier debugging
        
        # Check if any fields are missing in the request data
        required_fields = ['user', 'password', 'phone_number']
        for field in required_fields:
            if field not in request.data:
                return Response({
                    'error': f'Missing required field: {field}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if nested user fields are present
        if 'user' in request.data:
            user_data = request.data['user']
            user_required_fields = ['username', 'email']
            for field in user_required_fields:
                if field not in user_data:
                    return Response({
                        'error': f'Missing required user field: {field}'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            print(f"SERIALIZER ERRORS: {serializer.errors}")  # Print to console for easier debugging
            return Response({
                'error': 'Registration failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.exception("Error creating consumer")
            print(f"CONSUMER CREATION ERROR: {str(e)}")  # Print to console for easier debugging
            return Response({
                'error': 'Registration failed',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user_type = serializer.validated_data['user_type']
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if user is of the correct type
        if user_type == 'farmer':
            try:
                farmer = Farmer.objects.get(user=user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': 'farmer',
                    'is_verified': farmer.is_verified,
                    'farm_location': farmer.farm_location,
                    'origin_state': farmer.origin_state
                })
            except Farmer.DoesNotExist:
                return Response({
                    'error': 'User is not registered as a farmer'
                }, status=status.HTTP_403_FORBIDDEN)
        else:  # consumer
            try:
                consumer = Consumer.objects.get(user=user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': 'consumer'
                })
            except Consumer.DoesNotExist:
                return Response({
                    'error': 'User is not registered as a consumer'
                }, status=status.HTTP_403_FORBIDDEN)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Delete the user's token
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            farmer = Farmer.objects.get(user=user)
            serializer = FarmerSerializer(farmer)
            user_type = 'farmer'
        except Farmer.DoesNotExist:
            try:
                consumer = Consumer.objects.get(user=user)
                serializer = ConsumerSerializer(consumer)
                user_type = 'consumer'
            except Consumer.DoesNotExist:
                return Response({
                    'error': 'User profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        data = serializer.data
        data['user_type'] = user_type
        return Response(data)
