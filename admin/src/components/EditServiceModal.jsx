import React, { useState, useRef } from "react";
import { X, Trash2, Save, Upload } from "lucide-react";
import LoadingButton from "./common/LoadingButton";

const EditServiceModal = ({ service, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    verse: service?.verse || "",
    image: service?.image || "",
    schedule: service?.schedule?.length > 0 ? service.schedule : [""],
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      setIsChanged(JSON.stringify(updated) !== JSON.stringify(service));
      return updated;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: previewURL, imageFile: file }));
      setIsChanged(true);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(service?.$id || service?.id);
      setShowConfirmDelete(false);
      onClose();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-white w-full max-w-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto relative text-sm animate-slideUp">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Service Details</h2>
            <hr className="mt-2" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-left">Title</label>
              <input
                className="w-full border px-3 py-1.5"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-left">Bible Verse</label>
              <textarea
                rows={3}
                className="w-full border px-3 py-1.5"
                placeholder="Enter Bible verse..."
                value={form.verse}
                onChange={(e) => handleChange("verse", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-left">Schedule</label>
              <div className="space-y-2">
                {form.schedule.map((schedule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      className="flex-1 border px-3 py-1.5"
                      value={schedule}
                      placeholder="e.g. Weekly, Monthly, Special Event"
                      onChange={(e) => {
                        const newSchedules = [...form.schedule];
                        newSchedules[index] = e.target.value;
                        handleChange("schedule", newSchedules);
                      }}
                    />
                    {form.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSchedules = form.schedule.filter((_, i) => i !== index);
                          handleChange("schedule", newSchedules);
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleChange("schedule", [...form.schedule, ""])}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm hover:bg-blue-600"
                  >
                    Add Schedule
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-left">Description</label>
              <textarea
                rows={3}
                className="w-full border px-3 py-1.5"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium mb-1 text-left">Upload Image</label>
              <div
                className="relative w-40 h-28 overflow-hidden border bg-gray-100 flex items-center justify-center cursor-pointer group"
                onClick={() => fileInputRef.current.click()}
              >
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex items-center gap-1">
                    <Upload size={18} /> Upload Image
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">
                  Click to Change
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-red-600 px-3 py-2 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>

            <button
              onClick={() => onSave(form)}
              disabled={!isChanged}
              className={`flex items-center gap-2 text-sm px-4 py-2 ${
                isChanged
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white shadow-lg p-6 w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-medium">{form.title}</span>?
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-4 py-2 border text-gray-600 hover:bg-gray-100"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <LoadingButton
                isLoading={isDeleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditServiceModal;
