from django.contrib import admin
from .models import (
    Farmer, Consumer, FarmerVerification, SupportingDocument,
    Category, Product, Order, OrderItem, OrderStatusHistory
)

class SupportingDocumentInline(admin.TabularInline):
    model = SupportingDocument
    extra = 1

@admin.register(FarmerVerification)
class FarmerVerificationAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'certification_type', 'certification_id', 'valid_until', 'status', 'submission_date')
    list_filter = ('status', 'certification_type', 'submission_date')
    search_fields = ('farmer__user__username', 'certification_id')
    date_hierarchy = 'submission_date'
    inlines = [SupportingDocumentInline]
    
    fieldsets = (
        ('Farmer Information', {
            'fields': ('farmer',)
        }),
        ('Certification Details', {
            'fields': ('certification_type', 'certification_id', 'valid_until', 'farm_description', 'certificate_document')
        }),
        ('Review Status', {
            'fields': ('status', 'rejection_reason', 'reviewed_by', 'reviewed_at')
        }),
    )

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ('user', 'farm_name', 'is_verified', 'phone_number', 'date_joined')
    list_filter = ('is_verified', 'date_joined')
    search_fields = ('user__username', 'user__email', 'farm_name')
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'is_verified', 'profile_picture')
        }),
        ('Farm Details', {
            'fields': ('farm_name', 'bio', 'farm_location', 'origin_state')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'address')
        }),
    )

@admin.register(Consumer)
class ConsumerAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')
    search_fields = ('user__username', 'user__email', 'phone_number')
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'profile_picture')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'shipping_address', 'preferred_delivery_time')
        }),
    )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ('subtotal',)

class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 1
    readonly_fields = ('created_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'consumer', 'total_amount', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_id', 'consumer__user__username', 'consumer__user__email')
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'consumer', 'total_amount', 'status')
        }),
        ('Shipping Details', {
            'fields': ('shipping_address', 'order_notes')
        }),
        ('Payment Information', {
            'fields': ('payment_status', 'payment_method')
        }),
    )
    
    readonly_fields = ('order_id',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'farmer', 'category', 'price', 'stock', 'status')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('name', 'farmer__user__username', 'description')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'description', 'farmer', 'category', 'image')
        }),
        ('Pricing and Stock', {
            'fields': ('price', 'unit', 'package_size', 'stock')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )

# Register any remaining models
admin.site.register(SupportingDocument)
admin.site.register(OrderItem)
admin.site.register(OrderStatusHistory)
