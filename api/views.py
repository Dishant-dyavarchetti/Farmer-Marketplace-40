from django.shortcuts import render
from rest_framework import viewsets
from .models import Farmer, Product
from .serializers import FarmerSerializer, ProductSerializer

# Create your views here.

class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        farmer_id = self.request.query_params.get('farmer_id')
        if farmer_id is not None:
            queryset = queryset.filter(farmer_id=farmer_id)
        return queryset
