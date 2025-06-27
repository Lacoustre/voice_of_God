import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import { useApp } from "../context";

const AdminManagement = () => {
  const { 
    admins, 
    loading, 
    fetchAdmins, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin, 
    uploadFile 
  } = useApp();
  
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    username: "",
    profile_image: "https://i.pravatar.cc/150?img=1",
    password: "",
    address: "",
    phone: "",
    dateofbirth: "",
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const newFileInputRef = useRef();
  const editFileInputRef = useRef();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async () => {
    try {
      const file = newFileInputRef.current.files[0];
      if (!file) return toast.error("Please upload a profile image.");

      const uploadResult = await uploadFile(file);
      if (!uploadResult.success) {
        return toast.error("Failed to upload image: " + uploadResult.error);
      }

      const result = await createAdmin({
        ...newAdmin,
        profile_image: uploadResult.url,
      });

      if (result.success) {
        toast.success("Admin created successfully!");
        setShowNewForm(false);
        setNewAdmin({
          name: "",
          email: "",
          username: "",
          profile_image: "https://i.pravatar.cc/150?img=1",
          password: "",
          address: "",
          phone: "",
          dateofbirth: "",
        });
      } else {
        toast.error("Failed to create admin: " + result.error);
      }
    } catch (err) {
      toast.error("Failed to create admin: " + err.message);
    }
  };

  const handleProfilePicChange = async (e, isNew = false) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const result = await uploadFile(file);
    if (result.success) {
      if (isNew) {
        setNewAdmin(prev => ({ ...prev, profile_image: result.url }));
      } else {
        setEditingAdmin(prev => ({ ...prev, profile_image: result.url }));
      }
      toast.success("Profile image uploaded successfully!");
    } else {
      toast.error("Failed to upload profile image: " + result.error);
    }
  };

  const handleUpdateAdmin = async () => {
    try {
      const adminData = {
        name: editingAdmin.name,
        email: editingAdmin.email,
        username: editingAdmin.username,
        phone: editingAdmin.phone,
        dateofbirth: editingAdmin.dateofbirth,
        address: editingAdmin.address,
        profile_image: editingAdmin.profile_image,
      };

      const result = await updateAdmin(editingAdmin.$id, adminData);
      
      if (result.success) {
        toast.success("Admin updated successfully!");
        setShowEditModal(false);
        setEditingAdmin(null);
      } else {
        toast.error("Failed to update admin: " + result.error);
      }
    } catch (err) {
      toast.error("Failed to update admin: " + err.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const result = await deleteAdmin(adminId);
    if (result.success) {
      toast.success("Admin deleted successfully!");
      setShowDeleteConfirm(null);
    } else {
      toast.error("Failed to delete admin: " + result.error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow border h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow border h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          <Plus size={16} /> Create New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {admins.map((admin, index) => (
          <div
            key={admin.$id || `admin-${index}`}
            onClick={() => setSelectedAdmin(admin)}
            className="border rounded-lg shadow-sm p-4 bg-gray-50 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={admin.profile_image || "https://i.pravatar.cc/150?img=1"}
                alt={admin.name}
                className="w-16 h-16 rounded-full object-cover border"
                onError={(e) => {
                  console.log("Image load error for admin:", admin.name, admin.profile_image);
                  e.target.src = "https://i.pravatar.cc/150?img=1";
                }}
              />
              <div className="text-left">
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold text-sm">{admin.name}</p>
                <p className="text-xs text-gray-500 mt-1">Phone</p>
                <p className="text-sm text-gray-700">{admin.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Create New Admin
            </h3>
            <hr className="mb-6 border-gray-300" />

            <div className="flex flex-col items-center mb-6">
              <img
                src={newAdmin.profile_image}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border mb-2 cursor-pointer"
                onClick={() => newFileInputRef.current.click()}
              />
              <input
                ref={newFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleProfilePicChange(e, true)}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                Click image to upload profile picture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Full Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Username", key: "username" },
                { label: "Password", key: "password", type: "password" },
                { label: "Phone", key: "phone" },
                { label: "Date of Birth", key: "dateofbirth", type: "date" },
                { label: "Address", key: "address" },
              ].map(({ label, key, type }, index) => (
                <div key={`${key}-${index}`} className="text-left">
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type={type || "text"}
                    value={newAdmin[key] || ""}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, [key]: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto font-sans relative">
            <div className="text-center mb-6 relative">
              <h2 className="text-2xl font-semibold text-gray-800">
                Admin Details
              </h2>
              <hr className="mt-3 border-t border-gray-300 w-full" />
              <button
                onClick={() => setSelectedAdmin(null)}
                className="absolute right-0 top-0 text-gray-500 hover:text-red-500"
              >
                <X />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={selectedAdmin.profile_image || "https://i.pravatar.cc/150?img=1"}
                  alt="Admin"
                  className="w-full h-full object-cover border shadow"
                  onError={(e) => {
                    console.log("Image load error in view modal:", selectedAdmin.profile_image);
                    e.target.src = "https://i.pravatar.cc/150?img=1";
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {selectedAdmin.name}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {selectedAdmin.email}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Username</label>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {selectedAdmin.username}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Phone</label>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {selectedAdmin.phone}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Date of Birth</label>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {selectedAdmin.dateofbirth}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Address</label>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {selectedAdmin.address}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDeleteConfirm(selectedAdmin.$id);
                  setSelectedAdmin(null);
                }}
                className="flex items-center gap-2 text-sm text-red-600 px-3 py-2 rounded hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={() => {
                  setEditingAdmin(selectedAdmin);
                  setShowEditModal(true);
                  setSelectedAdmin(null);
                }}
                className="flex items-center gap-2 text-sm text-blue-600 px-3 py-2 rounded hover:bg-blue-50"
              >
                <Pencil size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Edit Admin
            </h3>
            <hr className="mb-6 border-gray-300" />

            <div className="flex flex-col items-center mb-6">
              <img
                src={editingAdmin.profile_image || "https://i.pravatar.cc/150?img=1"}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border mb-2 cursor-pointer"
                onClick={() => editFileInputRef.current.click()}
              />
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleProfilePicChange(e, false)}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                Click image to upload profile picture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Full Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Username", key: "username" },
                { label: "Phone", key: "phone" },
                { label: "Date of Birth", key: "dateofbirth", type: "date" },
                { label: "Address", key: "address" },
              ].map(({ label, key, type }) => (
                <div key={key} className="text-left">
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type={type || "text"}
                    value={editingAdmin[key] || ""}
                    onChange={(e) =>
                      setEditingAdmin({
                        ...editingAdmin,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAdmin(null);
                }}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAdmin}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Update Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this admin?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdmin(showDeleteConfirm)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
