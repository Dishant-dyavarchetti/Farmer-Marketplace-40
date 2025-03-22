from django.db import models
from django.contrib.auth.models import User


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    profile_picture = models.ImageField(upload_to='customer_profiles/', null=True, blank=True)
    
    def __str__(self):
        return self.user.username

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    
    def __str__(self):
        return self.name

class farmer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.OneToOneField(User, on_delete=models.CASCADE)
    farm_name = models.CharField(max_length=255)
    farm_location = models.TextField()
    products_sold = models.TextField()
    farm_logo = models.ImageField(upload_to='farmer_profiles/', null=True, blank=True)
    phone_number = models.CharField(max_length=15)

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    state_of_origin = models.CharField(max_length=255)
    quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    farmer = models.ForeignKey(farmer, on_delete=models.CASCADE)
    def __str__(self):
        return self.name 


class Order(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255)
    delivery_address = models.TextField()
    delivery_date = models.DateTimeField(null=True, blank=True)
    delivery_status = models.CharField(max_length=255)
    delivery_tracking_number = models.CharField(max_length=255)
    delivery_tracking_url = models.URLField(null=True, blank=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.customer.user.username}"
    
class Cart(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Cart {self.id} - {self.customer.user.username}"
    
class Payment(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=255)
    payment_method = models.CharField(max_length=255)
    payment_reference = models.CharField(max_length=255)
    payment_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Payment {self.id} - {self.order.customer.user.username}"
    
class Review(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.id} - {self.customer.user.username}"
    
class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
    message = models.TextField()
    notification_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification {self.id} - {self.customer.user.username}"
    
class FarmerProfile(models.Model):
    id = models.AutoField(primary_key=True)
    farmer = models.ForeignKey(farmer, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='farmer_profiles/', null=True, blank=True)
    bio = models.TextField()
    phone_number = models.CharField(max_length=15)
    
    def __str__(self):
        return f"Farmer Profile {self.id} - {self.farmer.user.username}"

class FarmerProduct(models.Model):
    id = models.AutoField(primary_key=True)
    farmer = models.ForeignKey(farmer, on_delete=models.CASCADE)

