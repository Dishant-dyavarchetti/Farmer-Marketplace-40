import qrcode
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import os
from django.conf import settings

def generate_qr_code(product):
    """Generate a QR code for a product and return it as an InMemoryUploadedFile"""
    # Create QR code URL for the product
    url = f"{settings.BASE_URL}/qr/product/{product.id}/"
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create image from QR code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save QR code image to BytesIO object
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    
    # Create a Django-friendly image file
    filename = f"product_{product.id}_qr.png"
    file_size = buffer.getbuffer().nbytes
    
    # Return as InMemoryUploadedFile which can be directly assigned to ImageField
    return InMemoryUploadedFile(
        buffer,
        None,
        filename,
        'image/png',
        file_size,
        None
    )