import React, { useState, useEffect, useRef } from "react";
import { X, User, Trash2, Pencil, Save, Upload } from "lucide-react";
import LoadingButton from "./common/LoadingButton";

const ViewMemberModal = ({ member, onClose, onUpdate, onDelete }) => {
  const [form, setForm] = useState({ ...member, groups: member.groups || [] });
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsChanged(JSON.stringify(form) !== JSON.stringify(member));
  }, [form, member]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate?.(form);
      setIsEditing(false);
      setIsChanged(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(member.$id || member.id);
      setShowConfirmDelete(false);
      onClose();
    } catch (error) {
      console.error("Error deleting member:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        profile_image: previewURL,
        imageFile: file,
      }));
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-3xl shadow-lg p-6 max-h-[90vh] overflow-y-auto font-sans relative">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 hover:bg-red-600 z-10"
            >
              <X size={16} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              Member Details
            </h2>
            <hr className="mt-3 border-t border-gray-300 w-full" />
          </div>

          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div
              className="relative w-24 h-24 overflow-hidden group cursor-pointer"
              onClick={() => isEditing && fileInputRef.current.click()}
            >
              {form.profile_image || form.image ? (
                <img
                  src={form.profile_image || form.image}
                  alt="profile"
                  className="w-full h-full object-cover border shadow"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <User className="text-white" size={30} />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xs font-medium">
                  <Upload size={16} className="mr-1" />
                  Change
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">Name</label>
              {isEditing ? (
                <input
                  className="w-full border px-3 py-1.5 text-sm"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2">
                  {form.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              {isEditing ? (
                <input
                  className="w-full border px-3 py-1.5 text-sm"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2">
                  {form.email}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-1">Phone</label>
              {isEditing ? (
                <input
                  className="w-full border px-3 py-1.5 text-sm"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2">
                  {form.phone}
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block font-medium mb-1">Role</label>
              {isEditing ? (
                <select
                  className="w-full border px-3 py-1.5 text-sm"
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  <option value="Member">Member</option>
                  <option value="Leader">Leader</option>
                  <option value="Pastor">Pastor</option>
                </select>
              ) : (
                <div className="bg-gray-100 px-3 py-2">
                  {form.role}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-medium mb-1">Member Since</label>
              <div className="bg-gray-100 px-3 py-2">
                {new Date(
                  member?.$createdAt || member?.createdAt || ""
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium mb-1">Address</label>
              {isEditing ? (
                <input
                  className="w-full border px-3 py-1.5 text-sm"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2">
                  {form.address}
                </div>
              )}
            </div>

            {/* Approval Status */}
            <div>
              <label className="block font-medium mb-1">Approval Status</label>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="approved-status"
                    checked={form.approved || false}
                    onChange={(e) => handleChange("approved", e.target.checked)}
                    className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="approved-status" className="text-sm text-gray-700">
                    Member is approved
                  </label>
                </div>
              ) : (
                <div className={`px-3 py-2 text-sm font-medium ${
                  form.approved 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {form.approved ? 'Approved' : 'Pending Approval'}
                </div>
              )}
            </div>

            {/* Groups */}
            <div className="sm:col-span-2">
              <label className="block font-medium mb-1">Groups</label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {form.groups?.map((group, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 text-xs flex items-center"
                      >
                        {group}
                        <button
                          type="button"
                          className="ml-1 text-red-500 hover:text-red-700"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              groups: prev.groups.filter((g) => g !== group),
                            }))
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    className="w-full px-3 py-1.5 border text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !form.groups.includes(value)) {
                        setForm((prev) => ({
                          ...prev,
                          groups: [...prev.groups, value],
                        }));
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">+ Add Group</option>
                    <option value="Youth">Youth</option>
                    <option value="Women Fellowship">Women Fellowship</option>
                    <option value="Men Fellowship">Men Fellowship</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(form.groups?.length > 0 ? form.groups : ["—"]).map(
                    (group, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 text-xs"
                      >
                        {group}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-red-600 px-3 py-2 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm text-blue-600 px-3 py-2 hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!isChanged}
                  className={`flex items-center gap-2 text-sm px-3 py-2 ${
                    isChanged
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save size={16} />
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white shadow-lg p-6 w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium">{member.name}</span>?
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
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewMemberModal;
