import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Client, Storage, ID } from 'appwrite';
import { useAuth, useApp } from '../context';

const AccountModal = ({ showAccountModal, setShowAccountModal }) => {
  const { user, refreshUser } = useAuth();
  const { updateAdmin } = useApp();
  const [accountDetails, setAccountDetails] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    dateofbirth: '',
    address: '',
    profile_image: 'https://i.pravatar.cc/150?img=1'
  });

  const fileInputRef = useRef(null);

  const getAuthenticatedStorage = () => {
    const client = new Client()
      .setEndpoint("https://nyc.cloud.appwrite.io/v1")
      .setProject("6857de38002bc7cb276f");
    // Don't set JWT for file uploads since we're using dummy tokens
    return new Storage(client);
  };

  useEffect(() => {
    if (showAccountModal && user) {
      console.log('Logged in user details:', user);
      
      // Format date to yyyy-MM-dd for input field
      let formattedDate = '';
      if (user.dateofbirth) {
        const date = new Date(user.dateofbirth);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      }
      
      setAccountDetails({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        password: '',
        phone: user.phone || '',
        dateofbirth: formattedDate,
        address: user.address || '',
        profile_image: user.profile_image || 'https://i.pravatar.cc/150?img=1'
      });
    }
  }, [showAccountModal, user]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const storage = getAuthenticatedStorage();
      const uploaded = await storage.createFile(
        "68583ca10032bfb6ffe5",
        ID.unique(),
        file
      );
      const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/68583ca10032bfb6ffe5/files/${uploaded.$id}/view?project=6857de38002bc7cb276f`;
      
      setAccountDetails({ ...accountDetails, profile_image: imageUrl });
      toast.success('Profile image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload profile image: ' + err.message);
      console.error('Upload error:', err);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }
    
    const result = await updateAdmin(user.$id, accountDetails);
    if (result.success) {
      await refreshUser();
      toast.success('Account details updated successfully!');
      setShowAccountModal(false);
    } else {
      toast.error('Failed to update account: ' + result.error);
    }
  };

  if (!showAccountModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Update Account Details</h3>
        <hr className="mb-6 border-gray-300" />

        <div className="flex flex-col items-center mb-6">
          <img
            src={accountDetails.profile_image}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border mb-2 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500">Click image to change profile picture</p>
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
          ].map(({ label, key, type }) => (
            <div key={key} className="text-left">
              <label className="block mb-1 font-medium text-left">{label}</label>
              <input
                type={type || "text"}
                value={accountDetails[key] || ""}
                onChange={(e) => setAccountDetails({ ...accountDetails, [key]: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={() => setShowAccountModal(false)}
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;