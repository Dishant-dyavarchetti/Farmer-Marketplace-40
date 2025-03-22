from django.db import models
from django.contrib.auth.models import User

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    profile_picture = models.ImageField(upload_to='customer_profiles/', null=True, blank=True)

    def __str__(self):  # Fixed: Double underscores
        return self.user.username

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='categories/', null=True, blank=True)

    def __str__(self):  # Fixed: Double underscores
        return self.name

class Product(models.Model):
    id = models.AutoField(primary_key=True)  # Fixed: Removed max_length
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    farmer_name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):  # Fixed: Double underscores
        return self.name
