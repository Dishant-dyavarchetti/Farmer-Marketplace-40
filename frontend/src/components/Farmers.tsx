import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Types
type FarmingMethod = 'Natural Farming' | 'Organic Farming' | 'Traditional Farming' | 'Biodynamic Farming';

interface Farmer {
  id: string;
  name: string;
  location: string;
  state: string;
  image: string;
  description: string;
  isVerified: boolean;
  rating: number;
  joinedDate: string;
  farmingMethods: FarmingMethod[];
  productCategories: string[];
  certifications: string[];
}

const Farmers = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedFarmingMethod, setSelectedFarmingMethod] = useState<FarmingMethod | 'all'>('all');
  const [sortOption, setSortOption] = useState<'rating' | 'newest'>('rating');

  // Sample data
  const farmers: Farmer[] = [
    {
      id: 'f1',
      name: 'Green Valley Farm',
      location: 'Mysore',
      state: 'Karnataka',
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&auto=format&fit=crop',
      description: 'Natural farming collective practicing traditional methods passed down through generations.',
      isVerified: true,
      rating: 4.8,
      joinedDate: '2022-03-15',
      farmingMethods: ['Natural Farming', 'Traditional Farming'],
      productCategories: ['Vegetables', 'Fruits', 'Herbs'],
      certifications: ['PGS-India', 'NPOP']
    },
    {
      id: 'f2',
      name: 'Sunshine Organics',
      location: 'Coimbatore',
      state: 'Tamil Nadu',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop',
      description: 'Family-run organic farm specializing in heirloom varieties and native crops.',
      isVerified: true,
      rating: 4.5,
      joinedDate: '2022-05-20',
      farmingMethods: ['Organic Farming'],
      productCategories: ['Vegetables', 'Grains'],
      certifications: ['PGS-India']
    },
    {
      id: 'f3',
      name: 'Heritage Farms',
      location: 'Amritsar',
      state: 'Punjab',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop',
      description: 'Biodynamic farm focusing on holistic growing practices and sustainable agriculture.',
      isVerified: true,
      rating: 4.9,
      joinedDate: '2021-11-10',
      farmingMethods: ['Biodynamic Farming', 'Natural Farming'],
      productCategories: ['Grains', 'Dairy', 'Vegetables'],
      certifications: ['NPOP', 'Demeter']
    },
    {
      id: 'f4',
      name: 'Coastal Orchards',
      location: 'Ratnagiri',
      state: 'Maharashtra',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop',
      description: 'Specialized in naturally grown fruits, especially mangoes and cashews from the coastal region.',
      isVerified: false,
      rating: 4.7,
      joinedDate: '2022-07-05',
      farmingMethods: ['Traditional Farming'],
      productCategories: ['Fruits', 'Nuts'],
      certifications: []
    },
    {
      id: 'f5',
      name: 'Happy Cows Dairy',
      location: 'Anand',
      state: 'Gujarat',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop',
      description: 'Organic dairy farm with grass-fed cows producing high-quality milk and milk products.',
      isVerified: true,
      rating: 4.6,
      joinedDate: '2022-01-15',
      farmingMethods: ['Organic Farming'],
      productCategories: ['Dairy'],
      certifications: ['PGS-India']
    },
    {
      id: 'f6',
      name: 'Rice Heritage',
      location: 'Kolkata',
      state: 'West Bengal',
      image: 'https://images.unsplash.com/photo-1508061333430-2a4c112a65a7?w=800&auto=format&fit=crop',
      description: 'Preserving indigenous rice varieties through natural farming techniques.',
      isVerified: true,
      rating: 4.9,
      joinedDate: '2021-09-30',
      farmingMethods: ['Natural Farming', 'Traditional Farming'],
      productCategories: ['Grains'],
      certifications: ['NPOP', 'PGS-India']
    }
  ];

  // Get unique states for filter
  const states = Array.from(new Set(farmers.map(farmer => farmer.state)));

  // Filter and sort farmers
  const filteredFarmers = farmers.filter(farmer => {
    // Filter by search term
    if (searchTerm && !farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !farmer.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by state
    if (selectedState !== 'all' && farmer.state !== selectedState) {
      return false;
    }
    
    // Filter by verification
    if (verifiedOnly && !farmer.isVerified) {
      return false;
    }
    
    // Filter by farming method
    if (selectedFarmingMethod !== 'all' && !farmer.farmingMethods.includes(selectedFarmingMethod)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort based on selected option
    switch (sortOption) {
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
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
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Our Farmers</h1>
        <p className="text-text-light max-w-3xl mx-auto">
          Connect with verified farmers practicing sustainable agriculture. 
          Each farmer follows natural farming methods to bring you chemical-free, fresh produce.
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
                Search Farmers
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, location..."
                  className="input-field w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 text-text-light absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* State Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-light mb-2">State</h3>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input-field w-full"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            {/* Farming Method */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-light mb-2">Farming Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedFarmingMethod === 'all'}
                    onChange={() => setSelectedFarmingMethod('all')}
                  />
                  <span className="ml-2 text-text">All Methods</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedFarmingMethod === 'Natural Farming'}
                    onChange={() => setSelectedFarmingMethod('Natural Farming')}
                  />
                  <span className="ml-2 text-text">Natural Farming</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedFarmingMethod === 'Organic Farming'}
                    onChange={() => setSelectedFarmingMethod('Organic Farming')}
                  />
                  <span className="ml-2 text-text">Organic Farming</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedFarmingMethod === 'Traditional Farming'}
                    onChange={() => setSelectedFarmingMethod('Traditional Farming')}
                  />
                  <span className="ml-2 text-text">Traditional Farming</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary"
                    checked={selectedFarmingMethod === 'Biodynamic Farming'}
                    onChange={() => setSelectedFarmingMethod('Biodynamic Farming')}
                  />
                  <span className="ml-2 text-text">Biodynamic Farming</span>
                </label>
              </div>
            </div>
            
            {/* Verification Filter */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary"
                  checked={verifiedOnly}
                  onChange={() => setVerifiedOnly(!verifiedOnly)}
                />
                <span className="ml-2 text-text">Verified Farmers Only</span>
              </label>
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
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Farmers grid */}
        <div className="lg:col-span-3">
          {filteredFarmers.length === 0 ? (
            <div className="text-center py-12 card shadow-medium">
              <svg className="w-16 h-16 text-neutral-dark mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-text mb-2">No Farmers Found</h3>
              <p className="text-text-light mb-6">
                No farmers match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedState('all');
                  setVerifiedOnly(false);
                  setSelectedFarmingMethod('all');
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFarmers.map((farmer) => (
                <div key={farmer.id} className="card shadow-medium overflow-hidden hover:shadow-large transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-white">{farmer.name}</h3>
                      <p className="text-white/90 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {farmer.location}, {farmer.state}
                      </p>
                    </div>
                    {farmer.isVerified && (
                      <div className="absolute top-3 right-3 bg-success/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        {renderStars(farmer.rating)}
                        <span className="ml-1 text-xs text-text-light">({farmer.rating})</span>
                      </div>
                      <span className="text-xs text-text-light">
                        Joined: {new Date(farmer.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-text-light text-sm mb-4 line-clamp-2">{farmer.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs uppercase font-medium text-text-light mb-1">Farming Methods</h4>
                        <div className="flex flex-wrap gap-1">
                          {farmer.farmingMethods.map((method, index) => (
                            <span key={index} className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs uppercase font-medium text-text-light mb-1">Products</h4>
                        <div className="flex flex-wrap gap-1">
                          {farmer.productCategories.map((category, index) => (
                            <span key={index} className="bg-secondary-dark/10 text-text-light text-xs rounded-full px-2 py-0.5">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {farmer.certifications.length > 0 && (
                        <div>
                          <h4 className="text-xs uppercase font-medium text-text-light mb-1">Certifications</h4>
                          <div className="flex flex-wrap gap-1">
                            {farmer.certifications.map((cert, index) => (
                              <span key={index} className="bg-success/10 text-success text-xs rounded-full px-2 py-0.5">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 border-t border-neutral pt-4">
                      <Link 
                        to={`/farmers/${farmer.id}`} 
                        className="btn-primary w-full flex items-center justify-center"
                      >
                        <span>View Profile</span>
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
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

export default Farmers; 