import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nikhilbranch.settings')
django.setup()

from qr.models import Product
from qr.utils import generate_qr_code

def generate_qrcodes_for_all_products():
    """Generate QR codes for all products that don't have one yet"""
    products = Product.objects.filter(qr_code='')
    total = products.count()
    
    print(f"Found {total} products without QR codes")
    
    for index, product in enumerate(products, 1):
        try:
            # Generate QR code
            qr_file = generate_qr_code(product.id)
            
            # Save QR code to product
            product.qr_code.save(f"qr_code_{product.id}.png", qr_file, save=True)
            
            print(f"[{index}/{total}] Generated QR code for product: {product.name}")
        except Exception as e:
            print(f"[{index}/{total}] Error generating QR code for product {product.id}: {e}")
    
    print("QR code generation complete!")

if __name__ == "__main__":
    generate_qrcodes_for_all_products() 