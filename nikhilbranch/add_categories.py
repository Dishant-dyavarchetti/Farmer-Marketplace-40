import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nikhilbranch.settings')
django.setup()

from qr.models import Category

def add_categories():
    # List of categories to add
    categories = [
        {
            'name': 'Vegetables',
            'description': 'Fresh farm vegetables including leafy greens, root vegetables, and more.'
        },
        {
            'name': 'Fruits',
            'description': 'Fresh seasonal fruits from local farms.'
        },
        {
            'name': 'Dairy',
            'description': 'Dairy products including milk, cheese, and butter from local dairy farms.'
        },
        {
            'name': 'Grains',
            'description': 'Grains, rice, and cereals grown by local farmers.'
        },
        {
            'name': 'Herbs & Spices',
            'description': 'Fresh and dried herbs and spices for cooking and seasoning.'
        }
    ]

    # Add each category if it doesn't exist
    for category_data in categories:
        category, created = Category.objects.get_or_create(
            name=category_data['name'],
            defaults={'description': category_data['description']}
        )
        
        if created:
            print(f'Successfully created category: {category.name}')
        else:
            print(f'Category already exists: {category.name}')
            
    print('Categories setup complete!')

if __name__ == '__main__':
    add_categories() 