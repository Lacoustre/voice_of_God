import { useState } from "react";
import {
  UserPlus,
  Calendar,
  Image,
  FileText,
  Heart,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CalendarDays,
  Venus,
  Mars,
  Clock,
  BookOpen,
  Users,
  Send,
  Globe,
  Trash2,
} from "lucide-react";
import Modal from "./common/Modal";
import MemberSelector from "./common/MemberSelector";
import FormField from "./common/FormField";

const members = ["John Doe", "Jane Smith", "Michael Johnson", "Emily Brown"];

const actions = [
  {
    key: "member",
    label: "Add New Member",
    icon: UserPlus,
    color: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    key: "service",
    label: "Schedule Service",
    icon: Calendar,
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    key: "prayer",
    label: "Prayer Requests",
    icon: Heart,
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    key: "media",
    label: "Upload Media",
    icon: Image,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    key: "announcement",
    label: "Create Announcement",
    icon: FileText,
    color: "bg-orange-600 hover:bg-orange-700",
  },
];

const QuickActions = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [mediaImages, setMediaImages] = useState([]);
  const [mediaTarget, setMediaTarget] = useState("top");
  const [announcementMode, setAnnouncementMode] = useState("phone");
  const [announcementTargets, setAnnouncementTargets] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => {
    setActiveModal(null);
    setSelectedMembers([]);
    setMediaImages([]);
    setMediaTarget("top");
    setAnnouncementMode("phone");
    setAnnouncementTargets([]);
    setMemberSearch("");
  };

  const toggleMember = (name) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const toggleAnnouncementTarget = (name) => {
    setAnnouncementTargets((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const removeImage = (index) => {
    setMediaImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setMediaImages((prev) => [...prev, ...newPreviews]);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "prayer":
        return (
          <form className="space-y-4">
            <FormField label="Select Members" icon={Users}>
              <MemberSelector
                members={members}
                selectedMembers={selectedMembers}
                onToggleMember={toggleMember}
                onSelectAll={setSelectedMembers}
                searchValue={memberSearch}
                onSearchChange={setMemberSearch}
                buttonColor="red"
              />
            </FormField>
            <input
              type="text"
              placeholder="Prayer Topic"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="Prayer Request Message"
              className="w-full border rounded-lg px-3 py-2"
              required
            ></textarea>
            <button className="w-full bg-red-600 text-white py-3 rounded-lg">
              Submit Request
            </button>
          </form>
        );

      case "member":
        return (
          <form className="space-y-4">
            <FormField label="Full Name" icon={User} required>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone Number" icon={Phone} required>
                <input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </FormField>
              <FormField label="Email Address" icon={Mail} required>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </FormField>
            </div>

            <FormField label="Address" icon={MapPin}>
              <input
                type="text"
                placeholder="123 Church Lane, Springfield, CT"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Role in Church" icon={Briefcase} required>
                <select
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Select role</option>
                  <option>Member</option>
                  <option>Usher</option>
                  <option>Choir</option>
                  <option>Pastor</option>
                  <option>Deacon</option>
                  <option>Volunteer</option>
                </select>
              </FormField>

              <FormField label="Date Joined" icon={CalendarDays}>
                <input
                  type="date"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Gender" icon={() => (
                <span className="flex gap-1">
                  <Mars className="w-4 h-4 text-blue-500" />
                  <Venus className="w-4 h-4 text-pink-500" />
                </span>
              )}>
                <select
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue=""
                >
                  <option value="" disabled>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </FormField>
              <FormField label="Additional Notes" icon={FileText}>
                <input
                  type="text"
                  placeholder="Optional info..."
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              Add Member
            </button>
          </form>
        );
      case "media":
        return (
          <form className="space-y-4">
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="carousel"
                  value="top"
                  checked={mediaTarget === "top"}
                  onChange={() => setMediaTarget("top")}
                />
                Top Carousel
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="carousel"
                  value="donation"
                  checked={mediaTarget === "donation"}
                  onChange={() => setMediaTarget("donation")}
                />
                Donation Carousel
              </label>
            </div>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="grid grid-cols-3 gap-2">
              {mediaImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="rounded w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg">
              Upload
            </button>
          </form>
        );

      case "service":
        return (
          <form className="space-y-4">
            <FormField label="Service Title" icon={Calendar} required>
              <input
                type="text"
                placeholder="Sunday Worship"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Start Time (EST)" icon={Clock} required>
                <input
                  type="time"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </FormField>
              <FormField label="End Time (EST)" icon={Clock} required>
                <input
                  type="time"
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </FormField>
            </div>

            <FormField label="Upload Image" icon={Image} required>
              <input
                type="file"
                accept="image/*"
                className="w-full mt-1 border rounded-lg px-3 py-2"
                required
              />
            </FormField>

            <FormField label="Bible Verse" icon={BookOpen}>
              <input
                type="text"
                placeholder="John 3:16"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </FormField>

            <FormField label="Description" icon={FileText} required>
              <textarea
                placeholder="Enter details about the service..."
                className="w-full mt-1 border rounded-lg px-3 py-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </FormField>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              Schedule Service
            </button>
          </form>
        );

      case "announcement":
        return (
          <form className="space-y-4">
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => openModal(action.key)}
            className={`w-full ${action.color} text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105`}
          >
            <action.icon className="w-4 h-4" /> {action.label}
          </button>
        ))}
      </div>
      <Modal
        isOpen={!!activeModal}
        onClose={closeModal}
        title={actions.find((a) => a.key === activeModal)?.label || ""}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default QuickActions;
