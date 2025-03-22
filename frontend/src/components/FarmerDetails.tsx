import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiExternalLink, FiCheck, FiStar, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';

type FarmingMethod = 'Natural Farming' | 'Organic Farming' | 'Traditional Farming' | 'Biodynamic Farming';

interface FarmerProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface FarmerDetails {
  id: number;
  name: string;
  location: string;
  state: string;
  image: string;
  coverImage: string;
  description: string;
  longDescription: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  farmingMethods: FarmingMethod[];
  productCategories: string[];
  certifications: string[];
  gallery: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  farmSize: string;
  farmingExperience: string;
  products: FarmerProduct[];
  story: string;
}

const FarmerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<FarmerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'story' | 'gallery'>('about');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate fetching farmer data
    setLoading(true);
    setTimeout(() => {
      // Mock data for a single farmer
      const mockFarmer: FarmerDetails = {
        id: 1,
        name: "Ramesh Patel",
        location: "Anand, Gujarat",
        state: "Gujarat",
        image: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=400&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop",
        description: "Third-generation natural farmer specializing in organic dairy and vegetable production",
        longDescription: "Ramesh has been practicing organic farming for over 20 years, following in the footsteps of his father and grandfather. His farm in Anand, Gujarat spans 10 acres where he grows seasonal vegetables using traditional methods and maintains a small herd of indigenous cows for dairy production.",
        isVerified: true,
        rating: 4.8,
        reviewCount: 127,
        joinedDate: "June 2020",
        farmingMethods: ["Organic Farming", "Traditional Farming"],
        productCategories: ["Vegetables", "Dairy", "Grains"],
        certifications: ["NPOP Certified", "PGS-India"],
        gallery: [
          "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1465844801368-13446ea9cf12?w=600&auto=format&fit=crop"
        ],
        contactInfo: {
          email: "ramesh.patel@example.com",
          phone: "+91 98765 43210",
          website: "www.rameshorganics.com"
        },
        farmSize: "10 acres",
        farmingExperience: "20+ years",
        products: [
          {
            id: 1,
            name: "Organic Desi Ghee",
            description: "Pure ghee made from A2 milk of indigenous cows",
            price: 950,
            image: "https://images.unsplash.com/photo-1589352611772-52a496a2bf54?w=400&auto=format&fit=crop",
            category: "Dairy",
            rating: 4.9
          },
          {
            id: 2,
            name: "Organic Turmeric Powder",
            description: "Hand-harvested and sun-dried turmeric with high curcumin content",
            price: 250,
            image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&auto=format&fit=crop",
            category: "Spices",
            rating: 4.7
          },
          {
            id: 3,
            name: "Red Amaranth",
            description: "Freshly harvested red amaranth leaves",
            price: 60,
            image: "https://images.unsplash.com/photo-1576021820853-8d9abc4c8500?w=400&auto=format&fit=crop",
            category: "Vegetables",
            rating: 4.6
          },
          {
            id: 4,
            name: "Organic Wheat Flour",
            description: "Stone-ground wheat flour from traditionally grown wheat",
            price: 120,
            image: "https://images.unsplash.com/photo-1603046891744-8159348281df?w=400&auto=format&fit=crop",
            category: "Grains",
            rating: 4.5
          }
        ],
        story: "My journey into natural farming began when I was just a boy, watching my grandfather tend to our ancestral land. He taught me that the soil is alive, and that our role as farmers is to work in harmony with nature, not against it.\n\nAfter completing my agricultural studies, I returned to our family farm with new knowledge but deeply rooted in traditional wisdom. I decided to reject chemical farming methods that were becoming popular and instead focused on reviving the traditional methods that had sustained our land for generations.\n\nOne of the biggest challenges I faced was lower initial yields compared to chemical farming. But over time, as the soil health improved, so did our harvests. Now, our produce is sought after for its superior taste and nutritional quality.\n\nI started with just dairy production, but gradually expanded to growing indigenous varieties of vegetables and grains. Today, my farm is a diverse ecosystem where crops, livestock, and wild plants coexist, creating a natural balance.\n\nJoining Farm Fresh has allowed me to connect directly with consumers who value the care and tradition that goes into our products. I'm proud to say that my children are now learning these methods as well, ensuring that our farming heritage continues for another generation."
      };
      setFarmer(mockFarmer);
      setLoading(false);
    }, 1000);
  }, [id]);

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } w-4 h-4`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Farmer Not Found</h2>
        <p className="text-text-light mb-8">The farmer you're looking for doesn't exist or may have been removed.</p>
        <Link to="/farmers" className="btn-primary">
          Browse All Farmers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Cover Image */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative">
        <img 
          src={farmer.coverImage} 
          alt={`${farmer.name}'s farm`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex space-x-2">
            <li><Link to="/" className="text-text-light hover:text-primary">Home</Link></li>
            <li><span className="text-text-light mx-2">/</span></li>
            <li><Link to="/farmers" className="text-text-light hover:text-primary">Farmers</Link></li>
            <li><span className="text-text-light mx-2">/</span></li>
            <li className="text-text font-medium">{farmer.name}</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with farmer info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card shadow-medium overflow-hidden">
                <div className="text-center pt-6 px-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-medium mb-4">
                    <img src={farmer.image} alt={farmer.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-text mb-1">{farmer.name}</h1>
                  
                  <div className="flex items-center justify-center mb-2">
                    <FiMapPin className="text-primary mr-1" />
                    <span className="text-text-light">{farmer.location}</span>
                  </div>
                  
                  {farmer.isVerified && (
                    <div className="flex items-center justify-center text-success mb-4">
                      <FiCheck className="mr-1" />
                      <span className="text-sm font-medium">Verified Farmer</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex mr-1">
                      {renderStarRating(farmer.rating)}
                    </div>
                    <span className="text-text-light text-sm">
                      ({farmer.rating}) · {farmer.reviewCount} reviews
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-border p-6 space-y-4">
                  <div>
                    <h3 className="text-sm text-text-light uppercase mb-2">Farming Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {farmer.farmingMethods.map((method) => (
                        <span key={method} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-text-light uppercase mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {farmer.certifications.map((cert) => (
                        <span key={cert} className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-text-light uppercase mb-1">Member Since</h3>
                      <div className="flex items-center">
                        <FiCalendar className="text-primary mr-1" />
                        <span className="text-text">{farmer.joinedDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-text-light uppercase mb-1">Farm Size</h3>
                      <span className="text-text">{farmer.farmSize}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-text-light uppercase mb-1">Experience</h3>
                      <span className="text-text">{farmer.farmingExperience}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-text-light uppercase mb-1">Products</h3>
                      <div className="flex items-center">
                        <FiPackage className="text-primary mr-1" />
                        <span className="text-text">{farmer.products.length} Products</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-text-light uppercase mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-text flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {farmer.contactInfo.email}
                      </p>
                      <p className="text-text flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {farmer.contactInfo.phone}
                      </p>
                      {farmer.contactInfo.website && (
                        <a 
                          href={`https://${farmer.contactInfo.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {farmer.contactInfo.website}
                          <FiExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 border-b border-border">
              <div className="flex space-x-6">
                <button 
                  onClick={() => setActiveTab('about')} 
                  className={`pb-4 px-2 font-medium relative ${activeTab === 'about' ? 'text-primary' : 'text-text-light hover:text-text'}`}
                >
                  About
                  {activeTab === 'about' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('products')} 
                  className={`pb-4 px-2 font-medium relative ${activeTab === 'products' ? 'text-primary' : 'text-text-light hover:text-text'}`}
                >
                  Products
                  {activeTab === 'products' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('story')} 
                  className={`pb-4 px-2 font-medium relative ${activeTab === 'story' ? 'text-primary' : 'text-text-light hover:text-text'}`}
                >
                  Farmer's Story
                  {activeTab === 'story' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('gallery')} 
                  className={`pb-4 px-2 font-medium relative ${activeTab === 'gallery' ? 'text-primary' : 'text-text-light hover:text-text'}`}
                >
                  Gallery
                  {activeTab === 'gallery' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Tab content */}
            <div className="mb-8">
              {/* About Tab */}
              {activeTab === 'about' && (
                <div>
                  <h2 className="text-xl font-bold text-text mb-4">About {farmer.name}</h2>
                  <p className="text-text-light mb-6">{farmer.longDescription}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="card shadow-soft p-6">
                      <h3 className="text-lg font-semibold text-text mb-3">Product Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {farmer.productCategories.map((category) => (
                          <span key={category} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="card shadow-soft p-6">
                      <h3 className="text-lg font-semibold text-text mb-3">Farming Philosophy</h3>
                      <p className="text-text-light">
                        Committed to sustainable agriculture practices that prioritize soil health, 
                        biodiversity, and traditional knowledge systems passed down through generations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-text mb-4">Farming Practices</h3>
                    <div className="card shadow-soft p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-text mb-2">Soil Management</h4>
                          <p className="text-text-light">
                            Uses natural compost, vermicompost, and green manures. Practices crop rotation 
                            and minimal tillage to maintain soil structure and biodiversity.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-text mb-2">Pest Management</h4>
                          <p className="text-text-light">
                            Implements integrated pest management with natural predators and neem-based solutions. 
                            Maintains buffer zones for beneficial insects.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-text mb-2">Water Conservation</h4>
                          <p className="text-text-light">
                            Utilizes drip irrigation, rainwater harvesting, and traditional water conservation 
                            techniques to minimize water usage.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-text mb-2">Seed Preservation</h4>
                          <p className="text-text-light">
                            Maintains a seed bank of indigenous varieties, practicing seed saving and exchange 
                            with other local farmers to preserve biodiversity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <h2 className="text-xl font-bold text-text mb-6">Products from {farmer.name}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {farmer.products.map(product => (
                      <div key={product.id} className="card shadow-medium overflow-hidden">
                        <div className="aspect-video overflow-hidden bg-white">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-text">{product.name}</h3>
                            <div className="flex items-center">
                              {renderStarRating(product.rating)}
                              <span className="text-text-light text-sm ml-1">{product.rating}</span>
                            </div>
                          </div>
                          <p className="text-text-light text-sm mb-3">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-primary font-semibold">₹{product.price}</span>
                            <Link to={`/products/${product.id}`} className="btn-primary-small">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Link to={`/products?farmer=${farmer.id}`} className="btn-outline">
                      View All Products
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Story Tab */}
              {activeTab === 'story' && (
                <div>
                  <h2 className="text-xl font-bold text-text mb-4">{farmer.name}'s Farming Journey</h2>
                  
                  <div className="card shadow-medium overflow-hidden mb-6">
                    <img 
                      src={farmer.gallery[0]} 
                      alt={`${farmer.name}'s farm`} 
                      className="w-full h-64 object-cover" 
                    />
                  </div>
                  
                  <div className="text-text-light space-y-4">
                    {farmer.story.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div>
                  <h2 className="text-xl font-bold text-text mb-6">Farm Gallery</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {farmer.gallery.map((image, index) => (
                      <div key={index} className="aspect-video overflow-hidden rounded-lg shadow-medium">
                        <img 
                          src={image} 
                          alt={`${farmer.name}'s farm - image ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Call to action */}
            <div className="card shadow-medium p-6 bg-gradient-to-r from-primary/10 to-secondary/5">
              <h3 className="text-lg font-semibold text-text mb-3">Support {farmer.name}'s Natural Farming</h3>
              <p className="text-text-light mb-4">
                By purchasing products directly from {farmer.name}, you're supporting sustainable 
                farming practices and helping preserve traditional agricultural knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/products?farmer=${farmer.id}`} className="btn-primary">
                  Browse Products
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetails; 