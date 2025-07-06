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
    
    if (token && userId) {
      setIsAuthenticated(true);
      try {
        const userData = await fetchUserData(userId);
        if (userData) {
          setUser(userData);
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
      
      // Use the profile/update endpoint instead of the direct ID endpoint
      // This is more reliable as it doesn't require the specific admin ID
      const res = await fetch(`https://voice-of-god.onrender.com/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const userData = await res.json();
        return userData;
      } else {
        console.log(`Failed to fetch user data: ${res.status}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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