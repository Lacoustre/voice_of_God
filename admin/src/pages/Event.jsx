import React, { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import EditEventModal from "../components/EditEventModal";

const EventCard = ({ event, onClick }) => {
  return (
    <div
      className="cursor-pointer border rounded-xl bg-white hover:shadow-md transition overflow-hidden flex flex-col"
      onClick={onClick}
    >

      <div className="w-full h-80 overflow-hidden rounded-t-xl">
        <img
          src={event.images?.[0]}
          alt="event"
          className="w-full h-full object-fill"
        />
      </div>

      <div className="p-4 flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500">{event.date}</p>

        <p className="text-sm text-indigo-600 italic text-justify leading-relaxed">
          {event.verse}
        </p>
      </div>
    </div>
  );
};



const EventsPage = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    if (showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

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
    setShowAddModal(false);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = formData.images.length + selectedFiles.length;

    if (totalImages > 10) {
      alert("You can only upload up to 10 images.");
      return;
    }

    const newPreviews = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles],
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", formData);
    resetForm();
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full overflow-y-auto">
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
        ))}
      </div>

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={(updatedEvent) => {
            console.log("Save event", updatedEvent);
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
                  <ul className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded-xl max-h-48 overflow-y-auto shadow-lg z-50">
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
                        src={img.preview}
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
