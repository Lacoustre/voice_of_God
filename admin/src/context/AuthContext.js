import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
  }, []);

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
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:4000/api/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const userData = await res.json();
        return userData;
      } else {
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
      
      // Simple login - find admin by email and password
      const res = await fetch('http://localhost:4000/api/admin/get');
      const data = await res.json();
      
      if (res.ok) {
        const admin = data.admins.find(a => a.email === email && a.password === password);
        if (admin) {
          const token = 'dummy-token-' + admin.$id;
          localStorage.setItem('authToken', token);
          localStorage.setItem('userId', admin.$id);
          setUser(admin);
          setIsAuthenticated(true);
          toast.success('Login successful!');
          return { success: true };
        } else {
          toast.error('Invalid credentials');
          return { success: false, error: 'Invalid credentials' };
        }
      } else {
        toast.error('Login failed');
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      toast.error('Login failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  const updateUser = async (userData) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:4000/api/admin/profile/update', {
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
        toast.success('Profile updated successfully!');
        return { success: true };
      } else {
        const error = await res.json();
        toast.error(error.error || 'Update failed');
        return { success: false, error: error.error };
      }
    } catch (error) {
      toast.error('Update failed: ' + error.message);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};