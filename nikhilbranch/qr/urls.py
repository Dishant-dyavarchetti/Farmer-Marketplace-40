from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("/api/product/<int:product_id>", views.product_details, name="product_details"),
    path('product/<int:product_id>/', views.product_page, name='product_page'),
    path("",views.qr, name="index"),
]
