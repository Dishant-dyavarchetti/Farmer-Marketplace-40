from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Farmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    farm_location = models.CharField(max_length=255, blank=True, null=True)
    origin_state = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    # Basic profile info
    farm_name = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='farmer_profiles/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Farmer: {self.user.username}"

class Consumer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    preferred_delivery_time = models.CharField(max_length=50, blank=True, null=True)
    
    # Additional consumer details
    shipping_address = models.TextField(blank=True, null=True)
    # profile_picture = models.ImageField(upload_to='consumer_profiles/', blank=True, null=True)
    
    def __str__(self):
        return f"Consumer: {self.user.username}"

class FarmerVerification(models.Model):
    CERTIFICATION_CHOICES = [
        ('npop', 'NPOP (National Programme for Organic Production)'),
        ('pgs', 'PGS India (Participatory Guarantee System)'),
        ('other', 'Other Organic Certification'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='verifications')
    certification_type = models.CharField(max_length=10, choices=CERTIFICATION_CHOICES)
    certification_id = models.CharField(max_length=50)
    valid_until = models.DateField()
    farm_description = models.TextField()
    certificate_document = models.FileField(upload_to='certification_documents/')
    submission_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.farmer.user.username}'s {self.get_certification_type_display()} - {self.get_status_display()}"

class SupportingDocument(models.Model):
    verification = models.ForeignKey(FarmerVerification, on_delete=models.CASCADE, related_name='supporting_documents')
    document = models.FileField(upload_to='supporting_documents/')
    description = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Document for {self.verification.farmer.user.username}"

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'

class Product(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Approval'),
        ('active', 'Active'),
        ('rejected', 'Rejected'),
        ('out_of_stock', 'Out of Stock'),
    ]
    
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    unit = models.CharField(max_length=20)  # kg, g, l, ml, piece, dozen, etc.
    price = models.DecimalField(max_digits=10, decimal_places=2)
    package_size = models.CharField(max_length=50)  # e.g., "5kg", "500g", etc.
    stock = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} by {self.farmer.user.username}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_id = models.CharField(max_length=20, unique=True)  # Custom order ID like ORD-2023-0042
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    order_notes = models.TextField(blank=True, null=True)
    payment_status = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.order_id} by {self.consumer.user.username}"
    
    def save(self, *args, **kwargs):
        # Generate order ID if it doesn't exist
        if not self.order_id:
            date_str = timezone.now().strftime('%Y%m')
            last_order = Order.objects.filter(order_id__startswith=f'ORD-{date_str}').order_by('-order_id').first()
            
            if last_order:
                order_number = int(last_order.order_id.split('-')[-1]) + 1
            else:
                order_number = 1
                
            self.order_id = f'ORD-{date_str}-{order_number:04d}'
            
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at the time of purchase
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order #{self.order.order_id}"
    
    @property
    def subtotal(self):
        return self.price * self.quantity

class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES)
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order #{self.order.order_id} - {self.status} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        verbose_name_plural = 'Order status histories'
        ordering = ['-created_at']
