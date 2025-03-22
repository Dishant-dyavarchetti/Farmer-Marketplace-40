// API utilities for making authenticated requests

// Base API URL - update this to match your Django server URL
export const API_BASE_URL = 'http://localhost:8000';

// Headers factory functions
export const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
  }

  return headers;
};

// API request wrapper functions
export const apiGet = async (endpoint: string, authenticated = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(authenticated),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(errorData.error || errorData.message || errorData.detail || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const apiPost = async (endpoint: string, data: any, authenticated = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(authenticated),
      body: JSON.stringify(data),
    });

    // For endpoints that don't return JSON (like logout)
    if (response.status === 204) {
      return null;
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = {};
      console.error('Error parsing JSON response:', e);
    }
    
    if (!response.ok) {
      console.error('API Error:', response.status, responseData);
      
      // Handle Django Rest Framework's error format which can be nested
      const errorMessage = responseData.error || 
                          responseData.detail || 
                          (responseData.non_field_errors && responseData.non_field_errors[0]) || 
                          Object.entries(responseData).map(([key, value]) => `${key}: ${value}`).join(', ') ||
                          `API error: ${response.status}`;
      
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const apiPut = async (endpoint: string, data: any, authenticated = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(authenticated),
      body: JSON.stringify(data),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = {};
      console.error('Error parsing JSON response:', e);
    }
    
    if (!response.ok) {
      console.error('API Error:', response.status, responseData);
      const errorMessage = responseData.error || 
                          responseData.detail || 
                          (responseData.non_field_errors && responseData.non_field_errors[0]) || 
                          Object.entries(responseData).map(([key, value]) => `${key}: ${value}`).join(', ') ||
                          `API error: ${response.status}`;
      
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Auth-specific API functions
export const login = async (username: string, password: string, userType: string) => {
  return apiPost('/api/auth/login/', { username, password, user_type: userType }, false);
};

export const logout = async () => {
  return apiPost('/api/auth/logout/', {});
};

export const registerFarmer = async (userData: any) => {
  console.log('Registering farmer with data:', userData);
  return apiPost('/api/auth/register/farmer/', userData, false);
};

export const registerConsumer = async (userData: any) => {
  console.log('Registering consumer with data:', userData);
  return apiPost('/api/auth/register/consumer/', userData, false);
};

export const getUserInfo = async () => {
  return apiGet('/api/auth/user-info/');
}; 