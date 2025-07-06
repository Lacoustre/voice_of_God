import { Trash2 } from "lucide-react";
import { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const EventCard = ({ event, onDelete, setToast }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  setIsDeleting(true);

  try {
    await new Promise((res) => setTimeout(res, 3000));

    const res = await fetch(`${API_BASE_URL}/events/${event.$id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({})); 

    if (!res.ok || data?.success === false) {
      throw new Error(data?.error || "Failed to delete event.");
    }

    if (onDelete) onDelete(event.$id);
    setToast({ message: "Event deleted successfully", type: "success" });
  } catch (err) {
    console.error(err);
    setToast({ message: err.message || "Delete failed", type: "error" });
  } finally {
    setIsDeleting(false);
    setShowConfirm(false);
  }
};

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all text-left cursor-pointer">
      {/* Trash Icon */}
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
        title="Delete event"
      >
        <Trash2 size={18} />
      </button>

      {/* Event Content */}
      <div className="space-y-2">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">Title:</span> {event.title}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Date:</span>{" "}
          {new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at{" "}
          {new Date(`${event.date}T${event.time}`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
            <hr className="border-t border-gray-300" />
            <p className="text-sm text-gray-600">
              Are you sure you want to permanently delete this event?
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
              >
                {isDeleting && (
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
                )}
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
