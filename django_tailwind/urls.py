"""
URL configuration for django_tailwind project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django_tailwind import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/auth/', include('accounts.urls')),  # Auth endpoints
    path('', views.home, name='home'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('about/', views.about, name='about'),
    
    # Admin portal authentication
    path('admin-portal/login/', views.admin_login, name='admin_login'),
    path('admin-portal/logout/', views.admin_logout, name='admin_logout'),
    path('admin-portal/create-admin/', views.create_admin_user, name='create_admin_user'),
    
    # Admin portal pages (now protected)
    path('admin-portal/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-portal/farmer-verification/', views.farmer_verification, name='farmer_verification'),
    path('admin-portal/product-approval/', views.product_approval, name='product_approval'),
    path('admin-portal/manage-users/', views.manage_users, name='manage_users'),
    path('admin-portal/orders/', views.order_management, name='order_management'),
    
    # Farmer portal pages
    path('farmer-portal/dashboard/', views.farmer_dashboard, name='farmer_dashboard'),
    path('farmer-portal/verification-status/', views.farmer_verification_status, name='farmer_verification_status'),
    path('farmer-portal/product-management/', views.farmer_product_management, name='farmer_product_management'),
    path('farmer-portal/orders/', views.farmer_orders, name='farmer_orders'),
    
    # Farmer form submission handlers
    path('farmer-portal/submit-verification/', views.submit_verification, name='submit_verification'),
    path('farmer-portal/save-product/', views.save_product, name='save_product'),
]
