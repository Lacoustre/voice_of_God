import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import EventCard from "./EventCard";
import Toast from "../components/common/Toast";

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

const fetchEvents = async () => {
  try {
    const res = await fetch('https://voice-of-god.onrender.com/api/events');

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Unexpected non-JSON response:", text.slice(0, 100));
      throw new Error("Server did not return JSON.");
    }

    const data = await res.json();

    if (!data.success || !Array.isArray(data.events)) {
      throw new Error(data.error || "Invalid events response");
    }

    const now = new Date();

    const upcoming = data.events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let topThree = [...upcoming.slice(0, 3)];

    if (topThree.length < 3) {
      const past = data.events
        .filter(e => new Date(e.date) < now)
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
      await new Promise((res) => setTimeout(res, 3000));

      const imageUrls = [];
      for (let file of formData.images) {
        const data = new FormData();
        data.append("file", file);

        const res = await fetch('https://voice-of-god.onrender.com/api/media/upload-file', {
          method: "POST",
          body: data,
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Image upload failed");
        }
        imageUrls.push(result.url);
      }

      const response = await fetch('https://voice-of-god.onrender.com/api/events', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Event creation failed");
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

      {showModal && (
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
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md"
                />
                {showLocationDropdown && (
                  <ul className="absolute left-0 right-0 bg-white border mt-1 rounded-xl max-h-48 overflow-y-auto shadow-lg z-50">
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
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
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
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md border">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
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
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventsList;
