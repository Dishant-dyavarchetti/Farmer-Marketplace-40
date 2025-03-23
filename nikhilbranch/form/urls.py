from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.forms, name='forms'),
    path('add_product/', views.add_product, name='add_product'),
    path('products/', views.product_list, name='product_list'),
    path('edit_product/<int:product_id>/', views.edit_product, name='edit_product'),
    path('delete_product/<int:product_id>/', views.delete_product, name='delete_product'),
]   