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
    const lastFetchTime = localStorage.getItem('lastUserFetchTime');
    const now = Date.now();
    
    if (token && userId) {
      setIsAuthenticated(true);
      
      // Always use stored user data for immediate UI update
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUser(parsedUserData);
          setLoading(false); // Set loading to false immediately after setting user
        } catch (e) {
        }
      }
      
      // Only fetch fresh data if it's been more than 30 minutes since last fetch
      // or if we don't have stored user data
      const shouldFetchFresh = !lastFetchTime || 
                              (now - parseInt(lastFetchTime)) > 30 * 60 * 1000 || 
                              !storedUserData;
      
      if (shouldFetchFresh) {
        try {
          const userData = await fetchUserData(userId);
          if (userData) {
            setUser(userData);
            // Update stored user data and last fetch time
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('lastUserFetchTime', now.toString());
          }
        } catch (error) {
        }
      }
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
    
    // Ensure loading is set to false even if there was an error
    setLoading(false);
  };

  const fetchUserData = async (userId) => {
    try {
      // Skip fetching user data if userId is not valid
      if (!userId) {
        return getUserDataFromStorage();
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        return getUserDataFromStorage();
      }
      
      // Use hardcoded user data if we have it in storage
      // This is a temporary solution until the backend is fixed
      const storedUserData = getUserDataFromStorage();
      if (storedUserData) {
        return storedUserData;
      }
      
      // If we don't have stored data, try the API as a last resort
      try {
        const res = await fetch(`https://voice-of-god.onrender.com/api/admin/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const userData = await res.json();
          return userData;
        } else {
          return null;
        }
      } catch (apiError) {
        return null;
      }
    } catch (error) {
      return getUserDataFromStorage();
    }
  };
  
  // Helper function to get user data from storage
  const getUserDataFromStorage = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        return JSON.parse(storedUserData);
      } catch (e) {
      }
    }
    return null;
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
      }
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      // Use the full URL to avoid relative path issues
      const res = await fetch('https://voice-of-god.onrender.com/api/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      let data = {};
      // Check if there's content to parse
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
        }
      }
      
      if (res.ok) {
        showToast('Reset code sent to your email', 'success');
        return { success: true };
      } else {
        showToast(data.error || 'Failed to request password reset', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      showToast('Failed to request password reset: ' + error.message, 'error');
      return { success: false, error: error.message };
    }
  };
  
  const resetPassword = async (email, code, newPassword) => {
    try {
      // Use the full URL to avoid relative path issues
      const res = await fetch('https://voice-of-god.onrender.com/api/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      
      let data = {};
      // Check if there's content to parse
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
        }
      }
      
      if (res.ok) {
        showToast('Password has been reset successfully', 'success');
        return { success: true };
      } else {
        showToast(data.error || 'Failed to reset password', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      showToast('Failed to reset password: ' + error.message, 'error');
      return { success: false, error: error.message };
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
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};