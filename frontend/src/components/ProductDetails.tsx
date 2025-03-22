import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiHeart, FiShoppingCart, FiInfo, FiCheck, FiBarChart2, FiCalendar, FiMapPin } from 'react-icons/fi';

// Type definitions
interface ProductReview {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice?: number;
  image: string;
  gallery: string[];
  category: string;
  inStock: boolean;
  quantity: number;
  unit: string;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  farmer: {
    id: number;
    name: string;
    location: string;
    image: string;
    rating: number;
    verified: boolean;
  };
  farmingMethod: string;
  certifications: string[];
  harvestDate: string;
  nutritionalInfo: Record<string, string>;
  relatedProducts: number[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  // Simulated fetch product data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock product data
      const mockProduct: ProductDetails = {
        id: parseInt(id || '1'),
        name: "Organic Red Bell Peppers",
        description: "Farm-fresh organic red bell peppers grown using natural farming methods.",
        longDescription: `These vibrant red bell peppers are grown on our certified organic farm using natural farming methods. They are harvested at peak ripeness to ensure maximum flavor and nutritional value.

Bell peppers are an excellent source of vitamins A and C, and also contain vitamins B6, E, and K1, along with folate and potassium. They're known for their sweet, crisp flavor and can be enjoyed raw, roasted, stuffed, or added to a variety of dishes.

Our peppers are grown without synthetic pesticides or fertilizers, and we use sustainable farming practices to protect the soil and environment.`,
        price: 120,
        salePrice: 99,
        image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1592833167344-45c5a64a3eff?w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1602170284347-c42f22e7a0d5?w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1599306257199-d8681b23c821?w=600&auto=format&fit=crop"
        ],
        category: "Vegetables",
        inStock: true,
        quantity: 50,
        unit: "kg",
        rating: 4.7,
        reviewCount: 28,
        reviews: [
          {
            id: 1,
            user: "Priya Sharma",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            rating: 5,
            date: "2023-08-15",
            comment: "The peppers are so fresh and flavorful! Love that I can trace where they came from."
          },
          {
            id: 2,
            user: "Rajesh Kumar",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            rating: 4,
            date: "2023-08-10",
            comment: "Great quality and taste. Will definitely buy again."
          },
          {
            id: 3,
            user: "Meena Patel",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg",
            rating: 5,
            date: "2023-08-05",
            comment: "These peppers are amazing! So much better than what I find at the supermarket."
          }
        ],
        farmer: {
          id: 123,
          name: "Suresh Verma",
          location: "Nashik, Maharashtra",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          rating: 4.8,
          verified: true
        },
        farmingMethod: "Natural Farming (No pesticides, No chemicals)",
        certifications: ["PGS-India Certified", "Organic"],
        harvestDate: "2023-08-01",
        nutritionalInfo: {
          "Calories": "31 kcal",
          "Carbs": "6g",
          "Protein": "1g",
          "Fat": "0.3g",
          "Fiber": "2.1g",
          "Vitamin C": "169% of Daily Value"
        },
        relatedProducts: [2, 5, 8, 12]
      };

      setProduct(mockProduct);
      setActiveImage(mockProduct.image);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.quantity || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product?.name} to cart`);
    // Implement actual cart functionality here
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Product Not Found</h2>
        <p className="text-text-light mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-6 text-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="text-primary hover:text-primary-dark flex items-center mr-4"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
        <Link to="/" className="text-text-light hover:text-primary">Home</Link>
        <span className="mx-2 text-text-light">/</span>
        <Link to="/products" className="text-text-light hover:text-primary">Products</Link>
        <span className="mx-2 text-text-light">/</span>
        <span className="text-text">{product.name}</span>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 rounded-lg overflow-hidden shadow-medium">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.gallery.map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                  activeImage === image ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setActiveImage(image)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`} 
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="flex items-center mb-1">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                {product.category}
              </span>
              {product.inStock ? (
                <span className="bg-success/10 text-success px-2 py-0.5 rounded text-sm font-medium ml-2">
                  In Stock
                </span>
              ) : (
                <span className="bg-error/10 text-error px-2 py-0.5 rounded text-sm font-medium ml-2">
                  Out of Stock
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderStarRating(product.rating)}
                <span className="ml-1 text-text">{product.rating}</span>
              </div>
              <span className="mx-2 text-text-light">•</span>
              <span className="text-text-light">{product.reviewCount} reviews</span>
            </div>
            <p className="text-text-light mb-4">{product.description}</p>
            <div className="flex items-center mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-text">₹{product.salePrice}</span>
                  <span className="ml-2 text-text-light line-through">₹{product.price}</span>
                  <span className="ml-2 bg-accent/10 text-accent px-2 py-0.5 rounded text-sm font-medium">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-text">₹{product.price}</span>
              )}
              <span className="ml-2 text-text-light">per {product.unit}</span>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <button 
                  className="h-10 w-10 rounded-l-lg bg-gray-100 border border-border flex items-center justify-center text-text hover:bg-gray-200"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="h-10 w-20 border-y border-border text-center focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button 
                  className="h-10 w-10 rounded-r-lg bg-gray-100 border border-border flex items-center justify-center text-text hover:bg-gray-200"
                  onClick={() => quantity < product.quantity && setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <button 
                className="btn-primary flex items-center"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <FiShoppingCart className="mr-2" />
                Add to Cart
              </button>
              
              <button 
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-gray-100"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <FiHeart className={isFavorite ? "text-error fill-current" : ""} />
              </button>
              
              <button className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-gray-100">
                <FiShare2 />
              </button>
            </div>
            
            {/* Farmer Info */}
            <div className="border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <img 
                  src={product.farmer.image} 
                  alt={product.farmer.name} 
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-text">{product.farmer.name}</h3>
                    {product.farmer.verified && (
                      <span className="ml-2 text-primary" title="Verified Farmer">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <FiMapPin className="mr-1 text-text-light" />
                    <span className="text-text-light">{product.farmer.location}</span>
                  </div>
                </div>
                <Link 
                  to={`/farmers/${product.farmer.id}`} 
                  className="ml-auto text-primary hover:text-primary-dark text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
            
            {/* Product Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                  <FiBarChart2 className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text text-sm">Farming Method</h4>
                  <p className="text-text-light text-sm">{product.farmingMethod}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                  <FiCalendar className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text text-sm">Harvest Date</h4>
                  <p className="text-text-light text-sm">{product.harvestDate}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                  <FiCheck className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text text-sm">Certifications</h4>
                  <p className="text-text-light text-sm">{product.certifications.join(', ')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                  <FiInfo className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text text-sm">Trace Product</h4>
                  <button className="text-primary hover:text-primary-dark text-sm">
                    Scan QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-12">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'description'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'nutritional'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
              onClick={() => setActiveTab('nutritional')}
            >
              Nutritional Info
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-text-light">
              <p className="whitespace-pre-line">{product.longDescription}</p>
            </div>
          )}

          {activeTab === 'nutritional' && (
            <div>
              <h3 className="text-lg font-medium text-text mb-4">Nutritional Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(product.nutritionalInfo).map(([nutrient, value]) => (
                  <div key={nutrient} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-text-light text-sm">{nutrient}</p>
                    <p className="text-text font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-text">Customer Reviews</h3>
                <button className="btn-outline">Write a Review</button>
              </div>
              
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <img 
                        src={review.avatar} 
                        alt={review.user} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-text">{review.user}</h4>
                          <span className="mx-2 text-text-light">•</span>
                          <span className="text-text-light text-sm">{review.date}</span>
                        </div>
                        <div className="flex items-center">
                          {renderStarRating(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-light">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              {product.reviewCount > product.reviews.length && (
                <div className="text-center mt-6">
                  <button className="btn-outline">Load More Reviews</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-xl font-bold text-text mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* This would be populated with actual related products */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card shadow-medium overflow-hidden">
              <div className="h-48 bg-gray-100 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-100 animate-pulse mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-100 animate-pulse mb-4"></div>
                <div className="h-5 bg-gray-100 animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 