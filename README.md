# MadhyaMukt - Organic Farmers Marketplace

MadhyaMukt is a web-based platform designed to connect verified organic farmers directly with conscious consumers. The platform ensures transparency, authenticity, and quality while promoting sustainable farming practices.

## Features

### For Farmers
- **Profile Management**: Create and manage farmer profiles with farm details
- **Product Management**: Add, update, and track organic products
- **Verification Process**: Get certified as a verified organic farmer
- **Order Management**: Track and fulfill orders from consumers
- **QR Code Generation**: Auto-generated QR codes for product traceability

### For Consumers
- **Browse Products**: Explore a wide range of organic products
- **Shopping Cart**: Add items to cart and manage quantities
- **Product Details**: View comprehensive product information including origin and certification
- **Verified Products**: Ensure products come from certified organic sources
- **QR Code Verification**: Scan product QR codes to verify authenticity

### For Administrators
- **User Management**: Monitor and manage user accounts
- **Farmer Verification**: Review and approve farmer verification requests
- **Product Approval**: Review and approve products before they go live
- **Order Monitoring**: Track orders and monitor platform activities
- **Analytics Dashboard**: View platform performance metrics

## Technology Stack

- **Backend**: Django (Python web framework)
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Database**: SQLite (development), PostgreSQL (production)
- **Styling**: Tailwind CSS with custom components
- **Icons**: Font Awesome
- **Authentication**: Django built-in authentication system
- **QR Code Generation**: Custom implementation

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Dishant-Dyavarchetti/madhyamukt.git
   cd madhyamukt
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up Tailwind CSS:
   ```
   python manage.py tailwind install
   python manage.py tailwind build
   ```

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Create an admin user:
   ```
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```
   python manage.py runserver
   ```

8. Access the application at http://127.0.0.1:8000/

## Project Structure

```
django_tailwind/
├── accounts/              # User account models and views
├── django_tailwind/       # Main project settings
├── qr/                    # QR code generation functionality
├── static/                # Static files (CSS, JS, images)
├── templates/             # HTML templates
│   ├── admin_*.html       # Admin dashboard templates
│   ├── farmer_*.html      # Farmer dashboard templates
│   ├── marketplace.html   # Marketplace listing page
│   ├── cart.html          # Shopping cart page
│   └── base.html          # Base template with common elements
└── manage.py              # Django management script
```

## User Flows

### Farmer Flow
1. Register as a farmer
2. Submit verification documents
3. Wait for admin approval
4. Add products to the marketplace
5. Products are reviewed and approved by admins
6. Manage orders and shipments

### Consumer Flow
1. Register as a consumer
2. Browse the marketplace
3. Add products to cart
4. Checkout and place order
5. Track order status
6. Receive products

### Admin Flow
1. Review farmer verification requests
2. Approve or reject farmers
3. Review product submissions
4. Manage user accounts
5. Monitor platform metrics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please contact:
- Email: ddishantmsccs2023@gmail.com
- Phone: +91 9106754206