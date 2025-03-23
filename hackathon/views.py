from django.shortcuts import render, redirect
from django.http import HttpResponse

def home(request):
    return render(request, 'base.html')

def aboutus(request):
    return render(request, 'about.html')

def contactus(request):
    return render(request, 'contact.html')

def contact_submit(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        # Process the form data (e.g., save to database, send an email, etc.)
        return HttpResponse("Thank you for your message!")  # Temporary success response

    return redirect("contactus")  # Redirect back to the contact page if not a POST request

cart_items = [
    {"id": 1, "name": "Fresh Apples", "image_url": "/static/images/apple.jpg", "price": 100, "quantity": 2, "total": 200},
    {"id": 2, "name": "Organic Carrots", "image_url": "/static/images/carrot.jpg", "price": 80, "quantity": 1, "total": 80},
]

def cart(request):
    cart_total = sum(item["total"] for item in cart_items)
    return render(request, "cart.html", {"cart_items": cart_items, "cart_total": cart_total})

def remove_from_cart(request, item_id):
    global cart_items
    cart_items = [item for item in cart_items if item["id"] != item_id]
    return redirect("cart")

def checkout(request):
    return render(request, "checkout.html")