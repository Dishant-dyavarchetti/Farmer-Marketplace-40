import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container-custom py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">About Farm Fresh</h1>
        <p className="text-text-light max-w-3xl mx-auto text-lg">
          Connecting natural farmers directly with conscious consumers through transparency,
          trust, and traceability.
        </p>
      </div>
      
      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl font-bold text-text mb-4">Our Mission</h2>
          <p className="text-text-light mb-4">
            Farm Fresh was founded with a clear purpose: to bridge the gap between farmers practicing natural 
            farming and consumers seeking authentic, chemical-free produce.
          </p>
          <p className="text-text-light mb-4">
            We believe that farmers deserve fair compensation for their sustainable practices, 
            and consumers deserve complete transparency about the food they eat.
          </p>
          <p className="text-text-light">
            Through our digital marketplace, we're creating a ecosystem that values authenticity, 
            sustainability, and direct relationships between producers and consumers.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-medium">
          <img 
            src="https://images.unsplash.com/photo-1594761051713-3bbe32331e1d?w=800&auto=format&fit=crop" 
            alt="Farmers working in field" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      
      {/* How it Works */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-text mb-8 text-center">How Farm Fresh Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card shadow-medium p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">Farmer Verification</h3>
            <p className="text-text-light">
              We verify farmers practicing natural farming methods and sustainable agriculture. 
              Our rigorous process ensures only authentic natural farmers can sell on our platform.
            </p>
          </div>
          
          <div className="card shadow-medium p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">QR Traceability</h3>
            <p className="text-text-light">
              Every product sold on Farm Fresh comes with a QR code that reveals its complete journey.
              Scan to view farming methods, harvesting date, farmer information, and certifications.
            </p>
          </div>
          
          <div className="card shadow-medium p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">Direct-to-Consumer</h3>
            <p className="text-text-light">
              We eliminate middlemen, allowing farmers to receive fair compensation while providing 
              consumers with fresher produce at better prices. Build direct relationships with the 
              people who grow your food.
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-text mb-6">For Farmers</h2>
            <ul className="space-y-4">
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Better Compensation</h3>
                  <p className="text-text-light">Earn 20-40% more by selling directly to consumers without middlemen.</p>
                </div>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Recognition</h3>
                  <p className="text-text-light">Get recognized for your sustainable farming practices and build your brand.</p>
                </div>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Stable Market</h3>
                  <p className="text-text-light">Access a dedicated customer base that values your natural farming methods.</p>
                </div>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Simplified Digital Presence</h3>
                  <p className="text-text-light">Easy-to-use platform designed specifically for farmers with limited technical knowledge.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-text mb-6">For Consumers</h2>
            <ul className="space-y-4">
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Authentic Products</h3>
                  <p className="text-text-light">Guaranteed access to genuinely natural and organic products verified at the source.</p>
                </div>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Complete Transparency</h3>
                  <p className="text-text-light">Know exactly where your food comes from, how it was grown, and who grew it.</p>
                </div>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Fresher Produce</h3>
                  <p className="text-text-light">Receive products directly from farms, ensuring maximum freshness and nutritional value.</p>
                </div>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-success mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-text">Support Sustainable Agriculture</h3>
                  <p className="text-text-light">Your purchases directly support farmers practicing environmentally friendly methods.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Verification Process */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-text mb-8 text-center">Our Verification Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card shadow-medium p-6 relative">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-full text-white font-bold flex items-center justify-center">1</div>
            <h3 className="text-lg font-semibold text-text mb-2 mt-2">Application</h3>
            <p className="text-text-light">
              Farmers submit basic information about their farm, location, and farming practices.
            </p>
          </div>
          
          <div className="card shadow-medium p-6 relative">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-full text-white font-bold flex items-center justify-center">2</div>
            <h3 className="text-lg font-semibold text-text mb-2 mt-2">Documentation</h3>
            <p className="text-text-light">
              Farmers provide proof of farming land ownership/lease, certifications (if available), and ID verification.
            </p>
          </div>
          
          <div className="card shadow-medium p-6 relative">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-full text-white font-bold flex items-center justify-center">3</div>
            <h3 className="text-lg font-semibold text-text mb-2 mt-2">Verification Visit</h3>
            <p className="text-text-light">
              Our team conducts an on-site verification to confirm natural farming practices.
            </p>
          </div>
          
          <div className="card shadow-medium p-6 relative">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-full text-white font-bold flex items-center justify-center">4</div>
            <h3 className="text-lg font-semibold text-text mb-2 mt-2">Certification</h3>
            <p className="text-text-light">
              Approved farmers receive digital certification and can start selling on the platform.
            </p>
          </div>
        </div>
      </div>
      
      {/* Certifications We Accept */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-text mb-8 text-center">Certifications We Recognize</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card shadow-medium p-6">
            <h3 className="text-xl font-semibold text-text mb-2 flex items-center">
              <span className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-2 text-sm">PGS</span>
              PGS-India
            </h3>
            <p className="text-text-light">
              Participatory Guarantee System of India, recognized by the Ministry of Agriculture for organic certification.
            </p>
          </div>
          
          <div className="card shadow-medium p-6">
            <h3 className="text-xl font-semibold text-text mb-2 flex items-center">
              <span className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-2 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              NPOP
            </h3>
            <p className="text-text-light">
              National Programme for Organic Production, established by the Government of India.
            </p>
          </div>
          
          <div className="card shadow-medium p-6">
            <h3 className="text-xl font-semibold text-text mb-2 flex items-center">
              <span className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center mr-2 text-sm">B</span>
              Demeter
            </h3>
            <p className="text-text-light">
              International certification for biodynamic farming practices.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="card shadow-medium bg-gradient-to-r from-primary/10 to-secondary-dark/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Join the Farm Fresh Movement</h2>
        <p className="text-text-light mb-6 max-w-2xl mx-auto">
          Whether you're a farmer practicing natural farming methods or a consumer looking for authentic, 
          chemical-free produce, join us in revolutionizing how food moves from farm to table.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary">
            Create an Account
          </Link>
          <Link to="/products" className="btn-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About; 