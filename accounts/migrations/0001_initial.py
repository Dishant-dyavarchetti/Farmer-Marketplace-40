# Generated by Django 5.1.7 on 2025-03-22 23:49

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='Consumer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True)),
                ('preferred_delivery_time', models.CharField(blank=True, max_length=50, null=True)),
                ('shipping_address', models.TextField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Farmer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('farm_location', models.CharField(blank=True, max_length=255, null=True)),
                ('origin_state', models.CharField(blank=True, max_length=100, null=True)),
                ('is_verified', models.BooleanField(default=False)),
                ('farm_name', models.CharField(blank=True, max_length=255, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='farmer_profiles/')),
                ('bio', models.TextField(blank=True, null=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FarmerVerification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certification_type', models.CharField(choices=[('npop', 'NPOP (National Programme for Organic Production)'), ('pgs', 'PGS India (Participatory Guarantee System)'), ('other', 'Other Organic Certification')], max_length=10)),
                ('certification_id', models.CharField(max_length=50)),
                ('valid_until', models.DateField()),
                ('farm_description', models.TextField()),
                ('certificate_document', models.FileField(upload_to='certification_documents/')),
                ('submission_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending Review'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('rejection_reason', models.TextField(blank=True, null=True)),
                ('reviewed_at', models.DateTimeField(blank=True, null=True)),
                ('farmer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='verifications', to='accounts.farmer')),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviews', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_id', models.CharField(max_length=20, unique=True)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('shipped', 'Shipped'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('shipping_address', models.TextField()),
                ('order_notes', models.TextField(blank=True, null=True)),
                ('payment_status', models.BooleanField(default=False)),
                ('payment_method', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('consumer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='accounts.consumer')),
            ],
        ),
        migrations.CreateModel(
            name='OrderStatusHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('shipped', 'Shipped'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')], max_length=20)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='status_history', to='accounts.order')),
            ],
            options={
                'verbose_name_plural': 'Order status histories',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('unit', models.CharField(max_length=20)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('package_size', models.CharField(max_length=50)),
                ('stock', models.PositiveIntegerField(default=0)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('pending', 'Pending Approval'), ('active', 'Active'), ('rejected', 'Rejected'), ('out_of_stock', 'Out of Stock')], default='draft', max_length=20)),
                ('image', models.ImageField(blank=True, null=True, upload_to='product_images/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='accounts.category')),
                ('farmer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='accounts.farmer')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='accounts.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.product')),
            ],
        ),
        migrations.CreateModel(
            name='SupportingDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document', models.FileField(upload_to='supporting_documents/')),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('verification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supporting_documents', to='accounts.farmerverification')),
            ],
        ),
    ]
