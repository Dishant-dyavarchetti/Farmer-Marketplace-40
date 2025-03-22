import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, registerFarmer, registerConsumer } from '../utils/api';

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

type LoginProps = {
  onGoBack?: () => void;
  onBack?: () => void;
  initialUserType?: UserType;
  userType?: UserType;
  initialIsLogin?: boolean;
  isRegistering?: boolean;
  onLoginSuccess?: (userData: UserInfo) => void;
};

const Login = ({ 
  onGoBack, 
  onBack,
  initialUserType = 'consumer', 
  userType = 'consumer',
  initialIsLogin = true,
  isRegistering = false,
  onLoginSuccess
}: LoginProps) => {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  
  // Farmer-specific fields
  const [farmLocation, setFarmLocation] = useState('');
  const [originState, setOriginState] = useState('');
  
  // UI state
  const [activeUserType, setActiveUserType] = useState<UserType>(userType || initialUserType);
  const [isLogin, setIsLogin] = useState(initialIsLogin || !isRegistering);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Update state if props change
  useEffect(() => {
    if (userType) {
      setActiveUserType(userType);
    } else if (initialUserType) {
      setActiveUserType(initialUserType);
    }
    
    if (isRegistering !== undefined) {
      setIsLogin(!isRegistering);
    } else if (initialIsLogin !== undefined) {
      setIsLogin(initialIsLogin);
    }
  }, [userType, initialUserType, isRegistering, initialIsLogin]);

  // Reset form when switching between login and register
  useEffect(() => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setAddress('');
    setFarmLocation('');
    setOriginState('');
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  }, [isLogin, activeUserType]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await login(username, password, activeUserType);
      
      // Store auth token and user data in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data));
      
      setSuccess('Login successful!');
      
      // Notify parent component about successful login
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
      
      // Redirect to homepage after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare basic user data for both consumer and farmer
      const baseUserData = {
        user: {
          username,
          email,
          first_name: firstName,
          last_name: lastName
        },
        password,
        phone_number: phoneNumber || '', // Ensure it's not null/undefined
      };
      
      let userData: any;
      
      // Prepare type-specific data
      if (activeUserType === 'farmer') {
        userData = {
          ...baseUserData,
          farm_location: farmLocation || '',
          origin_state: originState || '',
          address: address || '',
        };
      } else {
        // Consumer data - simpler structure
        userData = {
          ...baseUserData,
          preferred_delivery_time: '', // Add a default value if needed
        };
      }
      
      // Use appropriate register function based on user type
      if (activeUserType === 'farmer') {
        await registerFarmer(userData);
      } else {
        await registerConsumer(userData);
      }
      
      setSuccess('Registration successful! Please log in.');
      setIsLogin(true);
      
      // Clear form fields after successful registration
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setAddress('');
      setFarmLocation('');
      setOriginState('');
      
    } catch (err) {
      console.error('Registration error:', err);
      // Check if it's an error object with a message property
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null) {
        // Try to stringify the error object
        try {
          setError(JSON.stringify(err));
        } catch (e) {
          setError('Failed to register. Please check the console for details.');
        }
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isLogin ? handleLogin : handleRegister;

  // Toggle between user types
  const handleUserTypeChange = (type: UserType) => {
    setActiveUserType(type);
  };

  // Go back to previous page
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (onGoBack) {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  // Toggle between login and register forms
  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-light to-background py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        <div>
          {(onGoBack || onBack) && (
            <button 
              onClick={handleGoBack}
              className="flex items-center text-primary hover:text-primary-dark mb-4 group"
              aria-label="Back"
            >
              <svg className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
          
          <div className="flex justify-center mb-4">
            <img src="/logo.png" className="h-16 w-auto" alt="Farm Fresh Logo" />
          </div>
          
          <h2 className="mt-2 text-center text-3xl font-extrabold text-text">
            {isLogin ? 'Welcome back!' : 'Join Farm Fresh'}
          </h2>
          <p className="mt-2 text-center text-sm text-text-light">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="font-medium text-primary hover:text-primary-dark"
              onClick={toggleLoginRegister}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-50 p-4 animate-fade-in">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="rounded-lg bg-green-50 p-4 animate-fade-in">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-sm text-green-700">{success}</div>
            </div>
          </div>
        )}
        
        <div className="mt-6 card shadow-medium border-none">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              className={`px-4 py-2 rounded-full transition-all ${
                activeUserType === 'farmer' 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'bg-neutral-light text-text-light hover:bg-secondary'
              }`}
              onClick={() => handleUserTypeChange('farmer')}
            >
              Farmer
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-full transition-all ${
                activeUserType === 'consumer' 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'bg-neutral-light text-text-light hover:bg-secondary'
              }`}
              onClick={() => handleUserTypeChange('consumer')}
            >
              Consumer
            </button>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-text">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field mt-1"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-text">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field mt-1"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field mt-1"
                placeholder="username"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field mt-1"
                  placeholder="email@example.com"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-text">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field mt-1"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                {activeUserType === 'farmer' && (
                  <>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-text">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input-field mt-1"
                        placeholder="Street, City, State, Zip"
                      />
                    </div>

                    <div>
                      <label htmlFor="farmLocation" className="block text-sm font-medium text-text">
                        Farm Location
                      </label>
                      <input
                        id="farmLocation"
                        name="farmLocation"
                        type="text"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        className="input-field mt-1"
                        placeholder="Farm location or name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="originState" className="block text-sm font-medium text-text">
                        Origin State
                      </label>
                      <input
                        id="originState"
                        name="originState"
                        type="text"
                        value={originState}
                        onChange={(e) => setOriginState(e.target.value)}
                        className="input-field mt-1"
                        placeholder="State"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center btn-primary py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  'Sign in'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
          
          {isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-light">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-neutral rounded-md shadow-soft bg-white text-sm font-medium text-text hover:bg-secondary-light transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </a>

                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-neutral rounded-md shadow-soft bg-white text-sm font-medium text-text hover:bg-secondary-light transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17,2 L7,2 C5.9,2 5,2.9 5,4 L5,20 C5,21.1 5.9,22 7,22 L17,22 C18.1,22 19,21.1 19,20 L19,4 C19,2.9 18.1,2 17,2 Z M7,4 L17,4 L17,18 L7,18 L7,4 Z M12,20 C11.45,20 11,19.55 11,19 C11,18.45 11.45,18 12,18 C12.55,18 13,18.45 13,19 C13,19.55 12.55,20 12,20 Z"/>
                  </svg>
                  Phone
                </a>
              </div>

              <p className="text-xs text-center text-text-light mt-4">
                By signing in, you agree to our
                <a href="#" className="text-primary hover:text-primary-dark"> Terms of Service </a>
                and 
                <a href="#" className="text-primary hover:text-primary-dark"> Privacy Policy</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 