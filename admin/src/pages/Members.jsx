import React, { useState, useRef } from "react";
import { Eye, Search, Filter, User, UserPlus, Phone, Mail, MapPin, Briefcase, CalendarDays, Mars, Venus, FileText } from "lucide-react";
import ViewMemberModal from "../components/ViewMemberModal";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";

const generateMockMembers = () => {
  return Array.from({ length: 100 }, (_, i) => {
    const age = 18 + (i % 40);
    return {
      id: i + 1,
      name: `Member ${String.fromCharCode(65 + (i % 26))}${i}`,
      email: `member${i}@example.com`,
      phone: `+1 (555) 01${i.toString().padStart(3, "0")}`,
      address: `123${i} Church St, Springfield, ST 12345`,
      role: i % 3 === 0 ? "Leader" : "Member",
      age,
      dob: `199${i % 10}-0${(i % 9) + 1}-15`,
      image: i % 5 === 0 ? null : `https://i.pravatar.cc/150?img=${i + 1}`,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
};

const MembersPage = () => {
  const allMembers = generateMockMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const scrollRef = useRef(null);

  const filteredMembers = allMembers
    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((m) => (filterRole ? m.role === filterRole : true))
    .filter((m) => m.age >= ageRange[0] && m.age <= ageRange[1]);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Members</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <UserPlus size={18} />
          Add Member
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 bg-gray-50 p-4 rounded-md border text-sm">
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

          {/* Day of Birth (weekday) */}
          <div>
            <label className="font-medium mb-1 block">Day of Birth</label>
            <select
              onChange={(e) =>
                console.log("Filter Day of Birth:", e.target.value)
              }
              className="w-full px-2 py-1.5 border rounded-md"
            >
              <option value="">All</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          <div>
            <label className="font-medium mb-1 block">Age Range</label>
            <select
              value={ageRange.join("-")}
              onChange={(e) => {
                const [min, max] = e.target.value.split("-").map(Number);
                setAgeRange([min, max]);
              }}
              className="w-full px-2 py-1.5 border rounded-md"
            >
              <option value="0-100">All</option>
              <option value="0-17">0 - 17</option>
              <option value="18-24">18 - 24</option>
              <option value="25-35">25 - 35</option>
              <option value="36-50">36 - 50</option>
              <option value="51-120">51+</option>
            </select>
          </div>

          {/* Group */}
          <div>
            <label className="font-medium mb-1 block">Group</label>
            <select
              onChange={(e) => console.log("Filter Group:", e.target.value)}
              className="w-full px-2 py-1.5 border rounded-md"
            >
              <option value="">All</option>
              <option value="Youth">Youth</option>
              <option value="Women Fellowship">Women Fellowship</option>
              <option value="Men Fellowship">Men Fellowship</option>
            </select>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-y-auto max-h-[690px] flex-1 space-y-3 pr-2"
      >
        {filteredMembers.slice(0, 15).map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-md border hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              {member.image ? (
                <img
                  src={member.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="text-white" size={18} />
                </div>
              )}
              <div>
                <p className="font-medium text-sm text-gray-800">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.phone}</p>
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
        />
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Member"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); console.log('Member added'); setShowAddModal(false); }}>
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
      </Modal>
    </div>
  );
};

export default MembersPage;
