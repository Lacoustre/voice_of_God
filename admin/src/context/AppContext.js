import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Storage } from 'appwrite';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appwriteClient, setAppwriteClient] = useState(null);
  const [storage, setStorage] = useState(null);

  const config = {
    appwriteEndpoint: "https://nyc.cloud.appwrite.io/v1",
    appwriteProjectId: "6857de38002bc7cb276f",
    storageBucketId: "68583ca10032bfb6ffe5",
    apiBaseUrl: "https://voice-of-god.onrender.com/api",
  };

  useEffect(() => {
    initializeAppwrite();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAppwrite = () => {
    const client = new Client()
      .setEndpoint(config.appwriteEndpoint)
      .setProject(config.appwriteProjectId);
    
    const storageInstance = new Storage(client);
    
    setAppwriteClient(client);
    setStorage(storageInstance);
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${config.apiBaseUrl}/admin/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        setAdmins(data.admins);
        return { success: true, data: data.admins };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (adminData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${config.apiBaseUrl}/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (res.ok) {
        const newAdmin = await res.json();
        setAdmins(prev => [...prev, newAdmin]);
        return { success: true, data: newAdmin };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (adminId, updateData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${config.apiBaseUrl}/admin/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const updatedAdmin = await res.json();
        setAdmins(prev => 
          prev.map(admin => 
            admin.$id === adminId ? updatedAdmin : admin
          )
        );
        return { success: true, data: updatedAdmin };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${config.apiBaseUrl}/admin/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAdmins(prev => prev.filter(admin => admin.$id !== adminId));
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${config.apiBaseUrl}/media/upload-file`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, url: data.url, fileId: data.fileId };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/media/media`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching media:', error);
      return { success: false, error: error.message };
    }
  };

  const uploadMedia = async (imageUrl, uploadedBy, target) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/media/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          uploaded_by: uploadedBy,
          published: false,
          target,
        }),
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      return { success: false, error: error.message };
    }
  };

  const updateMedia = async (id, target, published) => {
    console.log('updateMedia called with:', { id, target, published });
    try {
      const response = await fetch(`${config.apiBaseUrl}/media/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, target, published }),
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        console.log('Update successful');
        return { success: true };
      } else {
        const error = await response.json();
        console.error('Update failed:', error);
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error updating media:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteMedia = async (id, target) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/media/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, target }),
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      return { success: false, error: error.message };
    }
  };

  const updateEventStatus = async (id, status) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/events/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      return { success: false, error: error.message };
    }
  };


  const value = {
    // State
    admins,
    loading,
    config,
    
    // Admin operations
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    
    // File operations
    uploadFile,
    
    // Media operations
    fetchMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    
    // Event operations
    updateEventStatus,
    
    // Appwrite instances
    appwriteClient,
    storage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};