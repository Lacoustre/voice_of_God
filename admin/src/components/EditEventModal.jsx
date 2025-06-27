import { X, Trash2, Upload } from "lucide-react";
import React, { useState } from "react";

const EditEventModal = ({ event, onClose, onSave }) => {
  const [form, setForm] = useState({ ...event });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files.map(URL.createObjectURL)] }));
  };

  const handleImageRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">Edit Event</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Verse"
            value={form.verse}
            onChange={(e) => setForm({ ...form, verse: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <textarea
            rows="4"
            className="w-full border p-2 rounded"
            placeholder="Additional Info"
            value={form.additionalInfo}
            onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
          />

          <div>
            <label className="block font-medium mb-2">Uploaded Images</label>
            <div className="flex flex-wrap gap-4">
              {form.images.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img} className="object-cover w-full h-full rounded" />
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 mt-4 cursor-pointer">
              <Upload size={18} />
              <input type="file" multiple className="hidden" onChange={handleImageChange} />
              <span className="text-sm font-medium text-indigo-600">Add More Images</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => {
                // add delete logic
                alert("Deleted event (mock)");
                onClose();
              }}
            >
              <Trash2 className="inline mr-1" size={18} />
              Delete
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              onClick={() => onSave(form)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
