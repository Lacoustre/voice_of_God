import { X, Trash2, Upload } from "lucide-react";
import React, { useState } from "react";
import Toast from "./common/Toast";

const EditEventModal = ({ event, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({ ...event });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [toast, setToast] = useState(null);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newFiles],
    }));
  };

  const handleImageRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-white w-full max-w-4xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">Edit Event</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <input
            type="text"
            className="w-full border p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <input
            type="date"
            className="w-full border p-2"
            placeholder="Date"
            value={
              form.date ? new Date(form.date).toISOString().split("T")[0] : ""
            }
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />

          <input
            type="text"
            className="w-full border p-2"
            placeholder="Time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <input
            type="text"
            className="w-full border p-2"
            placeholder="Verse"
            value={form.verse}
            onChange={(e) => setForm({ ...form, verse: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <input
            type="text"
            className="w-full border p-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <textarea
            rows="4"
            className="w-full border p-2"
            placeholder="Additional Info"
            value={form.additionalInfo}
            onChange={(e) =>
              setForm({ ...form, additionalInfo: e.target.value })
            }
          />

          <div>
            <label className="block font-medium mb-2">Uploaded Images</label>
            <div className="flex flex-wrap gap-4">
              {form.images.map((img, index) => {
                const isFile = img instanceof File;
                const src = isFile ? URL.createObjectURL(img) : img.url || img;

                return (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={src}
                      alt={`Event ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
            <label className="inline-flex items-center gap-2 mt-4 cursor-pointer">
              <Upload size={18} />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="text-sm font-medium text-indigo-600">
                Add More Images
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition"
            >
              <Trash2 className="inline mr-1" size={18} />
              Delete
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition disabled:bg-gray-400"
              disabled={isSaving}
              onClick={async () => {
                if (!form.title.trim()) {
                  setToast({ message: 'Please enter event title', type: 'error' });
                  return;
                }
                if (!form.date) {
                  setToast({ message: 'Please select event date', type: 'error' });
                  return;
                }
                if (!form.time.trim()) {
                  setToast({ message: 'Please enter event time', type: 'error' });
                  return;
                }
                
                setIsSaving(true);
                await new Promise((res) => setTimeout(res, 3000));
                await onSave(form);
                setIsSaving(false);
              }}
            >
              {isSaving ? (
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
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-sm p-6 text-center space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-red-600">Delete Event</h2>
              <hr />
              <p className="text-gray-700">
                Are you sure you want to permanently delete this event?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white ${
                    isDeleting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await new Promise((resolve) => setTimeout(resolve, 3000));
                      await onDelete(event.$id);
                      setToast({
                        message: "Event deleted successfully",
                        type: "success",
                      });
                      setShowConfirmDelete(false);
                      onClose();
                    } catch (err) {
                      console.error(err);
                      setToast({
                        message: "Failed to delete event",
                        type: "error",
                      });
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
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
                      Deleting...
                    </span>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
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

export default EditEventModal;
