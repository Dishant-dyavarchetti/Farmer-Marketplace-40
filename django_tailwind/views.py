from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth.models import User, Group
from django.db.models import Sum, Count, Q
from django.utils import timezone
from accounts.models import (
    Farmer, Consumer, FarmerVerification, SupportingDocument,
    Category, Product, Order, OrderItem, OrderStatusHistory
)
import os
from datetime import timedelta

def home(request):
    return render(request, 'homepage.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            auth_login(request, user)
            
            # Redirect based on user type
            if is_admin_or_verifier(user):
                return redirect('admin_dashboard')
            elif is_farmer(user):
                return redirect('farmer_dashboard')
            else:
                return redirect('home')  # Consumer or other user type
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'login.html')

def register(request):
    if request.method == 'POST':
        # Process registration form
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        user_type = request.POST.get('user_type')
        
        # Validate form data
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, 'register.html')
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'register.html')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return render(request, 'register.html')
        
        try:
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Assign user to appropriate group
            if user_type == 'farmer':
                farmer_group, _ = Group.objects.get_or_create(name='Farmers')
                user.groups.add(farmer_group)
                # Create farmer profile
                Farmer.objects.create(
                    user=user,
                    is_verified=False,
                )
            else:
                consumer_group, _ = Group.objects.get_or_create(name='Consumers')
                user.groups.add(consumer_group)
                # Create consumer profile
                Consumer.objects.create(
                    user=user,
                )
            
            # Log the user in
            auth_login(request, user)
            
            # Redirect to appropriate dashboard
            if user_type == 'farmer':
                return redirect('farmer_dashboard')
            else:
                return redirect('home')
                
        except Exception as e:
            messages.error(request, f'Error creating user: {str(e)}')
    
    return render(request, 'register.html')

def about(request):
    return render(request, 'about.html')

# User logout view
def user_logout(request):
    """
    Logs out the current user and redirects to the login page.
    """
    logout(request)
    messages.success(request, "You have been successfully logged out.")
    return redirect('login')

# Admin authentication function
def is_admin_or_verifier(user):
    return user.is_authenticated and (user.is_staff or user.groups.filter(name='Verifiers').exists())

# Farmer authentication function
def is_farmer(user):
    return user.is_authenticated and user.groups.filter(name='Farmers').exists()

# Admin login view
def admin_login(request):
    if request.user.is_authenticated:
        if is_admin_or_verifier(request.user):
            return redirect('admin_dashboard')
        else:
            # User is logged in but not an admin/verifier
            logout(request)
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None and is_admin_or_verifier(user):
            auth_login(request, user)
            return redirect('admin_dashboard')
        else:
            # Authentication failed or user is not an admin/verifier
            error_message = "Invalid credentials or insufficient permissions."
            return render(request, 'admin_login.html', {'error_message': error_message})
    
    return render(request, 'admin_login.html')

# Admin logout view
def admin_logout(request):
    logout(request)
    return redirect('admin_login')

# Create admin user view
@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def create_admin_user(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        user_role = request.POST.get('user_role')
        
        # Validate form data
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return redirect('manage_users')
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return redirect('manage_users')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return redirect('manage_users')
        
        try:
            # Create new user
            new_user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Set staff status for both admin and verifier roles
            new_user.is_staff = True
            
            # For admin role, also set is_superuser
            if user_role == 'admin':
                new_user.is_superuser = True
            else:
                # For verifier role, add to verifier group
                verifier_group, created = Group.objects.get_or_create(name='Verifiers')
                new_user.groups.add(verifier_group)
            
            new_user.save()
            
            messages.success(request, f'User {username} created successfully as {user_role}.')
            return redirect('manage_users')
        
        except Exception as e:
            messages.error(request, f'Error creating user: {str(e)}')
    
    return redirect('manage_users')

# Secure admin views
@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def admin_dashboard(request):
    # Get counts for dashboard statistics
    farmers_count = Farmer.objects.count()
    pending_verifications = FarmerVerification.objects.filter(status='pending').count()
    pending_products = Product.objects.filter(status='pending').count()
    recent_orders = Order.objects.order_by('-created_at')[:5]
    
    context = {
        'farmers_count': farmers_count,
        'pending_verifications': pending_verifications,
        'pending_products': pending_products,
        'recent_orders': recent_orders,
    }
    
    return render(request, 'admin_dashboard.html', context)

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def farmer_verification(request):
    # Get pending farmer verifications
    pending_verifications = FarmerVerification.objects.filter(status='pending').order_by('-submission_date')
    approved_verifications = FarmerVerification.objects.filter(status='approved').order_by('-reviewed_at')
    rejected_verifications = FarmerVerification.objects.filter(status='rejected').order_by('-reviewed_at')
    
    context = {
        'pending_verifications': pending_verifications,
        'approved_verifications': approved_verifications,
        'rejected_verifications': rejected_verifications,
    }
    
    return render(request, 'farmer_verification.html', context)

@login_required
@user_passes_test(is_admin_or_verifier)
def review_verification(request, verification_id):
    verification = get_object_or_404(FarmerVerification, id=verification_id)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        notes = request.POST.get('notes', '')
        
        if action == 'approve':
            verification.status = 'approved'
            verification.rejection_reason = ''
            # Update the farmer's verification status
            verification.farmer.verification_status = 'verified'
            verification.farmer.save()
        elif action == 'reject':
            verification.status = 'rejected'
            verification.rejection_reason = notes
        
        verification.reviewed_by = request.user
        verification.reviewed_at = timezone.now()
        verification.save()
        
        messages.success(request, f"Verification {verification.status} successfully.")
        return redirect('farmer_verification')
    
    # For GET requests, show the verification details
    supporting_docs = SupportingDocument.objects.filter(verification=verification)
    
    context = {
        'verification': verification,
        'supporting_docs': supporting_docs,
    }
    return render(request, 'admin/review_verification.html', context)

@login_required
@user_passes_test(is_admin_or_verifier)
def review_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        notes = request.POST.get('notes', '')
        
        if action == 'approve':
            product.status = 'approved'
            message = "Product approved successfully."
        elif action == 'reject':
            product.status = 'rejected'
            # Store rejection reason in description (could add a dedicated field)
            product.description += f"\n\nRejection reason: {notes}"
            message = "Product rejected successfully."
        
        product.save()
        messages.success(request, message)
        return redirect('product_approval')
    
    context = {
        'product': product,
        'farmer': product.farmer,
    }
    return render(request, 'admin/review_product.html', context)

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def product_approval(request):
    # Get pending products
    pending_products = Product.objects.filter(status='pending').order_by('-created_at')
    approved_products = Product.objects.filter(status='active').order_by('-updated_at')
    rejected_products = Product.objects.filter(status='rejected').order_by('-updated_at')
    
    context = {
        'pending_products': pending_products,
        'approved_products': approved_products,
        'rejected_products': rejected_products,
    }
    
    return render(request, 'product_approval.html', context)

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def manage_users(request):
    # Get users by type
    admin_users = User.objects.filter(Q(is_staff=True) | Q(is_superuser=True)).order_by('-date_joined')
    farmer_users = Farmer.objects.all().order_by('-date_joined')
    consumer_users = Consumer.objects.all().order_by('-user__date_joined')
    
    context = {
        'admin_users': admin_users,
        'farmer_users': farmer_users,
        'consumer_users': consumer_users,
    }
    
    return render(request, 'manage_users.html', context)

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def order_management(request):
    # Get orders by status
    pending_orders = Order.objects.filter(status='pending').order_by('-created_at')
    processing_orders = Order.objects.filter(status='processing').order_by('-created_at')
    shipped_orders = Order.objects.filter(status='shipped').order_by('-created_at')
    delivered_orders = Order.objects.filter(status='delivered').order_by('-created_at')
    cancelled_orders = Order.objects.filter(status='cancelled').order_by('-created_at')
    
    context = {
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'shipped_orders': shipped_orders,
        'delivered_orders': delivered_orders,
        'cancelled_orders': cancelled_orders,
    }
    
    return render(request, 'order_management.html', context)

# Farmer Portal Views
@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def farmer_dashboard(request):
    """
    Farmer dashboard view - displays overview, verification status, and recent orders
    """
    try:
        # Get the farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get verification status
        verification = None
        farmer_verified = False
        latest_verification = FarmerVerification.objects.filter(
            farmer=farmer
        ).order_by('-submission_date').first()
        
        if latest_verification:
            verification = latest_verification
            farmer_verified = True
        
        # Get order statistics
        total_orders = Order.objects.filter(
            orderitem__product__farmer=farmer
        ).distinct().count()
        
        pending_orders = Order.objects.filter(
            orderitem__product__farmer=farmer,
            status__in=['pending', 'processing']
        ).distinct().count()
        
        total_sales = OrderItem.objects.filter(
            product__farmer=farmer,
            order__status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('price'))['total'] or 0
        
        # Get recent orders
        recent_orders = Order.objects.filter(
            orderitem__product__farmer=farmer
        ).distinct().order_by('-created_at')[:5]
        
        context = {
            'farmer': farmer,
            'verification': verification,
            'farmer_verified': farmer_verified,
            'verification_status': farmer.verification_status,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_sales': total_sales,
            'recent_orders': recent_orders
        }
        
        return render(request, 'farmer_dashboard.html', context)
        
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one
        farmer = Farmer.objects.create(
            user=request.user,
            verification_status='unverified'
        )
        context = {
            'farmer': farmer,
            'farmer_verified': False,
            'verification_status': 'unverified',
            'total_orders': 0,
            'pending_orders': 0,
            'total_sales': 0,
            'recent_orders': []
        }
        
        return render(request, 'farmer_dashboard.html', context)

@login_required(login_url='/login/')
def farmer_verification_status(request):
    """
    Display verification status and details for a farmer
    """
    try:
        # Get the farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get the latest verification record
        verification = FarmerVerification.objects.filter(
            farmer=farmer
        ).order_by('-submission_date').first()
        
        # Get supporting documents if verification exists
        supporting_documents = []
        if verification:
            supporting_documents = SupportingDocument.objects.filter(
                verification=verification
            )
        
        context = {
            'farmer': farmer,
            'verification': verification,
            'supporting_documents': supporting_documents,
            'verification_status': farmer.verification_status,
            'submission_date': verification.submission_date if verification else None,
            'certification_type': verification.certification_type if verification else None,
            'certification_id': verification.certification_id if verification else None,
            'valid_until': verification.valid_until if verification else None,
            'farm_description': verification.farm_description if verification else None,
            'rejection_reason': verification.rejection_reason if verification and verification.status == 'rejected' else None,
        }
        
        return render(request, 'farmer_verification_status.html', context)
    
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one and redirect to dashboard
        farmer = Farmer.objects.create(
            user=request.user,
            verification_status='unverified'
        )
        return redirect('farmer_dashboard')

@login_required(login_url='/login/')
def farmer_product_management(request):
    """
    Display and manage products for a farmer
    """
    try:
        # Get the farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get all products for this farmer
        products = Product.objects.filter(farmer=farmer).order_by('-created_at')
        
        # Calculate product statistics
        total_products = products.count()
        active_products = products.filter(status='approved').count()
        pending_products = products.filter(status='pending').count()
        draft_products = products.filter(status='draft').count()
        
        # Get all categories for the dropdown
        categories = Category.objects.all()
        
        context = {
            'farmer': farmer,
            'products': products,
            'total_products': total_products,
            'active_products': active_products,
            'pending_products': pending_products,
            'draft_products': draft_products,
            'categories': categories,
            'verification_status': farmer.verification_status
        }
        
        return render(request, 'farmer_product_management.html', context)
        
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one and redirect
        farmer = Farmer.objects.create(
            user=request.user,
            verification_status='unverified'
        )
        return redirect('farmer_dashboard')

@login_required(login_url='/login/')
def farmer_orders(request):
    """
    Display and manage orders for a farmer
    """
    try:
        # Get the farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get all orders for this farmer's products
        orders = Order.objects.filter(
            orderitem__product__farmer=farmer
        ).distinct().order_by('-created_at')
        
        # Apply filters if provided
        status_filter = request.GET.get('status')
        if status_filter and status_filter != 'all':
            orders = orders.filter(status=status_filter)
            
        date_range = request.GET.get('date_range')
        if date_range:
            today = timezone.now().date()
            if date_range == 'today':
                orders = orders.filter(created_at__date=today)
            elif date_range == 'week':
                week_ago = today - timedelta(days=7)
                orders = orders.filter(created_at__date__gte=week_ago)
            elif date_range == 'month':
                month_ago = today - timedelta(days=30)
                orders = orders.filter(created_at__date__gte=month_ago)
            elif date_range == 'year':
                year_ago = today - timedelta(days=365)
                orders = orders.filter(created_at__date__gte=year_ago)
                
        search_query = request.GET.get('search')
        if search_query:
            orders = orders.filter(
                Q(order_id__icontains=search_query) | 
                Q(consumer__user__first_name__icontains=search_query) |
                Q(consumer__user__last_name__icontains=search_query)
            )
        
        # Calculate order statistics
        total_orders = Order.objects.filter(
            orderitem__product__farmer=farmer
        ).distinct().count()
        
        pending_orders = Order.objects.filter(
            orderitem__product__farmer=farmer,
            status__in=['pending', 'processing']
        ).distinct().count()
        
        # Calculate total revenue from completed orders
        total_revenue = OrderItem.objects.filter(
            product__farmer=farmer,
            order__status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('price'))['total'] or 0
        
        # Calculate average order value
        avg_order_value = 0
        if total_orders > 0:
            avg_order_value = total_revenue / total_orders
        
        context = {
            'farmer': farmer,
            'orders': orders,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_revenue': total_revenue,
            'avg_order_value': avg_order_value,
            'status_filter': status_filter,
            'date_range': date_range,
            'search_query': search_query
        }
        
        return render(request, 'farmer_orders.html', context)
        
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one and redirect
        farmer = Farmer.objects.create(
            user=request.user,
            verification_status='unverified'
        )
        return redirect('farmer_dashboard')

@login_required(login_url='/login/')
def submit_verification(request):
    """
    Handle farmer verification document submission
    """
    if request.method == 'POST':
        try:
            # Get the farmer profile
            farmer = Farmer.objects.get(user=request.user)
            
            # Create a new verification entry
            verification = FarmerVerification(
                farmer=farmer,
                certification_type=request.POST.get('certification_type'),
                certification_id=request.POST.get('certification_id'),
                valid_until=request.POST.get('valid_until'),
                farm_description=request.POST.get('farm_description'),
                certificate_document=request.FILES.get('certificate_document'),
                submission_date=timezone.now(),
                status='pending'
            )
            verification.save()
            
            # Process supporting documents if provided
            if 'supporting_documents' in request.FILES:
                for doc in request.FILES.getlist('supporting_documents'):
                    supporting_doc = SupportingDocument(
                        verification=verification,
                        document=doc,
                        document_type="Supporting Document"
                    )
                    supporting_doc.save()
            
            # Update farmer verification status
            farmer.verification_status = 'pending'
            farmer.save()
            
            messages.success(request, "Your verification documents have been submitted successfully and are under review.")
            return redirect('farmer_verification_status')
            
        except Exception as e:
            messages.error(request, f"Error submitting verification: {str(e)}")
            return redirect('farmer_dashboard')
    
    # If not POST, redirect to dashboard
    return redirect('farmer_dashboard')

@login_required(login_url='/login/')
def save_product(request):
    """
    Handle product creation or update
    """
    if request.method == 'POST':
        try:
            # Get the farmer profile
            farmer = Farmer.objects.get(user=request.user)
            
            # Get form data
            product_id = request.POST.get('product_id')
            product_name = request.POST.get('product_name')
            category_name = request.POST.get('category')
            description = request.POST.get('description')
            unit = request.POST.get('unit')
            price = request.POST.get('price')
            package_size = request.POST.get('package_size')
            stock = request.POST.get('stock')
            status = request.POST.get('status')
            
            # Get or create category
            category, created = Category.objects.get_or_create(name=category_name)
            
            # Create or update product
            if product_id:
                # Update existing product
                product = get_object_or_404(Product, id=product_id, farmer=farmer)
                product.name = product_name
                product.category = category
                product.description = description
                product.unit = unit
                product.price = price
                product.package_size = package_size
                product.stock = stock
                product.status = status
                
                # Update image only if a new one is provided
                if 'product_image' in request.FILES:
                    product.image = request.FILES.get('product_image')
            else:
                # Create new product
                product = Product(
                    farmer=farmer,
                    name=product_name,
                    category=category,
                    description=description,
                    unit=unit,
                    price=price,
                    package_size=package_size,
                    stock=stock,
                    status=status
                )
                
                # Add image if provided
                if 'product_image' in request.FILES:
                    product.image = request.FILES.get('product_image')
            
            product.save()
            
            messages.success(request, f"Product '{product_name}' has been saved successfully.")
            
        except Exception as e:
            messages.error(request, f"Error saving product: {str(e)}")
    
    return redirect('farmer_product_management')

# API endpoints for AJAX actions
@login_required(login_url='/login/')
def delete_product(request):
    """
    Handle product deletion via AJAX
    """
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product_id')
            farmer = Farmer.objects.get(user=request.user)
            product = get_object_or_404(Product, id=product_id, farmer=farmer)
            
            product_name = product.name
            product.delete()
            
            return JsonResponse({
                'success': True,
                'message': f"Product '{product_name}' has been deleted successfully."
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f"Error deleting product: {str(e)}"
            })
    
    return JsonResponse({
        'success': False,
        'message': "Invalid request method."
    })

@login_required(login_url='/login/')
def update_order_status(request):
    """
    Handle order status updates via AJAX
    """
    if request.method == 'POST':
        try:
            order_id = request.POST.get('order_id')
            new_status = request.POST.get('status')
            
            # Get the farmer's orders
            farmer = Farmer.objects.get(user=request.user)
            
            # Find the order that contains products from this farmer
            # Note: this assumes an order can have products from multiple farmers
            # and we're only updating the status for items from this farmer
            order = Order.objects.filter(
                id=order_id,
                orderitem__product__farmer=farmer
            ).distinct().first()
            
            if not order:
                return JsonResponse({
                    'success': False,
                    'message': "Order not found or you don't have permission to update it."
                })
            
            # Validate the status
            valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
            if new_status not in valid_statuses:
                return JsonResponse({
                    'success': False,
                    'message': "Invalid status."
                })
            
            # Update order status
            order.status = new_status
            order.save()
            
            # Create status history record
            OrderStatusHistory.objects.create(
                order=order,
                status=new_status,
                created_by=request.user,
                created_at=timezone.now()
            )
            
            return JsonResponse({
                'success': True,
                'message': f"Order status updated to {new_status.title()} successfully."
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f"Error updating order status: {str(e)}"
            })
    
    return JsonResponse({
        'success': False,
        'message': "Invalid request method."
    })

def marketplace(request):
    """
    View for marketplace homepage that displays categories and featured products
    """
    # Get featured products
    try:
        featured_products = Product.objects.filter(status='approved').order_by('-created_at')[:8]
        # Get all categories
        categories = Category.objects.all()[:8]
        
        context = {
            'featured_products': featured_products,
            'categories': categories,
        }
    except:
        # Handle case where models might not be loaded yet
        context = {}
        
    return render(request, 'marketplace.html', context)










