import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import EditEventModal from "../components/EditEventModal";
import Toast from "../components/common/Toast";

const EventCard = ({ event, onClick }) => {
  const getImageUrl = () => {
    return event?.images?.[0] || "https://placehold.co/300x200?text=No+Image";
  };

  return (
    <div
      className="cursor-pointer border rounded-xl bg-white hover:shadow-md transition overflow-hidden flex flex-col"
      onClick={onClick}
    >
      <div className="w-full h-80 overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={getImageUrl()}
          alt={event?.title || "Event"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col space-y-2 text-left">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800">
          {event?.title || "Untitled Event"}
        </h3>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">Date:</span>{" "}
          {event?.date
            ? new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Not specified"}
        </p>

        {event?.verse && (
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Verse:</span>{" "}
            <span className="italic text-indigo-600">{event.verse}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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
  const [toast, setToast] = useState(null);
  const locationRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    if (showLocationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationDropdown]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/media/upload-file`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  useEffect(() => {
    fetchEvents();
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEvents = async (retryCount = 0) => {
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Retry once for Render cold starts
        if (retryCount === 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchEvents(1);
        }
        throw new Error('Server returned non-JSON response');
      }
    }

    const data = await res.json(); 
    if (!data.success || !Array.isArray(data.events)) {
      throw new Error("Invalid events response");
    }

    setEvents(data.events);
  } catch (err) {
    console.error("Error fetching events:", err);
    showToast("Failed to fetch events", "error");
  } finally {
    setLoading(false);
  }
};



  const createEvent = async () => {
    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const imageUrls = [];
      for (let file of formData.images) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          time: formData.time,
          verse: formData.verse,
          location: formData.location,
          additionalInfo: formData.additionalInfo,
          images: imageUrls,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data) throw new Error(data.error || "Create failed");

      setEvents((prev) => [...prev, data]);
      showToast("Event created!");
      resetForm();
    } catch (error) {
      showToast(error.message || "Failed to create event", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      // Extract existing image URLs
      const existingURLs = updatedData.images
        .filter(
          (img) =>
            typeof img === "string" || (img?.url && typeof img.url === "string")
        )
        .map((img) => (typeof img === "string" ? img : img.url));

      // Upload new image files
      const newFiles = updatedData.images.filter((img) => img instanceof File);
      const uploadedURLs = await Promise.all(newFiles.map(uploadImage));

      // Merge all URLs (must all be strings)
      const allImageURLs = [...existingURLs, ...uploadedURLs];

      const payload = {
        ...updatedData,
        images: allImageURLs, // send only strings
      };

      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Update failed");
      }

      setEvents((prev) =>
        prev.map((ev) =>
          ev.$id === id || ev.id === id ? { ...ev, ...payload } : ev
        )
      );

      showToast("Event updated!");
    } catch (err) {
      showToast(err.message || "Failed to update event", "error");
      console.error("Update error:", err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setEvents((prev) => prev.filter((ev) => ev.$id !== id));
      showToast("Event deleted!");
    } catch (err) {
      showToast("Failed to delete event", "error");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent();
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
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    setShowAddModal(false);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = formData.images.length + selectedFiles.length;

    if (totalImages > 10) {
      showToast("You can only upload up to 10 images.", "error");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles],
    }));

    setImagePreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "location" && value.trim().length > 2) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();
        const suggestions = data.map((place) => place.display_name);
        setLocationSuggestions(suggestions);
        setShowLocationDropdown(suggestions.length > 0);
      } catch (err) {
        console.error("Error fetching location suggestions:", err);
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    } else if (name === "location") {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow border border-gray-100 p-6"
    >
      <div className="hide-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

     <div className="flex flex-col h-[650px] overflow-y-auto pr-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {loading ? (
      <div className="col-span-full flex flex-col items-center gap-4 mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">Loading events...</p>
      </div>
    ) : events.length === 0 ? (
      <div className="col-span-full flex justify-center items-center mt-12">
        <p className="text-gray-500">No events found.</p>
      </div>
    ) : (
      events.map((event) => (
        <EventCard
          key={event.$id}
          event={event}
          onClick={() => setSelectedEvent(event)}
        />
      ))
    )}
  </div>
</div>


      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={async (updatedEvent) => {
            await updateEvent(updatedEvent.$id, updatedEvent);
            setSelectedEvent(null);
          }}
          onDelete={async (id) => {
            await deleteEvent(id);
            setSelectedEvent(null);
          }}
        />
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg relative">
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
                className="w-full border px-4 py-2 rounded-md"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md"
                  required
                />
              </div>

              <input
                type="text"
                name="verse"
                placeholder="Bible Verse"
                value={formData.verse}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-md"
              />

              <div className="relative" ref={locationRef}>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
                {showLocationDropdown && (
                  <ul
                    className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded-xl max-h-48 overflow-y-auto shadow-lg z-50"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {locationSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            location: suggestion,
                          }));
                          setShowLocationDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-50 transition cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 12.414A4 4 0 1116.657 9.17l4.243 4.243a1 1 0 01-1.414 1.414l-1.829-1.829z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">
                          {suggestion}
                        </span>
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
                        src={img}
                        alt={`preview-${index}`}
                        className="w-full h-20 object-cover rounded border"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                        title="Remove"
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
                className="w-full border px-4 py-2 rounded-md"
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
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
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </div>
    </div>
  );
};

export default EventsPage;
