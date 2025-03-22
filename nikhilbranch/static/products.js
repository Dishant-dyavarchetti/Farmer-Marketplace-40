async function fetchProductDetails() {
    // Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    console.log(productId);

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
    }
}

// Call function when page loads
fetchProductDetails();