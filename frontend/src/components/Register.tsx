import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type UserType = 'farmer' | 'consumer';

type RegisterProps = {
  onRegisterSuccess?: () => void;
};

const Register = ({ onRegisterSuccess }: RegisterProps) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('consumer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  
  // Farmer specific fields
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [originState, setOriginState] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    // Additional validations for farmer
    if (userType === 'farmer' && (!farmName || !farmLocation || !originState)) {
      setError('Please complete your farm information');
      return;
    }
    
    setLoading(true);
    
    // Build registration data
    const userData = {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      phone_number: phoneNumber,
      address,
      ...(userType === 'farmer' && {
        farm_name: farmName,
        farm_location: farmLocation,
        origin_state: originState,
      }),
    };
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // API call would go here
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }
      
      // const data = await response.json();
      
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Clear fields
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setAddress('');
      setFarmName('');
      setFarmLocation('');
      setOriginState('');
      
      // Redirect to login after successful registration
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        } else {
          navigate('/login');
        }
      }, 2000);
      
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <div className="card shadow-medium border-none overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.5C12 18.5 20 13.5 20 8.5C20 7.04131 19.4205 5.64236 18.3891 4.61091C17.3576 3.57946 15.9587 3 14.5 3C13.3565 3 12.243 3.40758 11.3479 4.13122C11.1109 4.31374 10.8895 4.51957 10.6879 4.74849L10 5.5L9.31213 4.74849C9.11055 4.51957 8.88913 4.31374 8.65209 4.13122C7.757 3.40758 6.64348 3 5.5 3C4.04131 3 2.64236 3.57946 1.61091 4.61091C0.579462 5.64236 0 7.04131 0 8.5C0 13.5 8 18.5 8 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 2C20 2 21.5 3 22 5C22.5 7 22 10 19.5 10C17.5 10 17 7 18 6C18.8 5.2 20 6 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-text mb-2">Create Your Account</h1>
              <p className="text-text-light max-w-md mx-auto">Join Farm Fresh to connect with local farmers and access fresh, sustainably-grown produce.</p>
            </div>

            {/* User type selector */}
            <div className="mb-8">
              <div className="bg-neutral-light p-1 rounded-lg flex mb-6 max-w-sm mx-auto">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    userType === 'consumer'
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-text hover:bg-neutral'
                  }`}
                  onClick={() => handleUserTypeChange('consumer')}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Consumer
                  </span>
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    userType === 'farmer'
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-text hover:bg-neutral'
                  }`}
                  onClick={() => handleUserTypeChange('farmer')}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2zm12-12v4m0 0v4m0-4h4m-4 0H7" />
                    </svg>
                    Farmer
                  </span>
                </button>
              </div>
              
              <p className="text-center text-sm text-text-light mb-4">
                {userType === 'consumer' 
                  ? 'Register as a consumer to browse and purchase fresh produce from local farmers.' 
                  : 'Register as a farmer to sell your produce directly to consumers through our platform.'}
              </p>
            </div>

            {/* Registration form */}
            {error && (
              <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-text pb-2 border-b border-neutral">Account Information</h3>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-text mb-1">
                      Username <span className="text-error">*</span>
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field w-full"
                      placeholder="username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field w-full"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                      Password <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field w-full pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-light hover:text-text"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1">
                      Confirm Password <span className="text-error">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field w-full"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-text pb-2 border-b border-neutral">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-field w-full"
                        placeholder="First name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-field w-full"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-text mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="input-field w-full"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-text mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field w-full"
                      placeholder="Your address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              {/* Farmer specific fields */}
              {userType === 'farmer' && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-text pb-2 border-b border-neutral">Farm Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="farmName" className="block text-sm font-medium text-text mb-1">
                        Farm Name <span className="text-error">*</span>
                      </label>
                      <input
                        id="farmName"
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="input-field w-full"
                        placeholder="Your farm name"
                        required={userType === 'farmer'}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="farmLocation" className="block text-sm font-medium text-text mb-1">
                        Farm Location <span className="text-error">*</span>
                      </label>
                      <input
                        id="farmLocation"
                        type="text"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        className="input-field w-full"
                        placeholder="City, District"
                        required={userType === 'farmer'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="originState" className="block text-sm font-medium text-text mb-1">
                      State/Province <span className="text-error">*</span>
                    </label>
                    <input
                      id="originState"
                      type="text"
                      value={originState}
                      onChange={(e) => setOriginState(e.target.value)}
                      className="input-field w-full"
                      placeholder="State/Province"
                      required={userType === 'farmer'}
                    />
                  </div>
                  
                  <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <h4 className="font-medium flex items-center text-warning mb-2">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verification Required
                    </h4>
                    <p className="text-sm text-text-light">
                      To sell on Farm Fresh, you'll need to verify your farm after registration. We'll guide you through the process once your account is created.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  type="submit"
                  className={`btn-primary w-full ${loading ? 'opacity-80 cursor-wait' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Create Account
                      <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-text-light">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 