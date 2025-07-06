import React, { useState, useRef, useEffect } from "react";
import { Eye, Search, Filter, User, UserPlus, Phone, Mail, MapPin, Briefcase, Image, CheckCircle, X } from "lucide-react";
import ViewMemberModal from "../components/ViewMemberModal";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import Toast from "../components/common/Toast";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [filterApproval, setFilterApproval] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    profile_image: null,
    address: "",
    groups: [],
    role: "",
    approved: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [approveAllLoading, setApproveAllLoading] = useState(false);
  const [declineAllLoading, setDeclineAllLoading] = useState(false);
  const [approvingMemberId, setApprovingMemberId] = useState(null);
  const [decliningMemberId, setDecliningMemberId] = useState(null);
  const [updatingMemberId, setUpdatingMemberId] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.approval-dropdown')) {
        setOpenDropdownId(null);
      }
    };
    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleApprovalChange = async (member, approved) => {
    // Check if action is valid
    if (approved && member.approved) {
      showToast('Member is already approved', 'info');
      return;
    }
    if (!approved && !member.approved) {
      showToast('Member is already declined', 'info');
      return;
    }

    try {
      if (approved) {
        setApprovingMemberId(member.$id || member.id);
      } else {
        setDecliningMemberId(member.$id || member.id);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      const updateData = { ...member, approved };
      await updateMember(member.$id || member.id, updateData);
      setMembers(prev => prev.map(m => {
        const memberId = m.$id || m.id;
        const targetId = member.$id || member.id;
        return memberId === targetId ? { ...m, approved } : m;
      }));
      showToast(`Member ${approved ? 'approved' : 'declined'} successfully!`);
      setOpenDropdownId(null);
    } catch (err) {
      showToast('Failed to update member status', 'error');
    } finally {
      setApprovingMemberId(null);
      setDecliningMemberId(null);
    }
  };

  const handleApproveAll = async () => {
    const unapprovedMembers = members.filter(m => !m.approved);
    if (unapprovedMembers.length === 0) {
      showToast('No pending members to approve', 'info');
      return;
    }
    
    try {
      setApproveAllLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      for (const member of unapprovedMembers) {
        await updateMember(member.$id || member.id, { ...member, approved: true });
      }
      setMembers(prev => prev.map(m => 
        unapprovedMembers.some(um => (um.$id === m.$id || um.id === m.id)) 
          ? { ...m, approved: true } 
          : m
      ));
      showToast(`${unapprovedMembers.length} members approved successfully!`);
    } catch (err) {
      showToast('Failed to approve all members', 'error');
    } finally {
      setApproveAllLoading(false);
    }
  };

  const handleDeclineAll = async () => {
    const approvedMembers = members.filter(m => m.approved);
    if (approvedMembers.length === 0) {
      showToast('No approved members to decline', 'info');
      return;
    }
    
    try {
      setDeclineAllLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      for (const member of approvedMembers) {
        await updateMember(member.$id || member.id, { ...member, approved: false });
      }
      setMembers(prev => prev.map(m => 
        approvedMembers.some(am => (am.$id === m.$id || am.id === m.id)) 
          ? { ...m, approved: false } 
          : m
      ));
      showToast(`${approvedMembers.length} members declined successfully!`);
    } catch (err) {
      showToast('Failed to decline all members', 'error');
    } finally {
      setDeclineAllLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/members`);
      const data = await response.json();
      if (data.success) {
        setMembers(data.members);
      }
    } catch (err) {
      showToast('Failed to fetch members', 'error');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/members/upload-image`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const createMember = async (memberData) => {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.member;
  };

  const updateMember = async (id, memberData) => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.member;
  };

  const deleteMember = async (id) => {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      let imageUrl = newMember.profile_image;
      
      if (newMember.imageFile) {
        imageUrl = await uploadImage(newMember.imageFile);
      }
      
      const memberData = {
        name: newMember.name,
        phone: newMember.phone,
        email: newMember.email,
        profile_image: imageUrl || "",
        address: newMember.address || "",
        groups: newMember.groups || [],
        role: newMember.role,
        approved: newMember.approved
      };
      
      const member = await createMember(memberData);
      setMembers(prev => [...prev, member]);
      showToast('Member created successfully!');
      setNewMember({
        name: "",
        phone: "",
        email: "",
        profile_image: null,
        address: "",
        groups: [],
        role: "",
        approved: false
      });
      setShowAddModal(false);
    } catch (err) {
      showToast('Failed to create member', 'error');
      console.error('Error creating member:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewMember(prev => ({ ...prev, profile_image: previewURL, imageFile: file }));
    }
  };

  const scrollRef = useRef(null);

  const filteredMembers = members
    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((m) => (filterRole ? m.role === filterRole : true))
    .filter((m) => {
      if (filterApproval === "approved") return m.approved === true;
      if (filterApproval === "pending") return m.approved === false;
      return true;
    })
    .sort((a, b) => {
      // First sort by approval status (approved first)
      if (a.approved !== b.approved) {
        return b.approved - a.approved;
      }
      // Within each group, sort by creation date (recently created first)
      return new Date(b.$createdAt || b.createdAt || 0) - new Date(a.$createdAt || a.createdAt || 0);
    });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <button  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
            <UserPlus size={18} />
            Add Member
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Members</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleApproveAll}
            disabled={approveAllLoading || members.filter(m => !m.approved).length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition text-sm"
          >
            {approveAllLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <CheckCircle size={16} />
            )}
            {approveAllLoading ? 'Approving...' : `Approve All (${members.filter(m => !m.approved).length})`}
          </button>
          <button
            onClick={handleDeclineAll}
            disabled={declineAllLoading || members.filter(m => m.approved).length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition text-sm"
          >
            {declineAllLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <X size={16} />
            )}
            {declineAllLoading ? 'Declining...' : `Decline All (${members.filter(m => m.approved).length})`}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        </div>
      </div>

      {/* Search with Filter */}
      <div className="relative mb-4 flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2 top-1.5 text-gray-500 hover:text-indigo-600"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-md border text-sm">
          {/* Role */}
          <div>
            <label className="font-medium mb-1 block">Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-2 py-1.5 border rounded-md"
            >
              <option value="">All</option>
              <option value="Leader">Leader</option>
              <option value="Member">Member</option>
            </select>
          </div>





          {/* Approval Status */}
          <div>
            <label className="font-medium mb-1 block">Approval Status</label>
            <select
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
              className="w-full px-2 py-1.5 border rounded-md"
            >
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-y-auto max-h-[690px] flex-1 space-y-3 pr-2"
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {filteredMembers.map((member) => (
          <div
            key={member.$id || member.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-md border hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              {member.profile_image ? (
                <img
                  src={member.profile_image}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="text-white" size={18} />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-800">
                    {member.name}
                  </p>
                  {member.approved ? (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                      Approved
                    </span>
                  ) : (
                    <div className="relative approval-dropdown">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === member.$id ? null : member.$id)}
                        className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                      >
                        Pending Approval ▼
                      </button>
                      {openDropdownId === member.$id && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-24">
                          <button
                            onClick={() => handleApprovalChange(member, true)}
                            disabled={approvingMemberId === (member.$id || member.id) || decliningMemberId === (member.$id || member.id)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-green-50 text-green-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {approvingMemberId === (member.$id || member.id) ? (
                              <div className="animate-spin h-3 w-3 border border-green-700 border-t-transparent rounded-full" />
                            ) : null}
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprovalChange(member, false)}
                            disabled={approvingMemberId === (member.$id || member.id) || decliningMemberId === (member.$id || member.id)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {decliningMemberId === (member.$id || member.id) ? (
                              <div className="animate-spin h-3 w-3 border border-red-700 border-t-transparent rounded-full" />
                            ) : null}
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-900 font-bold text-left">
                  {member.phone ? member.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : member.phone}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMember(member)}
              className="text-sm flex items-center gap-1 focus:outline-none"
            >
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-xs hover:bg-indigo-200 transition">
                <Eye size={14} />
                View
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {selectedMember && (
        <ViewMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          isUpdating={updatingMemberId === (selectedMember.$id || selectedMember.id)}
          isDeleting={deletingMemberId === (selectedMember.$id || selectedMember.id)}
          onUpdate={async (memberData) => {
            try {
              setUpdatingMemberId(selectedMember.$id || selectedMember.id);
              await new Promise(resolve => setTimeout(resolve, 3000));
              let imageUrl = memberData.profile_image;
              
              if (memberData.imageFile) {
                imageUrl = await uploadImage(memberData.imageFile);
              }
              
              const updateData = {
                name: memberData.name,
                phone: memberData.phone,
                email: memberData.email,
                profile_image: imageUrl || "",
                address: memberData.address || "",
                groups: memberData.groups || [],
                role: memberData.role,
                approved: memberData.approved !== undefined ? memberData.approved : false
              };
              
              await updateMember(selectedMember.$id || selectedMember.id, updateData);
              setMembers(prev => prev.map(m => (m.$id === selectedMember.$id || m.id === selectedMember.id) ? { ...m, ...updateData } : m));
              showToast('Member updated successfully!');
            } catch (err) {
              showToast('Failed to update member', 'error');
              console.error('Error updating member:', err);
            } finally {
              setUpdatingMemberId(null);
            }
          }}
          onDelete={async (id) => {
            try {
              setDeletingMemberId(id);
              await new Promise(resolve => setTimeout(resolve, 3000));
              await deleteMember(id);
              setMembers(prev => prev.filter(m => m.$id !== id && m.id !== id));
              showToast('Member deleted successfully!');
            } catch (err) {
              showToast('Failed to delete member', 'error');
              console.error('Error deleting member:', err);
            } finally {
              setDeletingMemberId(null);
            }
          }}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Member"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <FormField label="Full Name" icon={User} required>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone Number" icon={Phone} required>
              <input
                type="tel"
                placeholder="+1 555 123 4567"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                required
              />
            </FormField>
            <FormField label="Email Address" icon={Mail} required>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                required
              />
            </FormField>
          </div>

          <FormField label="Address" icon={MapPin}>
            <input
              type="text"
              placeholder="123 Church Lane, Springfield, CT"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMember.address}
              onChange={(e) => setNewMember({...newMember, address: e.target.value})}
            />
          </FormField>

          <FormField label="Role in Church" icon={Briefcase} required>
            <select
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMember.role}
              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
              required
            >
              <option value="" disabled>Select role</option>
              <option value="Member">Member</option>
              <option value="Leader">Leader</option>
              <option value="Pastor">Pastor</option>
            </select>
          </FormField>

          <FormField label="Profile Image" icon={Image}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ref={fileInputRef}
            />
            {newMember.profile_image && (
              <div className="mt-2">
                <img
                  src={newMember.profile_image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>
            )}
          </FormField>

          <FormField label="Groups" icon={User}>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {newMember.groups.map((group, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs flex items-center"
                  >
                    {group}
                    <button
                      type="button"
                      className="ml-1 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newGroups = newMember.groups.filter((_, i) => i !== index);
                        setNewMember({...newMember, groups: newGroups});
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !newMember.groups.includes(value)) {
                    setNewMember({...newMember, groups: [...newMember.groups, value]});
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
          </FormField>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="approved"
              checked={newMember.approved}
              onChange={(e) => setNewMember({...newMember, approved: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="approved" className="text-sm font-medium text-gray-700">
              Approve member immediately
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Adding...
              </div>
            ) : (
              'Add Member'
            )}
          </button>
        </form>
      </Modal>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MembersPage;
