import React, { createContext, useContext, useState } from 'react';

const UtilsContext = createContext();

export const useUtils = () => {
  const context = useContext(UtilsContext);
  if (!context) {
    throw new Error('useUtils must be used within a UtilsProvider');
  }
  return context;
};

export const UtilsProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com/api";

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/media/upload-file`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  };

  const handleAsyncOperation = async (operation, loadingSetter, successMessage) => {
    try {
      loadingSetter(true);
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay
      const result = await operation();
      if (successMessage) showToast(successMessage);
      return { success: true, data: result };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, error: error.message };
    } finally {
      loadingSetter(false);
    }
  };

  const value = {
    toast,
    showToast,
    formatDate,
    uploadImage,
    apiRequest,
    handleAsyncOperation,
    API_BASE_URL,
  };

  return (
    <UtilsContext.Provider value={value}>
      {children}
    </UtilsContext.Provider>
  );
};