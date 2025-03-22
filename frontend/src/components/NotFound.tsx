import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-custom py-16 text-center">
      <div className="mb-8">
        <span className="text-9xl font-bold text-primary opacity-20">404</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Page Not Found</h1>
      <p className="text-text-light max-w-lg mx-auto mb-8">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-primary">
          Go to Homepage
        </Link>
        <Link to="/products" className="btn-outline">
          Browse Products
        </Link>
        <Link to="/contact" className="btn-outline">
          Contact Support
        </Link>
      </div>
      
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-text mb-4">Looking for something?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card shadow-soft p-4 text-left">
            <h3 className="font-medium text-text mb-2">Popular Pages</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/products" className="text-primary hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/farmers" className="text-primary hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Our Farmers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="card shadow-soft p-4 text-left">
            <h3 className="font-medium text-text mb-2">Help &amp; Support</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/contact" className="text-primary hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 