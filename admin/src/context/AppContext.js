import React, { createContext, useContext } from "react";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [admins, setAdmins] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });
  
  // Update localStorage when activeSection changes
  React.useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return null;
    }
    // Remove any quotes or extra whitespace that might have been added
    return token.trim().replace(/^"|"$/g, '');
  };

  const fetchMedia = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const uploadFile = async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("file", file);

      
      const response = await fetch(`${API_BASE_URL}/api/media/upload-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, url: data.url, fileId: data.fileId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const uploadMedia = async (image_url, uploaded_by, target, published = false) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url,
          uploaded_by,
          target,
          published,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateMedia = async (id, target, published) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          target,
          published,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteMedia = async (id, target) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          target,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const testEmailService = async (email) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/email/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Admin management functions
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        setAdmins([]);
        setLoading(false);
        return { success: false, error: "Authentication token missing", admins: [] };
      }
      
      
      const response = await fetch(`${API_BASE_URL}/api/admin/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // If token is invalid, clear it and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }
        
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      setAdmins(data.admins || []);
      setLoading(false);
      return { success: true, admins: data.admins || [] };
    } catch (error) {
      setAdmins([]);
      setLoading(false);
      return { success: false, error: error.message, admins: [] };
    }
  };

  const createAdmin = async (adminData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the local state directly instead of calling fetchAdmins
      const newAdmin = data;
      setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
      
      return { success: true, admin: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateAdmin = async (id, adminData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the local state directly instead of calling fetchAdmins
      setAdmins(prevAdmins => 
        prevAdmins.map(admin => 
          admin.$id === id ? { ...admin, ...adminData } : admin
        )
      );
      
      return { success: true, admin: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the local state directly instead of calling fetchAdmins
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin.$id !== id));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    fetchMedia,
    uploadFile,
    uploadMedia,
    updateMedia,
    deleteMedia,
    testEmailService,
    // Admin management
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    admins,
    loading,
    // Navigation
    activeSection,
    setActiveSection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};