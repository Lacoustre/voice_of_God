import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import EventCard from "./EventCard";
import Toast from "../components/common/Toast";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (retryCount = 0) => {
    try {
      console.log(`Fetching events from: ${API_BASE_URL}/events`);
      const res = await fetch(`${API_BASE_URL}/events`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Retry once for Render cold starts
        if (retryCount === 0) {
          console.log('Non-JSON response received, retrying after delay...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          return fetchEvents(1);
        }
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 100) + '...');
        throw new Error('Server did not return JSON.');
      }

      const data = await res.json();
      if (!data.success || !Array.isArray(data.events)) {
        throw new Error(data.error || "Invalid events response");
      }

      const now = new Date();

      const upcoming = data.events
        .filter((e) => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      let topThree = [...upcoming.slice(0, 3)];

      if (topThree.length < 3) {
        const past = data.events
          .filter((e) => new Date(e.date) < now)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        topThree = [...topThree, ...past.slice(0, 3 - topThree.length)];
      }

      setEvents(topThree);
    } catch (error) {
      console.error("Error fetching events:", error);
      setToast({ message: "Error fetching events", type: "error" });
    }
  };

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
    setShowModal(false);
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

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "location" && value.trim().length > 2) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setLocationSuggestions(data.map((place) => place.display_name));
        setShowLocationDropdown(data.length > 0);
      } catch {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    } else if (name === "location") {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Remove artificial delay that was causing issues
      // await new Promise((res) => setTimeout(res, 3000));

      const imageUrls = [];
      for (let file of formData.images) {
        const data = new FormData();
        data.append("file", file);

        console.log(`Uploading file to: ${API_BASE_URL}/media/upload-file`);
        const res = await fetch(`${API_BASE_URL}/media/upload-file`, {
          method: "POST",
          body: data,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Upload error response:', errorText);
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

      console.log(`Creating event at: ${API_BASE_URL}/events`);
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
        console.error('Event creation error:', errorText);
        throw new Error(`Event creation failed: ${response.status} ${response.statusText}`);
      }
      
      try {
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Event creation failed");
        }
      } catch (jsonError) {
        throw new Error(`Invalid response format: ${jsonError.message}`);
      }

      setToast({ message: "Event created successfully!", type: "success" });
      fetchEvents();
      resetForm();
    } catch (err) {
      setToast({ message: err.message || "Error creating event", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-hide">
        {events.map((event) => (
          <EventCard
            key={event.$id}
            event={event}
            onDelete={(deletedId) =>
              setEvents((prev) => prev.filter((e) => e.$id !== deletedId))
            }
            setToast={setToast}
          />
        ))}
      </div>

      {/* Add Modal (omitted here to save space since it's unchanged) */}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventsList;
