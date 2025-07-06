import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && userId) {
      setIsAuthenticated(true);
      
      // First try to use stored user data for immediate UI update
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUser(parsedUserData);
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }
      
      // Then try to fetch fresh user data
      try {
        const userData = await fetchUserData(userId);
        if (userData) {
          setUser(userData);
          // Update stored user data
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (error) {
        console.log('Failed to fetch user data, but keeping authenticated');
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  };

  const fetchUserData = async (userId) => {
    try {
      // Skip fetching user data if userId is not valid
      if (!userId) {
        console.log('No userId provided, skipping user data fetch');
        return null;
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, skipping user data fetch');
        return null;
      }
      
      // Use the direct admin endpoint with the ID
      // This is more reliable as we know the exact ID
      const res = await fetch(`https://voice-of-god.onrender.com/api/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const userData = await res.json();
        return userData;
      } else {
        console.log(`Failed to fetch user data: ${res.status}`);
        // If we get a 401 or 404, we'll try to use the stored user data
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            return JSON.parse(storedUserData);
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Try to use stored user data as fallback
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          return JSON.parse(storedUserData);
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const res = await fetch('https://voice-of-god.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user.$id);
        // Store user data in localStorage for offline access
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        showToast('Login successful!', 'success');
        return { success: true };
      } else {
        showToast(data.error || 'Login failed', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      showToast('Login failed: ' + error.message, 'error');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    // This will be handled by individual components
    console.log(`Toast: ${type} - ${message}`);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'success');
  };

  const updateUser = async (userData) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://voice-of-god.onrender.com/api/admin/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...userData, userId: user.$id }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      } else {
        const error = await res.json();
        showToast(error.error || 'Update failed', 'error');
        return { success: false, error: error.error };
      }
    } catch (error) {
      showToast('Update failed: ' + error.message, 'error');
      return { success: false, error: error.message };
    }
  };

  const refreshUser = async () => {
    if (user && user.$id) {
      try {
        await fetchUserData(user.$id);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser,
    checkAuthStatus,
    showToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};