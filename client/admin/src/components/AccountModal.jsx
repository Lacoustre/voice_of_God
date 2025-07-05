import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useApp, useUtils } from '../context';
import { validateEmail, validatePhone, formatPhoneNumber } from '../utils/validation';
import Toast from './common/Toast';

const AccountModal = ({ showAccountModal, setShowAccountModal }) => {
  const { user, updateUser } = useAuth();
  const { uploadFile } = useApp();
  const { toast, showToast } = useUtils();
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

  useEffect(() => {
    if (showAccountModal && user) {
      setAccountDetails({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        password: '',
        phone: user.phone || '',
        dateofbirth: user.dateofbirth || '',
        address: user.address || '',
        profile_image: user.profile_image || 'https://i.pravatar.cc/150?img=1'
      });
    }
  }, [showAccountModal, user]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const result = await uploadFile(file);
    if (result.success) {
      setAccountDetails({ ...accountDetails, profile_image: result.url });
    }
  };

  const handleSaveChanges = async () => {
    if (!accountDetails.name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    
    if (!validateEmail(accountDetails.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    if (accountDetails.phone && !validatePhone(accountDetails.phone)) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    
    if (accountDetails.password && accountDetails.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    const result = await updateUser(accountDetails);
    if (result.success) {
      showToast('Account updated successfully', 'success');
      setShowAccountModal(false);
    } else {
      showToast(result.error || 'Failed to update account', 'error');
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
                onChange={(e) => {
                  const value = key === 'phone' ? formatPhoneNumber(e.target.value) : e.target.value;
                  setAccountDetails({ ...accountDetails, [key]: value });
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveChanges()}
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
        
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => {}} 
          />
        )}
      </div>
    </div>
  );
};

export default AccountModal;