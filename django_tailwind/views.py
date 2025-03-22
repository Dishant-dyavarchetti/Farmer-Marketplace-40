from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth.models import User, Group

def home(request):
    return render(request, 'homepage.html')

def login(request):
    return render(request, 'login.html')

def register(request):
    return render(request, 'register.html')

def about(request):
    return render(request, 'about.html')

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
            return render(request, 'manage_users.html', {'error_message': 'Passwords do not match.'})
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return render(request, 'manage_users.html', {'error_message': 'Username already exists.'})
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return render(request, 'manage_users.html', {'error_message': 'Email already exists.'})
        
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
            
            return render(request, 'manage_users.html', {'success_message': f'User {username} created successfully as {user_role}.'})
        
        except Exception as e:
            return render(request, 'manage_users.html', {'error_message': f'Error creating user: {str(e)}'})
    
    return redirect('manage_users')

# Secure admin views
@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def farmer_verification(request):
    return render(request, 'farmer_verification.html')

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def product_approval(request):
    return render(request, 'product_approval.html')

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def manage_users(request):
    return render(request, 'manage_users.html')

@login_required(login_url='/admin-portal/login/')
@user_passes_test(is_admin_or_verifier, login_url='/admin-portal/login/')
def order_management(request):
    return render(request, 'order_management.html')

# Farmer Portal Views
@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def farmer_dashboard(request):
    context = {
        'farmer_verified': False,  # This would come from the user's profile/model
        'recent_orders': True,  # Dummy data for template rendering
    }
    return render(request, 'farmer_dashboard.html', context)

@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def farmer_verification_status(request):
    context = {
        'verification_status': 'pending',  # Could be 'pending', 'approved', or 'rejected'
        'submission_date': '2023-05-15',
        'certification_type': 'NPOP (National Programme for Organic Production)',
        'certification_id': 'NPOP/2023/12345',
        'valid_until': '31 Dec 2024',
        'farm_description': 'Our farm is located in the fertile hills of Himachal Pradesh. We have been practicing organic farming for over 5 years, focusing on traditional methods of cultivation without the use of chemical fertilizers or pesticides. We primarily grow rice, pulses, and seasonal vegetables.',
    }
    return render(request, 'farmer_verification_status.html', context)

@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def farmer_product_management(request):
    # This would fetch the farmer's products in a real app
    return render(request, 'farmer_product_management.html')

@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def farmer_orders(request):
    # This would fetch the farmer's orders in a real app
    return render(request, 'farmer_orders.html')

@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def submit_verification(request):
    if request.method == 'POST':
        # Process verification submission
        # This would save the verification details in a real app
        return redirect('farmer_verification_status')
    
    return redirect('farmer_dashboard')

@login_required(login_url='/login/')
@user_passes_test(is_farmer, login_url='/login/')
def save_product(request):
    if request.method == 'POST':
        # Process product submission
        # This would save the product details in a real app
        product_id = request.POST.get('product_id')
        if product_id:
            # Updating existing product
            messages.success(request, 'Product updated successfully!')
        else:
            # Creating new product
            messages.success(request, 'Product added successfully!')
        
        return redirect('farmer_product_management')
    
    return redirect('farmer_product_management')










