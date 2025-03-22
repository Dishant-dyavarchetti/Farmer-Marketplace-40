from django.db import models
from django.contrib.auth.models import User

class Farmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    farm_location = models.CharField(max_length=255, blank=True, null=True)
    origin_state = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    verification_document = models.FileField(upload_to='farmer_verification/', blank=True, null=True)
    
    def __str__(self):
        return f"Farmer: {self.user.username}"

class Consumer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    preferred_delivery_time = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"Consumer: {self.user.username}"
