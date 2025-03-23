from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Farmer, Consumer

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class FarmerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = Farmer
        fields = ('id', 'user', 'password', 'phone_number', 'address', 
                  'farm_location', 'origin_state', 'is_verified', 'verification_document')
        read_only_fields = ('id', 'is_verified')
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')
        
        # Create the User instance
        user = User.objects.create(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', '')
        )
        user.set_password(password)
        user.save()
        
        # Create the Farmer instance
        farmer = Farmer.objects.create(user=user, **validated_data)
        return farmer

class ConsumerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = Consumer
        fields = ('id', 'user', 'password', 'phone_number', 'preferred_delivery_time')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')
        
        # Create the User instance
        user = User.objects.create(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', '')
        )
        user.set_password(password)
        user.save()
        
        # Create the Consumer instance
        consumer = Consumer.objects.create(user=user, **validated_data)
        return consumer

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(style={'input_type': 'password'})
    user_type = serializers.ChoiceField(choices=['farmer', 'consumer']) 