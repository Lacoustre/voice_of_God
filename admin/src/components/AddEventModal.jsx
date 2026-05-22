import { useState, useCallback, useRef } from "react";
import { X } from "lucide-react";
import Toast from "./common/Toast";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const AddEventModal = ({ isOpen, onClose, onEventAdded }) => {
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    verse: "",
    location: "",
    images: [],
    additionalInfo: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const locationTimeoutRef = useRef(null);

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      verse: "",
      location: "",
      images: [],
      additionalInfo: "",
    });
    setImagePreviews([]);
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    onClose();
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = formData.images.length + selectedFiles.length;

    if (totalImages > 10) {
      setToast({ message: "You can only upload up to 10 images.", type: "error" });
      return;
    }

    const previews = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles],
    }));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    setImagePreviews((prev) => {
      const previews = [...prev];
      URL.revokeObjectURL(previews[index].preview);
      previews.splice(index, 1);
      return previews;
    });
  };

  const fetchLocationSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    setIsLoadingLocations(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5`,
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'VoiceOfGodMinistries/1.0'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error('Location service unavailable');
      }

      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setLocationSuggestions(data.map((place) => place.display_name));
        setShowLocationDropdown(true);
      } else {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn('Location autocomplete failed:', error.message);
      }
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    } finally {
      setIsLoadingLocations(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "location") {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }

      if (value.trim().length > 2) {
        locationTimeoutRef.current = setTimeout(() => {
          fetchLocationSuggestions(value);
        }, 500);
      } else {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrls = [];
      for (let file of formData.images) {
        const data = new FormData();
        data.append("file", file);

        const res = await fetch(`${API_BASE_URL}/media/upload-file`, {
          method: "POST",
          body: data,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Image upload failed: ${res.status} ${res.statusText}`);
        }
        
        try {
          const result = await res.json();
          if (!result.success) {
            throw new Error(result.error || "Image upload failed");
          }
          imageUrls.push(result.url);
        } catch (jsonError) {
          throw new Error(`Invalid response format: ${jsonError.message}`);
        }
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Event creation failed: ${response.status} ${response.statusText}`);
      }
      
      try {
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Event creation failed");
        }
        
        setToast({ message: "Event created successfully!", type: "success" });
        if (onEventAdded) onEventAdded();
        resetForm();
      } catch (jsonError) {
        throw new Error(`Invalid response format: ${jsonError.message}`);
      }
    } catch (err) {
      setToast({ message: err.message || "Error creating event", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-xl shadow-lg relative">
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border px-4 py-2"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border px-4 py-2"
              required
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full border px-4 py-2"
              required
            />
          </div>
          <input
            type="text"
            name="verse"
            placeholder="Bible Verse"
            value={formData.verse}
            onChange={handleInputChange}
            className="w-full border px-4 py-2"
          />
          <div className="relative">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              onBlur={() => {
                setTimeout(() => setShowLocationDropdown(false), 200);
              }}
              onFocus={() => {
                if (locationSuggestions.length > 0) {
                  setShowLocationDropdown(true);
                }
              }}
              className="w-full border px-4 py-2"
              autoComplete="off"
            />
            {isLoadingLocations && (
              <div className="absolute right-3 top-3">
                <svg
                  className="animate-spin h-5 w-5 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              </div>
            )}
            {showLocationDropdown && locationSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border mt-1 max-h-48 overflow-y-auto shadow-lg z-50">
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({
                        ...prev,
                        location: suggestion,
                      }));
                      setShowLocationDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview}
                    alt={`preview-${index}`}
                    className="w-full h-20 object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 text-xs hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <textarea
            name="additionalInfo"
            placeholder="Additional Info"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            className="w-full border px-4 py-2"
          />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 border">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
};

export default AddEventModal;