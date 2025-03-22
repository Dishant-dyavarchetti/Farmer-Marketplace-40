import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type UserInfo = {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type: string;
  phone_number?: string;
  address?: string;
  farm_name?: string;
  farm_location?: string;
  origin_state?: string;
  is_verified?: boolean;
  [key: string]: any;
};

type ProfileProps = {
  userInfo: UserInfo | null;
};

const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-neutral-light rounded-xl h-40 mb-6"></div>
    <div className="space-y-6">
      <div className="h-6 bg-neutral-light rounded w-1/4"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-neutral-light rounded col-span-1"></div>
          <div className="h-4 bg-neutral-light rounded col-span-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-neutral-light rounded col-span-1"></div>
          <div className="h-4 bg-neutral-light rounded col-span-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-neutral-light rounded col-span-1"></div>
          <div className="h-4 bg-neutral-light rounded col-span-2"></div>
        </div>
      </div>
    </div>
  </div>
);

const Profile = ({ userInfo }: ProfileProps) => {
  const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'settings'>('account');
  const [isEditing, setIsEditing] = useState(false);
  
  // If no user info, show login message
  if (!userInfo) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card shadow-medium">
            <svg className="w-16 h-16 text-neutral-dark mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-text mb-4">Authentication Required</h2>
            <p className="text-text-light mb-6">Please log in to view your profile and manage your account.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
              <Link to="/register" className="btn-outline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFarmer = userInfo.user_type === 'farmer';
  const fullName = `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || 'User';
  
  const handleTabChange = (tab: 'account' | 'orders' | 'settings') => {
    setActiveTab(tab);
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-5xl mx-auto">
        <div className="card shadow-medium bg-white overflow-hidden border-none">
          {/* Profile header */}
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-primary to-primary-dark"></div>
            <div className="absolute inset-0 opacity-15">
              <svg className="h-full w-full" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="profile-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40L40 0M10 50L50 10M-10 30L30 -10" fill="none" stroke="white" strokeWidth="1"></path>
                  </pattern>
                </defs>
                <rect width="800" height="200" fill="url(#profile-pattern)"></rect>
              </svg>
            </div>
            
            {/* Profile avatar */}
            <div className="absolute -bottom-16 left-6 sm:left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary-light border-4 border-white flex items-center justify-center">
                  <span className="text-white text-4xl font-medium">
                    {userInfo.first_name && userInfo.first_name[0]}
                    {userInfo.last_name && userInfo.last_name[0]}
                  </span>
                </div>
                {isFarmer && (
                  <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-1">
                    {userInfo.is_verified ? (
                      <div className="bg-success text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="bg-warning text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* User name and details */}
            <div className="ml-8 sm:ml-44 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-text mt-16 sm:mt-0">{fullName}</h2>
                <div className="flex items-center text-text-light mt-1">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {isFarmer ? 'Farmer' : 'Consumer'}
                  </span>
                  {isFarmer && (
                    <span className="ml-4 flex items-center">
                      {userInfo.is_verified ? (
                        <span className="text-success flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="text-warning flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Pending Verification
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={toggleEdit}
                  className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {isEditing ? (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Profile tabs */}
          <div className="border-b border-neutral">
            <nav className="flex space-x-4 px-6">
              <button
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'account'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-light hover:text-text hover:border-neutral'
                }`}
                onClick={() => handleTabChange('account')}
              >
                Account Information
              </button>
              <button
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-light hover:text-text hover:border-neutral'
                }`}
                onClick={() => handleTabChange('orders')}
              >
                Order History
              </button>
              <button
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-light hover:text-text hover:border-neutral'
                }`}
                onClick={() => handleTabChange('settings')}
              >
                Settings
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'account' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-text">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-sm text-text-light">Username</div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="input-field col-span-2" 
                            defaultValue={userInfo.username} 
                          />
                        ) : (
                          <div className="font-medium col-span-2">{userInfo.username}</div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-sm text-text-light">Email</div>
                        {isEditing ? (
                          <input 
                            type="email" 
                            className="input-field col-span-2" 
                            defaultValue={userInfo.email} 
                          />
                        ) : (
                          <div className="font-medium col-span-2">{userInfo.email}</div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-sm text-text-light">Full Name</div>
                        {isEditing ? (
                          <div className="col-span-2 grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="First Name"
                              defaultValue={userInfo.first_name} 
                            />
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="Last Name"
                              defaultValue={userInfo.last_name} 
                            />
                          </div>
                        ) : (
                          <div className="font-medium col-span-2">{fullName}</div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-sm text-text-light">Phone Number</div>
                        {isEditing ? (
                          <input 
                            type="tel" 
                            className="input-field col-span-2" 
                            defaultValue={userInfo.phone_number} 
                          />
                        ) : (
                          <div className="font-medium col-span-2">
                            {userInfo.phone_number || 'Not provided'}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-sm text-text-light">Address</div>
                        {isEditing ? (
                          <textarea 
                            className="input-field col-span-2 min-h-[80px]" 
                            defaultValue={userInfo.address} 
                          />
                        ) : (
                          <div className="font-medium col-span-2">
                            {userInfo.address || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isFarmer && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-text">Farm Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-sm text-text-light">Farm Name</div>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="input-field col-span-2" 
                              defaultValue={userInfo.farm_name} 
                            />
                          ) : (
                            <div className="font-medium col-span-2">
                              {userInfo.farm_name || 'Not provided'}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-sm text-text-light">Farm Location</div>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="input-field col-span-2" 
                              defaultValue={userInfo.farm_location} 
                            />
                          ) : (
                            <div className="font-medium col-span-2">
                              {userInfo.farm_location || 'Not provided'}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-sm text-text-light">Origin State</div>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="input-field col-span-2" 
                              defaultValue={userInfo.origin_state} 
                            />
                          ) : (
                            <div className="font-medium col-span-2">
                              {userInfo.origin_state || 'Not provided'}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-sm text-text-light">Verification Status</div>
                          <div className={`font-medium col-span-2 ${userInfo.is_verified ? 'text-success' : 'text-warning'}`}>
                            {userInfo.is_verified ? 'Verified' : 'Pending Verification'}
                          </div>
                        </div>
                        
                        {!userInfo.is_verified && (
                          <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
                            <h4 className="font-medium flex items-center text-warning">
                              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Verification Required
                            </h4>
                            <p className="mt-2 text-sm text-text-light">
                              To complete your verification, please upload the following documents:
                            </p>
                            <ul className="mt-2 text-sm text-text-light list-disc pl-5">
                              <li>Proof of farming land ownership/lease</li>
                              <li>NPOP/PGS-India certification (if available)</li>
                              <li>Government ID proof</li>
                            </ul>
                            <button className="mt-3 btn-warning text-sm">
                              Upload Documents
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mt-8 flex justify-end">
                    <button className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-neutral-dark mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-text mb-2">No Orders Yet</h3>
                  <p className="text-text-light mb-6">You haven't placed any orders yet.</p>
                  <Link to="/products" className="btn-primary">
                    Browse Products
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-text">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-neutral rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-text">Change Password</h4>
                            <p className="text-sm text-text-light mt-1">Update your password to keep your account secure.</p>
                          </div>
                          <button className="btn-outline text-sm">
                            Change
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-neutral rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-text">Notification Preferences</h4>
                            <p className="text-sm text-text-light mt-1">Manage your email and push notification settings.</p>
                          </div>
                          <button className="btn-outline text-sm">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-text">Privacy & Security</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-neutral rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-text">Two-Factor Authentication</h4>
                            <p className="text-sm text-text-light mt-1">Add an extra layer of security to your account.</p>
                          </div>
                          <button className="btn-outline text-sm">
                            Enable
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-neutral rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-text">Delete Account</h4>
                            <p className="text-sm text-text-light mt-1">Permanently delete your account and all associated data.</p>
                          </div>
                          <button className="btn-outline border-error text-error hover:bg-error/10 text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 