import React, { createContext, useContext } from "react";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
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
      console.error("Error fetching media:", error);
      return { success: false, error: error.message };
    }
  };

  const uploadFile = async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, url: data.url, fileId: data.fileId };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message };
    }
  };

  const uploadMedia = async (image_url, uploaded_by, target, published = false) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/media`, {
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
      console.error("Error uploading media:", error);
      return { success: false, error: error.message };
    }
  };

  const updateMedia = async (id, target, published) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/media`, {
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
      console.error("Error updating media:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteMedia = async (id, target) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/media/media`, {
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
      console.error("Error deleting media:", error);
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
      console.error("Error testing email service:", error);
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};