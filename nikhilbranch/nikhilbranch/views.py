from django.shortcuts import render, get_object_or_404
from qr.models import Product, Category
import os
from django.conf import settings
from pathlib import Path

def marketplace(request):
    """View for the marketplace homepage"""
    # Get all categories
    categories = Category.objects.all()
    
    # Get featured products (limited to 8)
    products = Product.objects.all()[:8]
    
    # Check if hero image exists - safer approach
    hero_image_exists = False
    try:
        static_path = getattr(settings, 'STATIC_ROOT', None)
        if not static_path:
            # Try fallback to project's static folder
            static_path = Path(__file__).resolve().parent.parent / 'static'
        
        hero_image_path = os.path.join(static_path, 'images', 'hero-image.jpg')
        hero_image_exists = os.path.exists(hero_image_path)
    except Exception:
        # If any error occurs, just set to False
        hero_image_exists = False
    
    context = {
        'categories': categories,
        'products': products,
        'hero_image_exists': hero_image_exists
    }
    
    return render(request, 'marketplace.html', context)

def marketplace_product(request, product_id):
    """View for displaying the detailed marketplace product page"""
    product = get_object_or_404(Product, id=product_id)
    
    # Get related products (same category, excluding current product)
    related_products = []
    if product.category:
        related_products = Product.objects.filter(category=product.category).exclude(id=product_id)[:4]
    
    context = {
        'product': product,
        'related_products': related_products
    }
    
    return render(request, 'marketplace_product.html', context)



