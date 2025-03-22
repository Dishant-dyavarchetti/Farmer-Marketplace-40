import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Testimonial type
type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
};

// Featured product type
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  farmer: string;
  location: string;
  rating: number;
};

const Home = () => {
  // Sample featured products
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Organic Mixed Vegetables Basket",
      description: "Fresh assortment of seasonal vegetables, pesticide-free and naturally grown.",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      farmer: "Green Acres Farm",
      location: "Sonoma County",
      rating: 4.8
    },
    {
      id: 2,
      name: "Farm Fresh Eggs (Dozen)",
      description: "Free-range eggs from pasture-raised chickens. Rich in flavor and nutrients.",
      price: "$6.99",
      image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      farmer: "Sunrise Poultry",
      location: "Marin County",
      rating: 4.9
    },
    {
      id: 3,
      name: "Organic Honey (16oz)",
      description: "Raw, unfiltered wildflower honey from local beekeepers. No additives.",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      farmer: "Busy Bee Apiaries",
      location: "Napa Valley",
      rating: 5.0
    }
  ];

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      content: "Farm Fresh has completely changed how I shop for produce. The quality is exceptional, and I love knowing exactly where my food comes from.",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Chef",
      content: "As a professional chef, I'm particular about ingredients. The produce from Farm Fresh consistently exceeds my expectations and elevates my dishes.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Health Enthusiast",
      content: "I've noticed a significant difference in the taste and nutritional value of organic products from Farm Fresh compared to supermarket options.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  // Current testimonial index
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Next testimonial
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  // Previous testimonial
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Render stars for ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section with CTA */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 md:py-28 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="2"></path>
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#grid)"></rect>
          </svg>
        </div>
        
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-20" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" }}>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow">Farm Fresh Marketplace</h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">Direct from farm to table with transparency and trust. Support local farmers and enjoy the freshest, most nutritious produce available.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products" className="btn-white group">
                <span className="flex items-center justify-center">
                  Browse Products
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link to="/farmers" className="btn-accent">
                Meet Our Farmers
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 text-background">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="h-full w-full">
            <path fill="currentColor" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,170.7C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text relative inline-block">
              Why Choose Farm Fresh?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text">Quality Produce</h3>
              <p className="text-text-light">Fresh, natural and nutritious produce from verified local farmers. Free from harmful chemicals and picked at peak ripeness.</p>
            </div>
            
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text">Fast Delivery</h3>
              <p className="text-text-light">From farm to your doorstep in the shortest possible time, preserving freshness and nutritional value of every product.</p>
            </div>
            
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text">Support Local Farmers</h3>
              <p className="text-text-light">Your purchase directly supports the livelihoods of local farmers, sustaining rural communities and traditional farming.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary-light">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-text">Featured Products</h2>
            <Link to="/products" className="text-primary hover:text-primary-dark font-medium flex items-center">
              View All Products
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white text-sm py-1 px-2 rounded-full">
                    Fresh
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-text">{product.name}</h3>
                    <span className="font-bold text-lg text-primary">{product.price}</span>
                  </div>
                  <p className="text-text-light mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-text-light">{product.location}</span>
                    </div>
                    <div>
                      {renderStars(product.rating)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-text-light flex items-center">
                      <span>By {product.farmer}</span>
                    </div>
                    <button className="btn-primary text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text relative inline-block">
              What Our Customers Say
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-xl shadow-medium p-8 border border-neutral-light">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-primary">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 27.2c-1.44 0-2.64-.48-3.616-1.408-.928-.976-1.392-2.24-1.392-3.744 0-1.056.288-2.176.864-3.296.624-1.12 1.504-2.128 2.64-3.04 1.136-.912 2.496-1.696 4.048-2.352 1.6-.656 3.392-1.056 5.376-1.2v3.84c-1.536.096-2.88.448-4 1.056-1.12.56-1.968 1.248-2.56 2.08.704-.224 1.328-.336 1.888-.336 1.504 0 2.72.48 3.648 1.44.928.96 1.408 2.176 1.408 3.632 0 1.504-.48 2.72-1.44 3.68-.96.96-2.224 1.44-3.776 1.44zm16 0c-1.44 0-2.64-.48-3.616-1.408-.928-.976-1.392-2.24-1.392-3.744 0-1.056.288-2.176.864-3.296.624-1.12 1.504-2.128 2.64-3.04 1.136-.912 2.496-1.696 4.048-2.352 1.6-.656 3.392-1.056 5.376-1.2v3.84c-1.536.096-2.88.448-4 1.056-1.12.56-1.968 1.248-2.56 2.08.704-.224 1.328-.336 1.888-.336 1.504 0 2.72.48 3.648 1.44.928.96 1.408 2.176 1.408 3.632 0 1.504-.48 2.72-1.44 3.68-.96.96-2.224 1.44-3.776 1.44z" />
                </svg>
              </div>
              
              <div className="pt-4">
                <p className="text-text-light text-lg italic leading-relaxed mb-6">{testimonials[currentTestimonial].content}</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonials[currentTestimonial].avatar} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-primary"
                  />
                  <div>
                    <h4 className="font-semibold text-text">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-text-light text-sm">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 flex space-x-2">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-neutral-light hover:bg-secondary text-text"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-neutral-light hover:bg-secondary text-text"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonalPattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M0 80L80 0M-20 20L20 -20M60 100L100 60" fill="none" stroke="white" strokeWidth="2"></path>
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#diagonalPattern)"></rect>
          </svg>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Farm Fresh Difference?</h2>
            <p className="text-lg mb-8 opacity-90">Join thousands of satisfied customers who have made the switch to healthier, fresher produce direct from local farms.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn-white">
                Create an Account
              </Link>
              <Link to="/products" className="btn-outline text-white border-white hover:bg-white/10">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 