from django.shortcuts import render, redirect
from qr.models import Product, Category
from django.contrib import messages

# Create your views here.

def forms(request):
    categories = Category.objects.all()
    return render(request, "form2.html", {'categories': categories})

def add_product(request):
    if request.method == 'POST':
        try:
            # Get form data
            name = request.POST.get('name')
            description = request.POST.get('description')
            price = request.POST.get('price')
            category_id = request.POST.get('category')
            farmer_name = request.POST.get('farmer_name')
            
            # Get category
            category = Category.objects.get(id=category_id)
            
            # Create product object
            product = Product(
                name=name,
                description=description,
                price=price,
                category=category,
                farmer_name=farmer_name
            )
            
            # Handle image if it exists
            if 'image' in request.FILES:
                product.image = request.FILES['image']
                
            # Save product
            product.save()
            
            messages.success(request, 'Product added successfully!')
            return redirect('forms')
        except Exception as e:
            messages.error(request, f'Error adding product: {str(e)}')
            return redirect('forms')
    
    # If not POST, redirect to the form page
    return redirect('forms')

def product_list(request):
    """View to display all products in the database"""
    products = Product.objects.all()
    return render(request, "product_list.html", {'products': products})
