import React, { useState, useEffect } from "react";
import { Search, Filter, FileText, Send, Globe, Loader2 } from "lucide-react";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import ViewAnnouncementModal from "../components/AnnouncementModal";
import Toast from "../components/common/Toast";

const targetGroups = ["General", "Youth", "Women's Fellowship", "Men's Fellowship", "Elders"];

const truncate = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementMode, setAnnouncementMode] = useState("phone");
  const [selectedTargetGroups, setSelectedTargetGroups] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "", post_on_website: false });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('https://voice-of-god.onrender.com/api/announcements');
      const data = await response.json();
      setAnnouncements(data.data || []);
    } catch (error) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const target_groups = announcementMode === 'phone' ? selectedTargetGroups.join(',') : 'website';

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('https://voice-of-god.onrender.com/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          target_groups,
          post_on_website: formData.post_on_website
        })
      });

      if (response.ok) {
        showToast('Announcement created successfully!');
        await fetchAnnouncements();
        closeModal();
        setFormData({ title: "", content: "", post_on_website: false });
      } else {
        showToast('Failed to create announcement', 'error');
      }
    } catch (error) {
      showToast('Error creating announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleTargetGroup = (group) => {
    setSelectedTargetGroups((prev) =>
      prev.includes(group) ? prev.filter((x) => x !== group) : [...prev, group]
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setAnnouncementMode("phone");
    setSelectedTargetGroups([]);
    setFormData({ title: "", content: "", post_on_website: false });
  };

  const phoneAnnouncements = announcements.filter(a => a.target_groups !== 'website' && !a.post_on_website);
  const websiteAnnouncements = announcements.filter(a => a.target_groups === 'website' || a.post_on_website);

  const filterAnnouncements = (list) => list
    .filter((a) => a.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((a) => (filterCategory ? (a.target_groups || a.category) === filterCategory : true));

  const filteredPhone = filterAnnouncements(phoneAnnouncements);
  const filteredWebsite = filterAnnouncements(websiteAnnouncements);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition text-sm"
        >
          <FileText size={16} /> Create Announcement
        </button>
      </div>

      <div className="relative mb-4 flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        <div className="mb-4 grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border">
          <div>
            <label className="block text-sm font-medium mb-1 text-left">Category</label>
            <select
              className="w-full border text-sm rounded-md p-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="General">General</option>
              <option value="Youth">Youth</option>
              <option value="Women's Fellowship">Women's Fellowship</option>
              <option value="Men's Fellowship">Men's Fellowship</option>
              <option value="Elders">Elders</option>
            </select>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Phone Announcements */}
          <div className="border-r md:pr-4 h-full overflow-hidden">
            <h3 className="text-xl font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <Send size={20} className="text-orange-600" />
              Phone Announcements ({filteredPhone.length})
            </h3>
            <div className="h-full overflow-y-auto pr-2 custom-scroll">
              <div className="space-y-4">
                {filteredPhone.map((a) => (
                  <div
                    key={a.$id || a.id}
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-sm transition cursor-pointer"
                    onClick={() => setSelectedAnnouncement(a)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 text-left">{a.title}</h3>
                      <p className="text-xs text-gray-500">{a.$createdAt ? new Date(a.$createdAt).toLocaleDateString() : (a.date || 'No date')}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="text-left">{truncate(a.content, 100)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Website Announcements */}
          <div className="md:pl-4 h-full overflow-hidden">
            <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Globe size={20} className="text-blue-600" />
              Website Announcements ({filteredWebsite.length})
            </h3>
            <div className="h-full overflow-y-auto pr-2 custom-scroll">
              <div className="space-y-4">
                {filteredWebsite.map((a) => (
                  <div
                    key={a.$id || a.id}
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-sm transition cursor-pointer"
                    onClick={() => setSelectedAnnouncement(a)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 text-left">{a.title}</h3>
                      <p className="text-xs text-gray-500">{a.$createdAt ? new Date(a.$createdAt).toLocaleDateString() : (a.date || 'No date')}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="text-left">{truncate(a.content, 100)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title="Create Announcement">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="phone"
                checked={announcementMode === "phone"}
                onChange={() => {
                  setAnnouncementMode("phone");
                  setFormData({ ...formData, post_on_website: false });
                }}
              />
              <Send className="w-4 h-4" /> Phone
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="website"
                checked={announcementMode === "website"}
                onChange={() => {
                  setAnnouncementMode("website");
                  setFormData({ ...formData, post_on_website: true });
                }}
              />
              <Globe className="w-4 h-4" /> Website
            </label>
          </div>
          <input
            type="text"
            placeholder="Announcement Title"
            className="w-full border px-3 py-2"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          {announcementMode === "phone" && (
            <FormField label="Select Target Groups">
              <div className="grid grid-cols-2 gap-2">
                {targetGroups.map((group) => (
                  <label key={group} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedTargetGroups.includes(group)}
                      onChange={() => toggleTargetGroup(group)}
                      className="rounded"
                    />
                    <span>{group}</span>
                  </label>
                ))}
              </div>
            </FormField>
          )}
          <textarea
            placeholder="Announcement Message"
            className="w-full border px-3 py-2"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </Modal>

      {selectedAnnouncement && (
        <ViewAnnouncementModal
          announcement={{
            ...selectedAnnouncement,
            date: selectedAnnouncement.$createdAt
              ? new Date(selectedAnnouncement.$createdAt).toLocaleDateString()
              : selectedAnnouncement.date || "No date",
            category: selectedAnnouncement.target_groups || selectedAnnouncement.category || "General",
          }}
          onClose={() => setSelectedAnnouncement(null)}
          onSave={async (updatedAnnouncement) => {
            try {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              showToast("Announcement updated successfully!");
              await fetchAnnouncements();
            } catch (error) {
              showToast("Failed to update announcement", 'error');
            }
          }}
          onDelete={async (announcementId) => {
            try {
              await new Promise((resolve) => setTimeout(resolve, 2000));

              const response = await fetch(`https://voice-of-god.onrender.com/api/announcements/${announcementId}`, {
                method: "DELETE",
              });

              if (response.ok) {
                showToast("Announcement deleted successfully!");
                await fetchAnnouncements();
                setSelectedAnnouncement(null);
              } else {
                showToast("Failed to delete announcement", 'error');
              }
            } catch (error) {
              showToast("Failed to delete announcement", 'error');
            }
          }}
        />
      )}
      
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

export default AnnouncementPage;
