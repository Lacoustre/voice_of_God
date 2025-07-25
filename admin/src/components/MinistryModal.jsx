import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Modal from "./common/Modal";
// import FormField from "./common/FormField";
import LoadingButton from "./common/LoadingButton";

const MinistryModal = ({ ministry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    activities: [],
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: "", description: "" });

  useEffect(() => {
    if (ministry) {
      setFormData({
        title: ministry.title || "",
        description: ministry.description || "",
        imageUrl: ministry.imageUrl || "",
        activities: ministry.activities || [],
        order: ministry.order || 0,
      });
    }
  }, [ministry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const addActivity = () => {
    if (newActivity.title.trim() === "") return;
    
    setFormData((prev) => ({
      ...prev,
      activities: [...prev.activities, { ...newActivity }],
    }));
    
    setNewActivity({ title: "", description: "" });
  };

  const removeActivity = (index) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving ministry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {ministry ? "Edit Ministry" : "Add New Ministry"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                required
              />
              {formData.imageUrl && (
                <div className="mt-2 border rounded-md overflow-hidden">
                  <img 
                    src={formData.imageUrl} 
                    alt="Ministry preview" 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="order" className="block text-left text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min={0}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Activities</h3>
              
              <div className="space-y-4 mb-4">
                {formData.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Add New Activity</h4>
                <div className="space-y-3">
                  <div className="mb-3">
                    <label htmlFor="activityTitle" className="block text-left text-sm font-medium text-gray-700 mb-1">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      id="activityTitle"
                      name="title"
                      value={newActivity.title}
                      onChange={handleActivityChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activityDescription" className="block text-left text-sm font-medium text-gray-700 mb-1">
                      Activity Description
                    </label>
                    <input
                      type="text"
                      id="activityDescription"
                      name="description"
                      value={newActivity.description}
                      onChange={handleActivityChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addActivity}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 sticky bottom-0 bg-white py-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {ministry ? "Update Ministry" : "Add Ministry"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MinistryModal;