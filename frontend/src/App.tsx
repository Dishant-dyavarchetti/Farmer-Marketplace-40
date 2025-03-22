import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import Products from './components/Products'
import Farmers from './components/Farmers'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
import ProductDetails from './components/ProductDetails'
import FarmerDetails from './components/FarmerDetails'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

type UserType = 'farmer' | 'consumer';
type UserInfo = {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  [key: string]: any;
};

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login'>('home');
  const [userType, setUserType] = useState<UserType>('consumer');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3); // Mock cart item count
  const { pathname } = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setIsLoggedIn(true);
        setUserInfo(userData);
      } catch (error) {
        // Invalid stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const showLoginPage = (type: UserType, register: boolean = false) => {
    setUserType(type);
    setIsRegistering(register);
    setCurrentPage('login');
  };

  const showHomePage = () => {
    setCurrentPage('home');
  };

  const handleLoginSuccess = (userData: UserInfo) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    showHomePage();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserInfo(null);
    showHomePage();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // If we're on the login page, show that
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-light to-background flex items-center justify-center p-4">
        <Login 
          userType={userType} 
          isRegistering={isRegistering} 
          onBack={showHomePage}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // Otherwise show the main app with router
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-background min-h-screen flex flex-col">
        <header className="bg-primary shadow-md sticky top-0 z-50">
          <div className="container-custom py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.5C12 18.5 20 13.5 20 8.5C20 7.04131 19.4205 5.64236 18.3891 4.61091C17.3576 3.57946 15.9587 3 14.5 3C13.3565 3 12.243 3.40758 11.3479 4.13122C11.1109 4.31374 10.8895 4.51957 10.6879 4.74849L10 5.5L9.31213 4.74849C9.11055 4.51957 8.88913 4.31374 8.65209 4.13122C7.757 3.40758 6.64348 3 5.5 3C4.04131 3 2.64236 3.57946 1.61091 4.61091C0.579462 5.64236 0 7.04131 0 8.5C0 13.5 8 18.5 8 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 2C20 2 21.5 3 22 5C22.5 7 22 10 19.5 10C17.5 10 17 7 18 6C18.8 5.2 20 6 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-white text-xl md:text-2xl font-bold">Farm Fresh</h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className={`text-lg hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : 'text-text'}`}>Home</Link>
                <Link to="/products" className={`text-lg hover:text-primary transition-colors ${pathname === '/products' ? 'text-primary font-medium' : 'text-text'}`}>Products</Link>
                <Link to="/farmers" className={`text-lg hover:text-primary transition-colors ${pathname === '/farmers' ? 'text-primary font-medium' : 'text-text'}`}>Farmers</Link>
                <Link to="/about" className={`text-lg hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary font-medium' : 'text-text'}`}>About</Link>
                <Link to="/contact" className={`text-lg hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary font-medium' : 'text-text'}`}>Contact</Link>
              </nav>
              
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/cart" 
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors relative"
                  aria-label="Shopping Cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                {isLoggedIn ? (
                  <>
                    <button 
                      onClick={handleLogout}
                      className="btn-outline text-white border-white hover:bg-white/10"
                    >
                      Logout
                    </button>
                    <Link 
                      to="/profile" 
                      className="btn-white"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Profile
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="btn-outline text-white border-white hover:bg-white/10"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn-white"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-white p-2" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-medium z-50 py-4 px-6 flex flex-col space-y-4 animate-fade-in">
                <Link to="/" className={`text-lg hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : 'text-text'}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/products" className={`text-lg hover:text-primary transition-colors ${pathname === '/products' ? 'text-primary font-medium' : 'text-text'}`} onClick={() => setIsMenuOpen(false)}>Products</Link>
                <Link to="/farmers" className={`text-lg hover:text-primary transition-colors ${pathname === '/farmers' ? 'text-primary font-medium' : 'text-text'}`} onClick={() => setIsMenuOpen(false)}>Farmers</Link>
                <Link to="/about" className={`text-lg hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary font-medium' : 'text-text'}`} onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/contact" className={`text-lg hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary font-medium' : 'text-text'}`} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <Link to="/cart" className={`text-lg hover:text-primary transition-colors flex items-center ${pathname === '/cart' ? 'text-primary font-medium' : 'text-text'}`} onClick={() => setIsMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                    <button onClick={() => {setIsLoggedIn(false); setIsMenuOpen(false);}} className="btn-outline w-full">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="btn-outline w-full text-center" onClick={() => setIsMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/farmers/:id" element={<FarmerDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/profile" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile userInfo={userInfo} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

export default App