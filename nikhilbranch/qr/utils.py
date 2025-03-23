import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw
import os
from django.conf import settings

def generate_qr_code(product_id, base_url="http://localhost:8000"):
    """
    Generate a QR code for a product
    
    Args:
        product_id: The ID of the product
        base_url: The base URL of the website (default: http://localhost:8000)
        
    Returns:
        A File object containing the QR code image
    """
    # Create the URL for the product
    product_url = f"{base_url}/qr/product/{product_id}/"
    
    # Create a QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add the data to the QR code
    qr.add_data(product_url)
    qr.make(fit=True)
    
    # Create an image from the QR code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Add a logo in the center (optional)
    try:
        logo_path = os.path.join(settings.STATIC_ROOT, 'images', 'logo.png')
        if os.path.exists(logo_path):
            logo = Image.open(logo_path)
            
            # Calculate logo size (1/4 of the QR code)
            logo_size = int(img.size[0] / 4)
            logo = logo.resize((logo_size, logo_size))
            
            # Calculate position
            pos = ((img.size[0] - logo.size[0]) // 2, (img.size[1] - logo.size[1]) // 2)
            
            # Create a new image for the QR code with the logo
            img_with_logo = Image.new("RGBA", img.size, (0, 0, 0, 0))
            img_with_logo.paste(img, (0, 0))
            img_with_logo.paste(logo, pos, mask=logo)
            img = img_with_logo
    except Exception:
        # If adding the logo fails, just use the QR code without the logo
        pass
    
    # Save the QR code to a BytesIO object
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    
    # Return the File object
    return File(buffer, name=f"qr_code_{product_id}.png") 