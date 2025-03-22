from rest_framework import serializers
from .models import Farmer, Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'quantity', 'unit', 'created_at', 'updated_at']

class FarmerSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = Farmer
        fields = ['id', 'name', 'location', 'phone', 'email', 'created_at', 'products'] 