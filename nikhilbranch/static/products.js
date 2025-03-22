async function fetchProductDetails() {
    // Extract Product ID from URL path instead of query parameters
    // URL format: /product/{id}/
    const pathParts = window.location.pathname.split('/');
    // Find the product ID from the URL path
    let productId = null;
    
    // Look for the 'product' segment in the URL and take the next segment as the ID
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'product' && i + 1 < pathParts.length) {
            productId = pathParts[i + 1];
            break;
        }
    }
    
    console.log("Product ID from URL:", productId);

    if (!productId) {
        document.getElementById("productInfo").innerText = "No product found!";
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/product/${productId}/`);
        const data = await response.json();

        document.getElementById("productInfo").innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Farmer:</strong> ${data.farmer_name}</p>
            <p><strong>Certification:</strong> ${data.certification}</p>
        `;
    } catch (error) {
        document.getElementById("productInfo").innerText = "Error fetching product!";
        console.error("Fetch error:", error);
    }
}

// Call function when page loads
fetchProductDetails();