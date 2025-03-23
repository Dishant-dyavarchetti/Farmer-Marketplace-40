from django.shortcuts import render, redirect, get_object_or_404
from qr.models import Product, Category
from django.contrib import messages
from qr.utils import generate_qr_code
from django.conf import settings

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
                
            # Save product to get an ID
            product.save()
            
            # Generate QR code for the product
            try:
                # Get the base URL from settings or use a default
                base_url = getattr(settings, 'BASE_URL', request.build_absolute_uri('/').rstrip('/'))
                
                # Generate the QR code
                qr_code = generate_qr_code(product.id, base_url)
                
                # Save the QR code to the product
                product.qr_code.save(f"qr_code_{product.id}.png", qr_code, save=True)
            except Exception as e:
                # Log the error but don't prevent product creation
                print(f"Error generating QR code: {str(e)}")
            
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

def edit_product(request, product_id):
    """View to edit an existing product"""
    # Get the product or return 404 if not found
    product = get_object_or_404(Product, id=product_id)
    categories = Category.objects.all()
    
    if request.method == 'POST':
        try:
            # Get form data
            product.name = request.POST.get('name')
            product.description = request.POST.get('description')
            product.price = request.POST.get('price')
            category_id = request.POST.get('category')
            product.farmer_name = request.POST.get('farmer_name')
            
            # Get category
            product.category = Category.objects.get(id=category_id)
            
            # Handle image if a new one is uploaded
            if 'image' in request.FILES:
                product.image = request.FILES['image']
                
            # Save updated product
            product.save()
            
            # Regenerate QR code if it doesn't exist
            if not product.qr_code:
                try:
                    # Get the base URL from settings or use a default
                    base_url = getattr(settings, 'BASE_URL', request.build_absolute_uri('/').rstrip('/'))
                    
                    # Generate the QR code
                    qr_code = generate_qr_code(product.id, base_url)
                    
                    # Save the QR code to the product
                    product.qr_code.save(f"qr_code_{product.id}.png", qr_code, save=True)
                except Exception as e:
                    # Log the error but don't prevent product update
                    print(f"Error generating QR code: {str(e)}")
            
            messages.success(request, 'Product updated successfully!')
            return redirect('product_list')
        except Exception as e:
            messages.error(request, f'Error updating product: {str(e)}')
    
    # Render the edit form with the product data
    return render(request, "edit_product.html", {
        'product': product,
        'categories': categories
    })

def delete_product(request, product_id):
    """View to delete a product"""
    # Get the product or return 404 if not found
    product = get_object_or_404(Product, id=product_id)
    
    try:
        # Get the product name before deletion for the success message
        product_name = product.name
        
        # Delete the product
        product.delete()
        
        # Show success message
        messages.success(request, f'Product "{product_name}" has been deleted successfully!')
    except Exception as e:
        # Show error message if deletion fails
        messages.error(request, f'Error deleting product: {str(e)}')
    
    # Redirect to the product list page
    return redirect('product_list')
