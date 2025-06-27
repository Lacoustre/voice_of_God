import React, { useState } from "react";
import { Search, Filter, FileText, Send, Globe } from "lucide-react";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import MemberSelector from "../components/common/MemberSelector";
import ViewAnnouncementModal from "../components/AnnouncementModal";

const members = ["John Doe", "Jane Smith", "Michael Johnson", "Emily Brown"];

const generateMockAnnouncements = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Announcement ${i + 1}`,
    content: `This is a brief content for announcement ${i + 1}. Stay updated and follow instructions as guided by the church leadership. Please contact your leader if you need clarification.`,
    date: `2025-06-${(i % 30) + 1}`.padStart(10, "0"),
    category: i % 2 === 0 ? "General" : "Youth",
  }));
};

const truncate = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState(generateMockAnnouncements());
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementMode, setAnnouncementMode] = useState("phone");
  const [announcementTargets, setAnnouncementTargets] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  const toggleAnnouncementTarget = (name) => {
    setAnnouncementTargets((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setAnnouncementMode("phone");
    setAnnouncementTargets([]);
    setMemberSearch("");
  };

  const filtered = announcements
    .filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((a) => (filterCategory ? a.category === filterCategory : true));

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
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
              <option value="Women">Women Fellowship</option>
              <option value="Men">Men Fellowship</option>
            </select>
          </div>
        </div>
      )}

      <div className="overflow-y-auto pr-2" style={{ maxHeight: "500px" }}>
        <div className="space-y-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="border rounded-md p-4 bg-gray-50 hover:shadow-sm transition cursor-pointer"
              onClick={() => setSelectedAnnouncement(a)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-800 text-left">{a.title}</h3>
                <p className="text-xs text-gray-500">{a.date}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
                <p className="text-left">{truncate(a.content, 100)}</p>
                <span className="ml-4 text-xs text-indigo-600 whitespace-nowrap">{a.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Create Announcement"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="phone"
                checked={announcementMode === "phone"}
                onChange={() => setAnnouncementMode("phone")}
              />
              <Send className="w-4 h-4" /> Phone
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="website"
                checked={announcementMode === "website"}
                onChange={() => setAnnouncementMode("website")}
              />
              <Globe className="w-4 h-4" /> Website
            </label>
          </div>
          <input
            type="text"
            placeholder="Announcement Title"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          {announcementMode === "phone" && (
            <FormField label="Select Recipients">
              <MemberSelector
                members={members}
                selectedMembers={announcementTargets}
                onToggleMember={toggleAnnouncementTarget}
                onSelectAll={setAnnouncementTargets}
                searchValue={memberSearch}
                onSearchChange={setMemberSearch}
                buttonColor="orange"
              />
            </FormField>
          )}
          <textarea
            placeholder="Announcement Message"
            className="w-full border rounded-lg px-3 py-2"
            required
          ></textarea>
          <button className="w-full bg-orange-600 text-white py-3 rounded-lg">
            Create
          </button>
        </form>
      </Modal>

      {selectedAnnouncement && (
        <ViewAnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
};

export default AnnouncementPage;
