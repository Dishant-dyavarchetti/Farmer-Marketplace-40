import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Types
type ProductCategory = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  farmer: {
    id: string;
    name: string;
    isVerified: boolean;
    location: string;
  };
  rating: number;
  isCertified: boolean;
  inStock: boolean;
  certifications: string[];
  farmingMethod: string;
  harvestedDate?: string;
}

const Products = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('rating');

  // Sample data
  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      description: 'Fresh, naturally grown tomatoes without pesticides',
      price: 45,
      image: 'https://images.unsplash.com/photo-1592924357229-53abc52d7746?w=800&auto=format&fit=crop',
      category: 'vegetables',
      farmer: {
        id: 'f1',
        name: 'Green Valley Farm',
        isVerified: true,
        location: 'Karnataka'
      },
      rating: 4.8,
      isCertified: true,
      inStock: true,
      certifications: ['PGS-India', 'NPOP'],
      farmingMethod: 'Natural Farming',
      harvestedDate: '2023-10-15'
    },
    {
      id: '2',
      name: 'Fresh Spinach Bundle',
      description: 'Nutrient-rich spinach grown using traditional methods',
      price: 30,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop',
      category: 'vegetables',
      farmer: {
        id: 'f2',
        name: 'Sunshine Organics',
        isVerified: true,
        location: 'Tamil Nadu'
      },
      rating: 4.5,
      isCertified: true,
      inStock: true,
      certifications: ['PGS-India'],
      farmingMethod: 'Organic Farming'
    },
    {
      id: '3',
      name: 'Desi Wheat Flour',
      description: 'Stone-ground flour from traditionally grown wheat',
      price: 120,
      image: 'https://images.unsplash.com/photo-1568719306338-06c3ed4a9752?w=800&auto=format&fit=crop',
      category: 'grains',
      farmer: {
        id: 'f3',
        name: 'Heritage Farms',
        isVerified: true,
        location: 'Punjab'
      },
      rating: 4.9,
      isCertified: true,
      inStock: true,
      certifications: ['NPOP', 'Demeter'],
      farmingMethod: 'Biodynamic Farming'
    },
    {
      id: '4',
      name: 'Alphonso Mangoes',
      description: 'Premium naturally ripened mangoes',
      price: 300,
      image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&auto=format&fit=crop',
      category: 'fruits',
      farmer: {
        id: 'f4',
        name: 'Coastal Orchards',
        isVerified: false,
        location: 'Maharashtra'
      },
      rating: 4.7,
      isCertified: false,
      inStock: true,
      certifications: [],
      farmingMethod: 'Traditional Farming'
    },
    {
      id: '5',
      name: 'Farm Fresh Milk',
      description: 'Cow milk from grass-fed cows',
      price: 70,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop',
      category: 'dairy',
      farmer: {
        id: 'f5',
        name: 'Happy Cows Dairy',
        isVerified: true,
        location: 'Gujarat'
      },
      rating: 4.6,
      isCertified: true,
      inStock: false,
      certifications: ['PGS-India'],
      farmingMethod: 'Organic Farming'
    },
    {
      id: '6',
      name: 'Rice Variety Pack',
      description: 'Traditional varieties of rice grown naturally',
      price: 250,
      image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop',
      category: 'grains',
      farmer: {
        id: 'f6',
        name: 'Rice Heritage',
        isVerified: true,
        location: 'West Bengal'
      },
      rating: 4.9,
      isCertified: true,
      inStock: true,
      certifications: ['NPOP', 'PGS-India'],
      farmingMethod: 'Natural Farming'
    }
  ];

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Filter by search term
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by certification
    if (certifiedOnly && !product.isCertified) {
      return false;
    }
    
    // Filter by stock
    if (inStockOnly && !product.inStock) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort based on selected option
    switch (sortOption) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.harvestedDate || '').getTime() - new Date(a.harvestedDate || '').getTime();
      default:
        return 0;
    }
  });

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="container-custom py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Farm Fresh Products</h1>
        <p className="text-text-light max-w-3xl mx-auto">
          Discover naturally grown and organic products directly from verified farmers. 
          Each product comes with complete transparency about its source and farming methods.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="card shadow-medium p-5 sticky top-24">
            <h2 className="text-lg font-semibold text-text mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-text-light mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, description..."
                  className="input-field w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-light mb-2">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                  />
                  <span className="ml-2 text-text">All Categories</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedCategory === 'vegetables'}
                    onChange={() => setSelectedCategory('vegetables')}
                  />
                  <span className="ml-2 text-text">Vegetables</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedCategory === 'fruits'}
                    onChange={() => setSelectedCategory('fruits')}
                  />
                  <span className="ml-2 text-text">Fruits</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedCategory === 'grains'}
                    onChange={() => setSelectedCategory('grains')}
                  />
                  <span className="ml-2 text-text">Grains</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedCategory === 'dairy'}
                    onChange={() => setSelectedCategory('dairy')}
                  />
                  <span className="ml-2 text-text">Dairy</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedCategory === 'other'}
                    onChange={() => setSelectedCategory('other')}
                  />
                  <span className="ml-2 text-text">Other</span>
                </label>
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-light mb-2">
                Price Range (₹{priceRange[0]} - ₹{priceRange[1]})
              </h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Additional Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-light mb-2">Additional Filters</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-primary"
                    checked={certifiedOnly}
                    onChange={() => setCertifiedOnly(!certifiedOnly)}
                  />
                  <span className="ml-2 text-text">Certified Products Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-primary"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <span className="ml-2 text-text">In Stock Only</span>
                </label>
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-text-light mb-2">Sort By</h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="input-field w-full"
              >
                <option value="rating">Rating (Highest)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 card shadow-medium">
              <svg className="w-16 h-16 text-neutral-dark mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-text mb-2">No Products Found</h3>
              <p className="text-text-light mb-6">
                No products match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange([0, 1000]);
                  setCertifiedOnly(false);
                  setInStockOnly(true);
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card shadow-medium overflow-hidden hover:shadow-large transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-error/80 text-white text-xs font-medium px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                    {product.isCertified && (
                      <div className="absolute top-2 left-2 bg-success/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Certified
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-text">{product.name}</h3>
                      <span className="text-primary font-bold">₹{product.price}</span>
                    </div>
                    
                    <p className="text-text-light text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                        {product.farmingMethod}
                      </span>
                      {product.certifications.length > 0 && (
                        <span className="ml-2 bg-secondary-dark/10 text-text-light text-xs rounded-full px-2 py-0.5">
                          {product.certifications.join(', ')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                        <span className="ml-1 text-xs text-text-light">({product.rating})</span>
                      </div>
                      {product.harvestedDate && (
                        <span className="text-xs text-text-light">
                          Harvested: {new Date(product.harvestedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="border-t border-neutral pt-3">
                      <Link to={`/farmers/${product.farmer.id}`} className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-white font-medium">
                          {product.farmer.name[0]}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-text">{product.farmer.name}</p>
                          <div className="flex items-center">
                            <span className="text-xs text-text-light">{product.farmer.location}</span>
                            {product.farmer.isVerified && (
                              <svg className="w-3 h-3 ml-1 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Link to={`/products/${product.id}`} className="btn-primary flex-1 py-2 text-center text-sm">
                          View Details
                        </Link>
                        <button 
                          className={`btn-outline flex-1 py-2 text-sm ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!product.inStock}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 