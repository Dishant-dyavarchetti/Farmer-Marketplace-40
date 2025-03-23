from django.contrib import admin
from django.urls import path
from . import views  # Ensure views.py contains the necessary functions

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('aboutus/', views.aboutus, name='aboutus'),
    path('contactus/', views.contactus, name='contactus'),
    path('contact-submit/', views.contact_submit, name='contact_submit'),  # Contact form submission route
    path("cart/", views.cart, name="cart"),
    path("remove-from-cart/<int:item_id>/", views.remove_from_cart, name="remove_from_cart"),
    path("checkout/", views.checkout, name="checkout"),
]
