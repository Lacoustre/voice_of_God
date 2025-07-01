// QuickActions.jsx
import React, { useState, useRef } from "react";
import {
  UserPlus,
  Calendar,
  Image,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Megaphone,
  Church,
  FileText,
  BookOpen,
  Globe,
  Trash2,
} from "lucide-react";
import Modal from "./common/Modal";
import FormField from "./common/FormField";
import Toast from "../components/common/Toast";
import { useUtils } from "../context";



const QuickActions = () => {
  const { toast, showToast, uploadImage, apiRequest, handleAsyncOperation } = useUtils();
  const [activeModal, setActiveModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    profile_image: null,
    address: "",
    groups: [],
    role: "",
    imageFile: null,
    approved: false
  });
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    verse: "",
    location: "",
    additionalInfo: "",
    images: [],
    imageFiles: []
  });
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    target_groups: "General",
    post_on_website: false,
    announcementMode: "phone",
    selectedTargetGroups: []
  });
  
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    verse: "",
    schedule: [""],
    image: null,
    imageFile: null
  });
  
  const [newMedia, setNewMedia] = useState({
    mediaImages: [],
    mediaTarget: "top"
  });


  
  const openModal = (key) => setActiveModal(key);
  
  const closeModal = () => {
    setActiveModal(null);
    setNewMember({ name: "", phone: "", email: "", profile_image: null, address: "", groups: [], role: "", imageFile: null, approved: false });
    setNewEvent({ title: "", date: "", time: "", verse: "", location: "", additionalInfo: "", images: [], imageFiles: [] });
    setNewAnnouncement({ title: "", content: "", target_groups: "General", post_on_website: false, announcementMode: "phone", selectedTargetGroups: [] });
    setNewService({ title: "", description: "", verse: "", schedule: [""], image: null, imageFile: null });
    setNewMedia({ mediaImages: [], mediaTarget: "top" });
    setSubmitting(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewMember(prev => ({ ...prev, profile_image: previewURL, imageFile: file }));
    }
  };
  
  const handleEventImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = newEvent.imageFiles.length + selectedFiles.length;
    
    if (totalImages > 10) {
      showToast('You can only upload up to 10 images.', 'error');
      return;
    }
    
    setNewEvent(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...selectedFiles],
      images: [...prev.images, ...selectedFiles.map(file => URL.createObjectURL(file))]
    }));
  };
  
  const handleRemoveEventImage = (index) => {
    setNewEvent(prev => {
      const newImageFiles = [...prev.imageFiles];
      const newImages = [...prev.images];
      URL.revokeObjectURL(newImages[index]);
      newImageFiles.splice(index, 1);
      newImages.splice(index, 1);
      return { ...prev, imageFiles: newImageFiles, images: newImages };
    });
  };
  
  const handleServiceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewService(prev => ({ ...prev, image: previewURL, imageFile: file }));
    }
  };
  
  const handleMediaImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setNewMedia(prev => ({ ...prev, mediaImages: [...prev.mediaImages, ...newPreviews] }));
  };
  
  const removeMediaImage = (index) => {
    setNewMedia(prev => ({ 
      ...prev, 
      mediaImages: prev.mediaImages.filter((_, i) => i !== index) 
    }));
  };
  
  const toggleTargetGroup = (group) => {
    setNewAnnouncement(prev => ({
      ...prev,
      selectedTargetGroups: prev.selectedTargetGroups.includes(group)
        ? prev.selectedTargetGroups.filter(x => x !== group)
        : [...prev.selectedTargetGroups, group]
    }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
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
        
        await apiRequest('/members', {
          method: 'POST',
          body: JSON.stringify(memberData)
        });
        closeModal();
      },
      setSubmitting,
      'Member created successfully!'
    );
  };
  
  const handleAddEvent = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
        const imageUrls = [];
        for (let file of newEvent.imageFiles) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
        
        const eventData = {
          title: newEvent.title,
          date: newEvent.date,
          time: newEvent.time,
          verse: newEvent.verse,
          location: newEvent.location,
          additionalInfo: newEvent.additionalInfo,
          images: imageUrls
        };
        
        await apiRequest('/events', {
          method: 'POST',
          body: JSON.stringify(eventData)
        });
        closeModal();
      },
      setSubmitting,
      'Event created successfully!'
    );
  };
  
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
        const target_groups = newAnnouncement.announcementMode === 'phone' 
          ? newAnnouncement.selectedTargetGroups.join(',') 
          : 'website';
        
        const announcementData = {
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          target_groups,
          post_on_website: newAnnouncement.post_on_website
        };
        
        await apiRequest('/announcements/create', {
          method: 'POST',
          body: JSON.stringify(announcementData)
        });
        closeModal();
      },
      setSubmitting,
      'Announcement created successfully!'
    );
  };
  
  const handleAddService = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
        let imageUrl = newService.image;
        
        if (newService.imageFile) {
          imageUrl = await uploadImage(newService.imageFile);
        }
        
        const serviceData = {
          title: newService.title,
          description: newService.description,
          verse: newService.verse,
          image: imageUrl || "https://placehold.co/300x200?text=Service+Image",
          schedule: newService.schedule.filter(s => s.trim())
        };
        
        await apiRequest('/services', {
          method: 'POST',
          body: JSON.stringify(serviceData)
        });
        closeModal();
      },
      setSubmitting,
      'Service scheduled successfully!'
    );
  };
  
  const handleAddMedia = async (e) => {
    e.preventDefault();
    await handleAsyncOperation(
      async () => {
        for (const item of newMedia.mediaImages) {
          const imageUrl = await uploadImage(item.file);
          
          await apiRequest('/media/upload', {
            method: 'POST',
            body: JSON.stringify({
              image_url: imageUrl,
              uploaded_by: "admin",
              target: newMedia.mediaTarget
            })
          });
        }
        closeModal();
      },
      setSubmitting,
      'Media uploaded successfully!'
    );
  };

  const renderModalContent = () => {
    if (activeModal === "member") {
      return (
        <form className="space-y-4" onSubmit={handleAddMember}>
          <FormField label="Full Name" icon={User} required>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Email Address" icon={Mail} required>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
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
              onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
            />
          </FormField>

          <FormField label="Role in Church" icon={Briefcase} required>
            <select
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
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
                        setNewMember({ ...newMember, groups: newGroups });
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
                    setNewMember({ ...newMember, groups: [...newMember.groups, value] });
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
              id="approved-quick"
              checked={newMember.approved}
              onChange={(e) => setNewMember({ ...newMember, approved: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="approved-quick" className="text-sm font-medium text-gray-700">
              Approve member immediately
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {submitting ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      );
    }
    
    if (activeModal === "event") {
      return (
        <form className="space-y-4" onSubmit={handleAddEvent}>
          <FormField label="Event Title" icon={Calendar} required>
            <input
              type="text"
              placeholder="Sunday Service"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Bible Verse" icon={User}>
            <input
              type="text"
              placeholder="John 3:16"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newEvent.verse}
              onChange={(e) => setNewEvent({ ...newEvent, verse: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date" icon={Calendar} required>
              <input
                type="date"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Time" icon={Calendar} required>
              <input
                type="time"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Location" icon={MapPin} required>
            <input
              type="text"
              placeholder="Church Main Hall"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Upload Images" icon={Image}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleEventImageUpload}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {newEvent.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {newEvent.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`preview-${index}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEventImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormField>

          <FormField label="Additional Info" icon={Briefcase} required>
            <textarea
              placeholder="Event details and additional information..."
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              value={newEvent.additionalInfo}
              onChange={(e) => setNewEvent({ ...newEvent, additionalInfo: e.target.value })}
              required
            />
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {submitting ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      );
    }
    
    if (activeModal === "service") {
      return (
        <form className="space-y-4" onSubmit={handleAddService}>
          <FormField label="Service Title" icon={Calendar} required>
            <input
              type="text"
              placeholder="Sunday Worship"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Upload Image" icon={Image} required>
            <input
              type="file"
              accept="image/*"
              onChange={handleServiceImageUpload}
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {newService.image && (
              <div className="mt-2">
                <img
                  src={newService.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}
          </FormField>

          <FormField label="Description" icon={FileText} required>
            <textarea
              placeholder="Enter details about the service..."
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Bible Verse" icon={BookOpen}>
            <textarea
              placeholder="Enter Bible verse..."
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
              value={newService.verse}
              onChange={(e) => setNewService({ ...newService, verse: e.target.value })}
            />
          </FormField>

          <FormField label="Schedule" icon={Calendar}>
            <div className="space-y-2">
              {newService.schedule.map((schedule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Weekly, Monthly, Special Event"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={schedule}
                    onChange={(e) => {
                      const newSchedules = [...newService.schedule];
                      newSchedules[index] = e.target.value;
                      setNewService({ ...newService, schedule: newSchedules });
                    }}
                  />
                  {newService.schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newSchedules = newService.schedule.filter((_, i) => i !== index);
                        setNewService({ ...newService, schedule: newSchedules });
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNewService({ ...newService, schedule: [...newService.schedule, ""] })}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition"
              >
                Add Schedule
              </button>
            </div>
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {submitting ? 'Scheduling...' : 'Schedule Service'}
          </button>
        </form>
      );
    }
    
    if (activeModal === "announcement") {
      const targetGroups = ["General", "Youth", "Women Fellowship", "Men Fellowship", "Elders"];
      
      return (
        <form className="space-y-4" onSubmit={handleAddAnnouncement}>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="phone"
                checked={newAnnouncement.announcementMode === "phone"}
                onChange={() => {
                  setNewAnnouncement(prev => ({ 
                    ...prev, 
                    announcementMode: "phone", 
                    post_on_website: false 
                  }));
                }}
              />
              <Phone className="w-4 h-4" /> Phone
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="website"
                checked={newAnnouncement.announcementMode === "website"}
                onChange={() => {
                  setNewAnnouncement(prev => ({ 
                    ...prev, 
                    announcementMode: "website", 
                    post_on_website: true 
                  }));
                }}
              />
              <Globe className="w-4 h-4" /> Website
            </label>
          </div>
          
          <input
            type="text"
            placeholder="Announcement Title"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          {newAnnouncement.announcementMode === "phone" && (
            <FormField label="Select Target Groups">
              <div className="grid grid-cols-2 gap-2">
                {targetGroups.map((group) => (
                  <label key={group} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.selectedTargetGroups.includes(group)}
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
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
            required
          />
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {submitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      );
    }
    
    if (activeModal === "media") {
      return (
        <form className="space-y-4" onSubmit={handleAddMedia}>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="carousel"
                value="top"
                checked={newMedia.mediaTarget === "top"}
                onChange={() => setNewMedia(prev => ({ ...prev, mediaTarget: "top" }))}
              />
              Top Carousel
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="carousel"
                value="donation"
                checked={newMedia.mediaTarget === "donation"}
                onChange={() => setNewMedia(prev => ({ ...prev, mediaTarget: "donation" }))}
              />
              Donation Carousel
            </label>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleMediaImageUpload}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {newMedia.mediaImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {newMedia.mediaImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.preview}
                    alt="preview"
                    className="rounded w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMediaImage(i)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            {submitting && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {submitting ? 'Uploading...' : 'Upload Media'}
          </button>
        </form>
      );
    }
    
    return null;
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case "member": return "Add New Member";
      case "event": return "Create New Event";
      case "announcement": return "Create Announcement";
      case "service": return "Schedule Service";
      case "media": return "Upload Media";
      default: return "Quick Action";
    }
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => openModal("member")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition duration-200"
        >
          <UserPlus className="w-4 h-4" /> Add New Member
        </button>
        
        <button
          onClick={() => openModal("event")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition duration-200"
        >
          <Calendar className="w-4 h-4" /> Create Event
        </button>
        
        <button
          onClick={() => openModal("announcement")}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition duration-200"
        >
          <Megaphone className="w-4 h-4" /> Make Announcement
        </button>
        
        <button
          onClick={() => openModal("service")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition duration-200"
        >
          <Church className="w-4 h-4" /> Schedule Service
        </button>
        
        <button
          onClick={() => openModal("media")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition duration-200"
        >
          <Image className="w-4 h-4" /> Upload Media
        </button>
      </div>
      
      <Modal
        isOpen={!!activeModal}
        onClose={closeModal}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default QuickActions;