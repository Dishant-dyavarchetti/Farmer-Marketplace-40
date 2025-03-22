from django.contrib import admin

# Register your models here.
from .models import Farmer, Consumer

admin.site.register(Farmer)
admin.site.register(Consumer)
