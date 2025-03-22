from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Product

def product_details(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    data = {
        "name": product.name,
        "farmer_name": product.farmer_name or "Unknown",
        "price": product.price,
        "description": product.description,
        "category": product.category.name,
        "image_url": product.image.url if product.image else None,
    }
    return JsonResponse(data)   

def qr(request):
    return render(request, "index.html")

def product_page(request, product_id):
    return render(request, "product.html", {"product_id": product_id})  