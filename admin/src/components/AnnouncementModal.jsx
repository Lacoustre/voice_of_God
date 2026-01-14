import React, { useState, useEffect } from "react";
import { X, Trash2, Save, Pencil } from "lucide-react";
import LoadingButton from "./common/LoadingButton";

const groupOptions = ["General", "Youth", "Women's Fellowship", "Men's Fellowship", "Elders"];

const ViewAnnouncementModal = ({ announcement, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    ...announcement,
    category: Array.isArray(announcement.category) ? announcement.category : [announcement.category],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const original = {
      ...announcement,
      category: Array.isArray(announcement.category)
        ? announcement.category
        : [announcement.category],
    };
    setIsChanged(JSON.stringify(form) !== JSON.stringify(original));
  }, [form, announcement]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (group) => {
    setForm((prev) => {
      const categories = prev.category.includes(group)
        ? prev.category.filter((g) => g !== group)
        : [...prev.category, group];
      return { ...prev, category: categories };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <h2 className="text-2xl font-semibold text-gray-800">Announcement Details</h2>
          <hr className="mt-3 border-t border-gray-300 w-full" />
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-4 text-sm text-left">
          <div>
            <label className="block font-medium mb-1">Title</label>
            {isEditing ? (
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            ) : (
              <div className="bg-gray-100 px-3 py-2 rounded-md">{form.title}</div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Content</label>
            {isEditing ? (
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => handleChange("content", e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && e.preventDefault()}
                className="w-full border rounded px-3 py-2 text-sm"
              ></textarea>
            ) : (
              <div className="bg-gray-100 px-3 py-2 rounded-md whitespace-pre-wrap">
                {form.content}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Target Groups</label>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {groupOptions.map((group) => (
                  <label key={group} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.category.includes(group)}
                      onChange={() => handleCategoryChange(group)}
                    />
                    <span>{group}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {form.category.map((group, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
                  >
                    {group}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Date</label>
            <div className="bg-gray-100 px-3 py-2 rounded-md">{form.date}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-sm text-red-600 px-3 py-2 rounded hover:bg-red-50"
          >
            <Trash2 size={16} /> Delete
          </button>

          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-sm text-blue-600 px-3 py-2 rounded hover:bg-blue-50"
              >
                <Pencil size={16} /> Edit
              </button>
            ) : (
              <LoadingButton
                isLoading={isSaving}
                onClick={async () => {
                  if (!form.title.trim()) {
                    alert('Please enter announcement title');
                    return;
                  }
                  if (!form.content.trim()) {
                    alert('Please enter announcement content');
                    return;
                  }
                  if (form.category.length === 0) {
                    alert('Please select at least one target group');
                    return;
                  }
                  
                  setIsSaving(true);
                  try {
                    const response = await fetch(`https://voice-of-god.onrender.com/api/announcements/${announcement.$id || announcement.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: form.title,
                        content: form.content,
                        category: form.category
                      })
                    });
                    
                    if (response.ok) {
                      onSave({ ...form, category: form.category });
                      setIsEditing(false);
                      setIsChanged(false);
                    } else {
                      alert('Failed to update announcement');
                    }
                  } catch (error) {
                    alert('Error updating announcement');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={!isChanged || isSaving}
                className={`text-sm px-3 py-2 rounded ${
                  isChanged && !isSaving
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save'}
                </div>
              </LoadingButton>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-medium">{announcement.title}</span>?
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <LoadingButton
                isLoading={isDeleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    onDelete(announcement.$id || announcement.id);
                    onClose();
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAnnouncementModal;
