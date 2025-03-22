from django.contrib import admin

from .models import Car
admin.site.register(Car)

from .models import CustomerProfile
admin.site.register(CustomerProfile)

from .models import Category
admin.site.register(Category)

from .models import Product
admin.site.register(Product)

from .models import Order
admin.site.register(Order)




