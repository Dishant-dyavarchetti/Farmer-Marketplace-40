from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from accounts.models import Product

def product_details(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    data = {
        "id": product.id,
        "name": product.name,
        "farmer_name": product.farmer.user.get_full_name(),
        "price": product.price,
        "description": product.description,
        "category": product.category.name if product.category else "Uncategorized",
        "image_url": product.image.url if product.image else None,
        "farm_location": product.farmer.farm_location or "Local farm",
        "unit": product.unit,
        "package_size": product.package_size,
        "is_organic": product.farmer.is_verified,
        "qr_code_url": product.qr_code.url if product.qr_code else None,
    }
    return JsonResponse(data)   

def qr(request):
    return render(request, "index.html")

def product_page(request, product_id):
    return render(request, "product.html", {"product_id": product_id})