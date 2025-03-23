from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth.models import User, Group
from django.db.models import Sum, Count, Q, F
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from accounts.models import (
    Farmer, Consumer, FarmerVerification, SupportingDocument,
    Category, Product, Order, OrderItem, OrderStatusHistory
)
import os
from datetime import timedelta
import json
from qr.utils import generate_qr_code

def home(request):
    return render(request, 'homepage.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user_type = request.POST.get('user_type')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Check if the user type matches
            is_correct_type = False
            
            if user_type == 'farmer' and is_farmer(user):
                is_correct_type = True
            elif user_type == 'consumer' and user.groups.filter(name='Consumers').exists():
                is_correct_type = True
            elif is_admin_or_verifier(user):
                is_correct_type = True  # Admins and verifiers can log in as any type
            
            if is_correct_type:
                auth_login(request, user)
                
                # Redirect based on user type
                if is_admin_or_verifier(user):
                    return redirect('admin_dashboard')
                elif is_farmer(user):
                    return redirect('farmer_dashboard')
                else:
                    return redirect('home')  # Consumer or other user type
            else:
                messages.error(request, f'This account is not registered as a {user_type}.')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'login.html')

def register(request):
    if request.method == 'POST':
        # Process registration form
        user_type = request.POST.get('user_type')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        phone_number = request.POST.get('phone_number')
        address = request.POST.get('address')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
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
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Assign user to appropriate group
            if user_type == 'farmer':
                farm_location = request.POST.get('farm_location')
                origin_state = request.POST.get('origin_state')
                
                farmer_group, _ = Group.objects.get_or_create(name='Farmers')
                user.groups.add(farmer_group)
                
                # Create farmer profile
                Farmer.objects.create(
                    user=user,
                    phone_number=phone_number,
                    address=address,
                    farm_location=farm_location,
                    origin_state=origin_state,
                    is_verified=False,
                )
                
                messages.success(request, 'Your farmer account has been created successfully! You can now upload your certification for verification.')
            else:
                preferred_delivery_time = request.POST.get('preferred_delivery_time', 'anytime')
                
                consumer_group, _ = Group.objects.get_or_create(name='Consumers')
                user.groups.add(consumer_group)
                
                # Create consumer profile
                Consumer.objects.create(
                    user=user,
                    phone_number=phone_number,
                    shipping_address=address,
                    preferred_delivery_time=preferred_delivery_time,
                )
                
                messages.success(request, 'Your consumer account has been created successfully! You can now browse and purchase organic products.')
            
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
    """
    View for admin dashboard 
    Requires admin login
    """
    if not is_admin_or_verifier(request.user):
        return redirect('admin_login')
    
    # Fetch counts from database
    try:
        # Farmer statistics
        total_farmers = Farmer.objects.count()
        pending_verification = FarmerVerification.objects.filter(status='pending').count()
        verified_farmers = FarmerVerification.objects.filter(status='approved').count()
        
        # Product statistics
        total_products = Product.objects.count()
        pending_products = Product.objects.filter(status='pending').count()
        approved_products = Product.objects.filter(status='approved').count()
        
        # Order statistics
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        processing_orders = Order.objects.filter(status='processing').count()
        completed_orders = Order.objects.filter(status='delivered').count()
        
        # Revenue calculation
        total_revenue = Order.objects.filter(payment_status='paid').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Recent farmers for the table
        recent_farmers = Farmer.objects.all().order_by('-date_joined')[:5]
        
        # Recent orders for the table
        recent_orders = Order.objects.all().order_by('-created_at')[:5] if hasattr(Order, 'created_at') else []
        
    except Exception as e:
        # If database tables don't exist yet, use placeholders
        total_farmers = 0
        pending_verification = 0
        verified_farmers = 0
        total_products = 0
        pending_products = 0
        approved_products = 0
        total_orders = 0
        pending_orders = 0
        processing_orders = 0
        completed_orders = 0
        total_revenue = 0
        recent_farmers = []
        recent_orders = []
        
    context = {
        'page_title': 'Admin Dashboard',
        'total_farmers': total_farmers,
        'pending_verification': pending_verification,
        'verified_farmers': verified_farmers,
        'total_products': total_products,
        'pending_products': pending_products,
        'approved_products': approved_products,
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'completed_orders': completed_orders,
        'total_revenue': total_revenue,
        'recent_farmers': recent_farmers,
        'recent_orders': recent_orders,
    }
    
    return render(request, 'admin_dashboard.html', context)

@login_required
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def farmer_verification(request):
    """
    View for admin to verify farmers
    Displays list of farmers with pending verification
    """
    if not is_admin_or_verifier(request.user):
        return redirect('admin_login')
    
    try:
        # Get all verification requests, with newest first
        pending_verifications = FarmerVerification.objects.filter(
            status='pending'
        ).select_related('farmer').order_by('-submission_date')
        
        # Get counts for filter badges
        all_requests_count = FarmerVerification.objects.count()
        pending_count = FarmerVerification.objects.filter(status='pending').count()
        approved_count = FarmerVerification.objects.filter(status='approved').count()
        rejected_count = FarmerVerification.objects.filter(status='rejected').count()
        
    except Exception as e:
        # Use empty values if database tables don't exist yet
        pending_verifications = []
        all_requests_count = 0
        pending_count = 0
        approved_count = 0
        rejected_count = 0
    
    context = {
        'page_title': 'Farmer Verification',
        'pending_verifications': pending_verifications,
        'all_requests_count': all_requests_count,
        'pending_count': pending_count, 
        'approved_count': approved_count,
        'rejected_count': rejected_count
    }
    
    return render(request, 'admin_farmer_verification.html', context)

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
            # Update the farmer's verification status to verified
            verification.farmer.is_verified = True
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

@user_passes_test(is_admin_or_verifier)
def review_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        from qr.utils import generate_qr_code
        
        # Check for both formats - direct keys or action field
        if 'approve' in request.POST or request.POST.get('action') == 'approve':
            product.status = 'active'
            
            # Generate QR code for approved product
            try:
                qr_file = generate_qr_code(product)
                product.qr_code = qr_file
                messages.success(request, f"Product '{product.name}' has been approved and QR code generated successfully!")
            except Exception as e:
                messages.error(request, f"Product approved but QR code generation failed: {str(e)}")
                
            product.save()
            
        elif 'reject' in request.POST or request.POST.get('action') == 'reject':
            product.status = 'rejected'
            # Check for both field names
            rejection_reason = request.POST.get('rejection_reason') or request.POST.get('notes')
            if rejection_reason:
                product.description += f"\n\nRejection Notes: {rejection_reason}"
            product.save()
            messages.success(request, f"Product '{product.name}' has been rejected.")
            
        return redirect('product_approval')
    
    context = {
        'product': product,
        'farmer': product.farmer
    }
    return render(request, 'admin/review_product.html', context)

@login_required
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def product_approval(request):
    """
    View for admin to approve products
    Displays list of products pending approval
    """
    if not is_admin_or_verifier(request.user):
        return redirect('admin_login')
    
    try:
        # Get products pending approval
        pending_products = Product.objects.filter(
            status='pending'
        ).select_related('farmer').order_by('-created_at')
        
        # Get count statistics for the filter badges
        all_products_count = Product.objects.count()
        pending_count = Product.objects.filter(status='pending').count()
        approved_count = Product.objects.filter(status='active').count()
        rejected_count = Product.objects.filter(status='rejected').count()
        
    except Exception as e:
        # Use empty values if database tables don't exist yet
        pending_products = []
        all_products_count = 0
        pending_count = 0
        approved_count = 0
        rejected_count = 0
    
    context = {
        'page_title': 'Product Approval',
        'pending_products': pending_products,
        'all_products_count': all_products_count,
        'pending_count': pending_count,
        'approved_count': approved_count,
        'rejected_count': rejected_count
    }
    
    return render(request, 'admin_product_approval.html', context)

@login_required
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def manage_users(request):
    """
    View for admin to manage users
    Displays list of users with filtering options
    """
    if not is_admin_or_verifier(request.user):
        return redirect('admin_login')
    
    # Get filter parameters
    user_type_filter = request.GET.get('user_type', 'all')
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    
    try:
        # Build base queryset for all users
        users_queryset = User.objects.all()
        
        # Apply filters
        if user_type_filter == 'admin':
            users_queryset = users_queryset.filter(is_staff=True)
        elif user_type_filter == 'farmer':
            users_queryset = users_queryset.filter(farmer__isnull=False)
        elif user_type_filter == 'consumer':
            users_queryset = users_queryset.filter(consumer__isnull=False)
            
        if status_filter == 'active':
            users_queryset = users_queryset.filter(is_active=True)
        elif status_filter == 'inactive':
            users_queryset = users_queryset.filter(is_active=False)
        elif status_filter == 'verified_farmers':
            users_queryset = users_queryset.filter(farmer__is_verified=True)
        elif status_filter == 'unverified_farmers':
            users_queryset = users_queryset.filter(farmer__is_verified=False)
            
        if search_query:
            users_queryset = users_queryset.filter(
                Q(username__icontains=search_query) | 
                Q(email__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query)
            )
        
        # Get user list (would be paginated in a real app)
        users = users_queryset.order_by('-date_joined')[:50]
        
        # Calculate user statistics
        total_users = User.objects.count()
        total_admins = User.objects.filter(is_staff=True).count()
        total_farmers = User.objects.filter(farmer__isnull=False).count()
        total_consumers = User.objects.filter(consumer__isnull=False).count()
        
        # Calculate percentages for user types
        admin_percent = (total_admins / total_users * 100) if total_users > 0 else 0
        farmer_percent = (total_farmers / total_users * 100) if total_users > 0 else 0
        consumer_percent = (total_consumers / total_users * 100) if total_users > 0 else 0
        
        # Active user counts
        active_users = User.objects.filter(is_active=True).count()
        active_admins = User.objects.filter(is_staff=True, is_active=True).count()
        active_farmers = User.objects.filter(farmer__isnull=False, is_active=True).count()
        active_consumers = User.objects.filter(consumer__isnull=False, is_active=True).count()
        
        # Farmer verification status
        verified_farmers = User.objects.filter(farmer__is_verified=True).count()
        unverified_farmers = total_farmers - verified_farmers
        
        # Calculate percentages for farmer verification
        verified_farmers_percent = (verified_farmers / total_farmers * 100) if total_farmers > 0 else 0
        unverified_farmers_percent = (unverified_farmers / total_farmers * 100) if total_farmers > 0 else 0
        
        # Registration statistics
        today = timezone.now().date()
        month_start = today.replace(day=1)
        year_start = today.replace(month=1, day=1)
        
        registrations_today = User.objects.filter(date_joined__date=today).count()
        registrations_this_month = User.objects.filter(date_joined__date__gte=month_start).count()
        registrations_this_year = User.objects.filter(date_joined__date__gte=year_start).count()
        
        # Get signups by month for the last 6 months
        six_months_ago = today - timedelta(days=180)
        signups_by_month_data = User.objects.filter(
            date_joined__date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('date_joined')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')
        
        # Prepare chart data for the last 6 months
        months = []
        signups_by_month = []
        
        for i in range(5, -1, -1):
            month = (today.replace(day=1) - timedelta(days=i*30)).strftime('%b %Y')
            months.append(month)
        
        # Create a dictionary of month: count from the database results
        signups_dict = {}
        for item in signups_by_month_data:
            month_str = item['month'].strftime('%b %Y')
            signups_dict[month_str] = item['count']
        
        # Fill in the signups_by_month list with counts (0 if no data for that month)
        for month in months:
            signups_by_month.append(signups_dict.get(month, 0))
        
        # Convert to JSON for charts
        months_json = json.dumps(months)
        signups_json = json.dumps(signups_by_month)
        
    except Exception as e:
        # Use empty values if database error
        print(f"Error fetching user data: {str(e)}")
        users = []
        total_users = 0
        total_admins = 0
        total_farmers = 0
        total_consumers = 0
        admin_percent = 0
        farmer_percent = 0
        consumer_percent = 0
        active_users = 0
        active_admins = 0
        active_farmers = 0
        active_consumers = 0
        verified_farmers = 0
        unverified_farmers = 0
        verified_farmers_percent = 0
        unverified_farmers_percent = 0
        registrations_today = 0
        registrations_this_month = 0
        registrations_this_year = 0
        months = [month.strftime('%b %Y') for month in [
            (today.replace(day=1) - timedelta(days=i*30)) for i in range(5, -1, -1)
        ]]
        signups_by_month = [0] * 6
        months_json = json.dumps(months)
        signups_json = json.dumps(signups_by_month)
    
    context = {
        'page_title': 'User Management',
        'users': users,
        'total_users': total_users,
        'total_admins': total_admins,
        'total_farmers': total_farmers,
        'total_consumers': total_consumers,
        'admin_percent': admin_percent,
        'farmer_percent': farmer_percent,
        'consumer_percent': consumer_percent,
        'active_users': active_users,
        'active_admins': active_admins,
        'active_farmers': active_farmers,
        'active_consumers': active_consumers,
        'verified_farmers': verified_farmers,
        'unverified_farmers': unverified_farmers,
        'verified_farmers_percent': verified_farmers_percent,
        'unverified_farmers_percent': unverified_farmers_percent,
        'registrations_today': registrations_today,
        'registrations_this_month': registrations_this_month,
        'registrations_this_year': registrations_this_year,
        'months': months_json,
        'signups_by_month': signups_json,
        'user_type_filter': user_type_filter,
        'status_filter': status_filter,
        'search_query': search_query
    }
    
    return render(request, 'manage_users.html', context)

@login_required
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def order_management(request):
    """
    View for admin to manage orders
    Displays list of orders with filtering options
    """
    if not is_admin_or_verifier(request.user):
        return redirect('admin_login')
    
    # Get status filter parameter
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    
    try:
        # Build base queryset
        orders_queryset = Order.objects.all().select_related(
            'consumer', 'consumer__user'
        ).prefetch_related(
            'items', 'status_history'
        )
        
        # Apply filters
        if status_filter and status_filter != 'all':
            orders_queryset = orders_queryset.filter(status=status_filter)
            
        if search_query:
            orders_queryset = orders_queryset.filter(
                Q(order_id__icontains=search_query) | 
                Q(consumer__user__first_name__icontains=search_query) |
                Q(consumer__user__last_name__icontains=search_query) |
                Q(consumer__user__email__icontains=search_query)
            )
        
        # Get recent orders (paginated in a real app)
        recent_orders = orders_queryset.order_by('-created_at')[:20]
        
        # Calculate statistics for the dashboard cards
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        processing_orders = Order.objects.filter(status='processing').count()
        shipped_orders = Order.objects.filter(status='shipped').count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        cancelled_orders = Order.objects.filter(status='cancelled').count()
        
        # Calculate percentages for order statuses
        pending_percent = (pending_orders / total_orders * 100) if total_orders > 0 else 0
        processing_percent = (processing_orders / total_orders * 100) if total_orders > 0 else 0
        shipped_percent = (shipped_orders / total_orders * 100) if total_orders > 0 else 0
        delivered_percent = (delivered_orders / total_orders * 100) if total_orders > 0 else 0
        cancelled_percent = (cancelled_orders / total_orders * 100) if total_orders > 0 else 0
        
        # Calculate revenue statistics
        total_revenue = Order.objects.filter(payment_status=True).aggregate(
            Sum('total_amount')
        )['total_amount__sum'] or 0
        
        # Calculate revenue by time periods
        today = timezone.now().date()
        month_start = today.replace(day=1)
        year_start = today.replace(month=1, day=1)
        
        revenue_today = Order.objects.filter(
            payment_status=True, 
            created_at__date=today
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        revenue_this_month = Order.objects.filter(
            payment_status=True, 
            created_at__date__gte=month_start
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        revenue_this_year = Order.objects.filter(
            payment_status=True, 
            created_at__date__gte=year_start
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Calculate average order value
        if total_orders > 0:
            average_order_value = total_revenue / total_orders
        else:
            average_order_value = 0
        
        # Get top selling products
        top_products = OrderItem.objects.values(
            'product__name'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_sales=Sum(F('quantity') * F('price'))
        ).order_by('-total_quantity')[:5]
        
        # Get orders by status for charts
        orders_by_status = {
            'pending': pending_orders,
            'processing': processing_orders,
            'shipped': shipped_orders,
            'delivered': delivered_orders,
            'cancelled': cancelled_orders,
            # Add percentages
            'pending_percent': pending_percent,
            'processing_percent': processing_percent,
            'shipped_percent': shipped_percent,
            'delivered_percent': delivered_percent,
            'cancelled_percent': cancelled_percent
        }
        
        # Get orders created by date (last 7 days)
        last_week = today - timedelta(days=7)
        orders_by_date = Order.objects.filter(
            created_at__date__gte=last_week
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        # Prepare chart data
        dates = [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7, 0, -1)]
        orders_by_date_dict = {item['date'].strftime('%Y-%m-%d'): item['count'] for item in orders_by_date}
        orders_count_by_date = [orders_by_date_dict.get(date, 0) for date in dates]
        
        # Convert to JSON-friendly format for chart.js
        dates_json = json.dumps(dates)
        orders_count_json = json.dumps(orders_count_by_date)
        
    except Exception as e:
        # Use empty values if database tables don't exist yet
        print(f"Error fetching order data: {str(e)}")
        recent_orders = []
        total_orders = 0
        pending_orders = 0
        processing_orders = 0
        shipped_orders = 0
        delivered_orders = 0
        cancelled_orders = 0
        total_revenue = 0
        revenue_today = 0
        revenue_this_month = 0
        revenue_this_year = 0
        average_order_value = 0
        top_products = []
        orders_by_status = {
            'pending': 0,
            'processing': 0,
            'shipped': 0,
            'delivered': 0,
            'cancelled': 0,
            'pending_percent': 0,
            'processing_percent': 0,
            'shipped_percent': 0,
            'delivered_percent': 0,
            'cancelled_percent': 0
        }
        dates = [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7, 0, -1)]
        orders_count_by_date = [0] * 7
        
        # Convert to JSON-friendly format for chart.js
        dates_json = json.dumps(dates)
        orders_count_json = json.dumps(orders_count_by_date)
    
    context = {
        'page_title': 'Order Management',
        'recent_orders': recent_orders,
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'shipped_orders': shipped_orders,
        'delivered_orders': delivered_orders,
        'cancelled_orders': cancelled_orders,
        'total_revenue': total_revenue,
        'revenue_today': revenue_today,
        'revenue_this_month': revenue_this_month,
        'revenue_this_year': revenue_this_year,
        'average_order_value': average_order_value,
        'top_products': top_products,
        'orders_by_status': orders_by_status,
        'dates': dates_json,
        'orders_count_by_date': orders_count_json,
        'status_filter': status_filter,
        'search_query': search_query
    }
    
    return render(request, 'admin_order_management.html', context)

# Farmer Portal Views
@login_required(login_url='/login/')
def farmer_dashboard(request):
    """
    View for farmer dashboard
    Displays overview of products, orders, and verification status
    """
    try:
        # Get the farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get the latest verification if any
        verification = FarmerVerification.objects.filter(
            farmer=farmer
        ).order_by('-submission_date').first()
        
        # Determine verification status 
        verification_status = 'unverified'
        if farmer.is_verified:
            verification_status = 'verified'
        elif verification:
            verification_status = verification.status
        
        # Count products
        total_products = Product.objects.filter(farmer=farmer).count()
        pending_products = Product.objects.filter(farmer=farmer, status='pending').count()
        active_products = Product.objects.filter(farmer=farmer, status='active').count()
        
        # Get recent products
        recent_products = Product.objects.filter(farmer=farmer).order_by('-created_at')[:5]
        
        # Debug prints
        print(f"Total products: {total_products}")
        print(f"Active products: {active_products}")
        print(f"Recent products: {recent_products.count()}")
        for product in recent_products:
            print(f"Product: {product.name}, Status: {product.status}")
        
        # Get recent orders for farmer's products
        # Using .distinct() to get unique orders even if multiple items in an order are from this farmer
        recent_orders = Order.objects.filter(
            items__product__farmer=farmer
        ).distinct().order_by('-created_at')[:5]
        
        # Calculate total revenue from delivered orders
        delivered_orders = Order.objects.filter(
            items__product__farmer=farmer, 
            status='delivered'
        ).distinct()
        
        total_revenue = 0
        for order in delivered_orders:
            for item in order.items.filter(product__farmer=farmer):
                total_revenue += item.price * item.quantity
        
        context = {
            'farmer': farmer,
            'verification_status': verification_status,
            'total_products': total_products,
            'products_count': total_products,
            'pending_products': pending_products,
            'active_products': active_products,
            'recent_products': recent_products,
            'recent_orders': recent_orders,
            'total_revenue': total_revenue,
        }
        
        return render(request, 'farmer_dashboard.html', context)
        
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one and redirect
        farmer = Farmer.objects.create(
            user=request.user,
            is_verified=False
        )
        return redirect('farmer_dashboard')
    except Exception as e:
        # Handle any other exceptions
        messages.error(request, f"An error occurred: {str(e)}")
        return render(request, 'farmer_dashboard.html', {'error': str(e)})

@login_required(login_url='/login/')
def farmer_verification_status(request):
    """
    View for farmer verification status page
    Displays the verification status of the farmer
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
        
        # Determine verification status from either the verification record or is_verified field
        verification_status = 'unverified'
        if farmer.is_verified:
            verification_status = 'verified'
        elif verification:
            verification_status = verification.status
        
        context = {
            'farmer': farmer,
            'verification': verification,
            'supporting_documents': supporting_documents,
            'verification_status': verification_status,
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
            is_verified=False
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
        active_products = products.filter(status='active').count()
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
            'is_verified': farmer.is_verified
        }
        
        return render(request, 'farmer_product_management.html', context)
        
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one and redirect
        farmer = Farmer.objects.create(
            user=request.user,
            is_verified=False
        )
        return redirect('farmer_dashboard')

@login_required(login_url='/login/')
def my_products(request):
    """
    Display all products for a farmer with filtering options
    """
    try:
        # Get the farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get filter parameters
        status_filter = request.GET.get('status', 'all')
        category_filter = request.GET.get('category', 'all')
        search_query = request.GET.get('search', '')
        
        # Base query - all products for this farmer
        products = Product.objects.filter(farmer=farmer)
        
        # Apply filters
        if status_filter != 'all':
            products = products.filter(status=status_filter)
            
        if category_filter != 'all':
            products = products.filter(category__id=category_filter)
            
        if search_query:
            products = products.filter(name__icontains=search_query)
        
        # Order by most recent
        products = products.order_by('-created_at')
        
        # Get all categories for filter dropdown
        categories = Category.objects.all()
        
        # Calculate product statistics
        total_products = Product.objects.filter(farmer=farmer).count()
        active_products = Product.objects.filter(farmer=farmer, status='active').count()
        pending_products = Product.objects.filter(farmer=farmer, status='pending').count()
        draft_products = Product.objects.filter(farmer=farmer, status='draft').count()
        rejected_products = Product.objects.filter(farmer=farmer, status='rejected').count()
        
        context = {
            'farmer': farmer,
            'products': products,
            'categories': categories,
            'status_filter': status_filter,
            'category_filter': category_filter,
            'search_query': search_query,
            'total_products': total_products,
            'active_products': active_products,
            'pending_products': pending_products,
            'draft_products': draft_products,
            'rejected_products': rejected_products,
            'is_verified': farmer.is_verified
        }
        
        return render(request, 'my_products.html', context)
        
    except Farmer.DoesNotExist:
        # If the farmer profile doesn't exist, create one and redirect
        farmer = Farmer.objects.create(
            user=request.user,
            is_verified=False
        )
        return redirect('farmer_dashboard')

@login_required(login_url='/login/')
def add_product(request):
    """
    View for adding a new product as a farmer
    Displays the add product form
    """
    # Ensure user is a farmer
    if not is_farmer(request.user):
        return redirect('login')
    
    try:
        # Get farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get all categories for the dropdown
        categories = Category.objects.all()
        
        context = {
            'farmer': farmer,
            'categories': categories,
            'is_verified': farmer.is_verified
        }
        
        return render(request, 'add_product.html', context)
    except Exception as e:
        messages.error(request, f"An error occurred: {str(e)}")
        return redirect('farmer_product_management')

@login_required(login_url='/login/')
def farmer_orders(request):
    """
    View for farmer orders page
    Displays orders for the farmer's products with filtering options
    """
    # Ensure user is a farmer
    if not is_farmer(request.user):
        return redirect('login')
    
    try:
        # Get farmer profile
        farmer = Farmer.objects.get(user=request.user)
        
        # Get order items for this farmer's products
        order_items = OrderItem.objects.filter(
            product__farmer=farmer
        ).select_related('order', 'product')
        
        # Extract unique orders
        orders_dict = {}
        for item in order_items:
            if item.order.id not in orders_dict:
                # Initialize order with empty items list
                orders_dict[item.order.id] = {
                    'order': item.order,
                    'items': [],
                    'total_quantity': 0
                }
            # Add this item to the order
            orders_dict[item.order.id]['items'].append(item)
            orders_dict[item.order.id]['total_quantity'] += item.quantity
        
        # Convert to list and sort by created_at
        orders = list(orders_dict.values())
        orders.sort(key=lambda x: x['order'].created_at, reverse=True)
        
        # Calculate statistics
        total_orders = len(orders)
        pending_orders = sum(1 for o in orders if o['order'].status == 'pending')
        total_revenue = sum(item.price * item.quantity for o in orders for item in o['items'])
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
    except Exception as e:
        # Use empty values if database tables don't exist yet
        farmer = None
        orders = []
        total_orders = 0
        pending_orders = 0
        total_revenue = 0
        avg_order_value = 0
    
    context = {
        'farmer': farmer,
        'orders': orders,
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'total_revenue': total_revenue,
        'avg_order_value': avg_order_value
    }
    
    return render(request, 'farmer_orders.html', context)

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
            
            # No need to update farmer status - the is_verified field will be updated upon approval
            
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
    Handle product deletion via form submission or AJAX
    """
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product_id')
            farmer = Farmer.objects.get(user=request.user)
            product = Product.objects.get(id=product_id, farmer=farmer)
            
            product_name = product.name
            product.delete()
            
            # For AJAX requests
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': f"Product '{product_name}' has been deleted successfully."
                })
            
            # For regular form submissions
            messages.success(request, f"Product '{product_name}' has been deleted successfully.")
            return redirect('my_products')  # Redirect to the my_products page
            
        except Product.DoesNotExist:
            error_message = "Product not found or you don't have permission to delete it."
            
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message
                })
            
            messages.error(request, error_message)
            return redirect('my_products')
            
        except Exception as e:
            error_message = f"Error deleting product: {str(e)}"
            
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message
                })
            
            messages.error(request, error_message)
            return redirect('my_products')
    
    # Invalid request method
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'success': False,
            'message': "Invalid request method."
        })
    
    messages.error(request, "Invalid request method.")
    return redirect('my_products')

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
        featured_products = Product.objects.filter(status='active').order_by('-created_at')[:8]
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

def marketplace_product(request, product_id):
    """
    View for displaying a single product in the marketplace
    """
    try:
        product = get_object_or_404(Product, id=product_id, status='active')
        related_products = Product.objects.filter(
            category=product.category, 
            status='active'
        ).exclude(id=product.id).order_by('-created_at')[:4]
        
        context = {
            'product': product,
            'related_products': related_products,
        }
    except:
        context = {'error': 'Product not found'}
        
    return render(request, 'marketplace_product.html', context)

def init_admin(request):
    """
    Initial setup view for creating the first admin user
    Can only be used when no admin users exist
    """
    # Check if any admin users already exist
    admin_group, created = Group.objects.get_or_create(name='Admin')
    verifier_group, created = Group.objects.get_or_create(name='Verifier')
    
    existing_admins = User.objects.filter(groups=admin_group).exists()
    
    if existing_admins and not request.user.is_superuser:
        messages.error(request, 'Admin users already exist. This setup can only be performed once.')
        return redirect('home')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        # Validate input
        if not all([username, email, password, confirm_password]):
            messages.error(request, 'All fields are required.')
            return render(request, 'init_admin.html')
        
        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'init_admin.html')
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'init_admin.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return render(request, 'init_admin.html')
        
        # Create the user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True
        )
        
        # Add to Admin group
        user.groups.add(admin_group)
        
        # Also create a verifier group if it doesn't exist
        verifier_group, created = Group.objects.get_or_create(name='Verifier')
        
        messages.success(request, f'Admin user {username} created successfully. You can now log in.')
        return redirect('admin_login')
    
    return render(request, 'init_admin.html')










