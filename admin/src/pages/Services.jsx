// ServicesPage.jsx
import React, { useState, useRef } from "react";
import { Calendar, Clock, Image, BookOpen, FileText } from "lucide-react";
import EditServiceModal from "../components/EditServiceModal";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import bible_teaching from "../assets/bible_teaching.jpg";
import sunday_service from "../assets/sunday_service.jpg";
import prayer from "../assets/prayer.jpg";
import friday_night_prayers from "../assets/friday_night_prayers.jpeg";

const ServiceCard = ({ service, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer border rounded-xl bg-white hover:shadow-md transition overflow-hidden flex flex-col"
  >
    <div className="w-full h-72 overflow-hidden rounded-t-xl">
      <img
        src={service.image}
        alt="service"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4 flex flex-col space-y-2">
      <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
      <p className="text-sm text-gray-500">{service.day} — {service.time}</p>
      <p className="text-sm text-indigo-600 italic text-justify">
        {service.description}
      </p>
    </div>
  </div>
);

const ServicesPage = () => {
  const initialServices = [
    {
      id: 1,
      title: "Sunday Service",
      description: "Psalm 98:1 - Oh, sing to the Lord a new song! For He has done marvelous things...",
      time: "10 A.M. – 12:00 P.M. & 6 P.M. – 9 P.M.",
      day: "Sunday",
      image: sunday_service,
    },
    {
      id: 2,
      title: "Bible Teaching",
      description: "Psalm 18:30 - As for God, His way is perfect...",
      time: "6 P.M. – 8 P.M.",
      day: "Wednesday",
      image: bible_teaching,
    },
    {
      id: 3,
      title: "Prayer Line",
      description: "Engage in warfare prayers for breakthrough and divine transformation.",
      time: "8:00 P.M. - 9:00 P.M.",
      day: "Thursday",
      image: prayer,
    },
    {
      id: 4,
      title: "Friday Night Prayers",
      description: "Jeremiah 1:19 - Nothing shall prevail against you.",
      time: "9 P.M.",
      day: "Friday",
      image: friday_night_prayers,
    },
  ];

  const [services, setServices] = useState(initialServices);
  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    timeStart: "",
    timeEnd: "",
    image: null,
    description: "",
    verse: "",
    day: "",
  });
  const fileInputRef = useRef(null);

  const handleSave = (updatedService) => {
    setServices((prev) =>
      prev.some((s) => s.id === updatedService.id)
        ? prev.map((s) => (s.id === updatedService.id ? updatedService : s))
        : [...prev, { ...updatedService, id: Date.now() }]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewService((prev) => ({ ...prev, image: previewURL }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Church Services</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Calendar size={18} />
          Schedule Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[690px] overflow-y-auto pr-2">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      {selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSave={(data) => {
            handleSave(data);
            setSelectedService(null);
          }}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Service"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave({
              ...newService,
              time: `${newService.timeStart} – ${newService.timeEnd}`,
            });
            setNewService({
              title: "",
              timeStart: "",
              timeEnd: "",
              image: null,
              description: "",
              verse: "",
              day: "",
            });
            setShowAddModal(false);
          }}
        >
          <FormField label="Service Title" icon={Calendar} required>
            <input
              type="text"
              placeholder="Sunday Worship"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Start Time" icon={Clock} required>
              <input
                type="time"
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                value={newService.timeStart}
                onChange={(e) => setNewService({ ...newService, timeStart: e.target.value })}
                required
              />
            </FormField>
            <FormField label="End Time" icon={Clock} required>
              <input
                type="time"
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                value={newService.timeEnd}
                onChange={(e) => setNewService({ ...newService, timeEnd: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Day of the Week" icon={Calendar} required>
            <input
              type="text"
              placeholder="e.g. Sunday"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={newService.day}
              onChange={(e) => setNewService({ ...newService, day: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Upload Image" icon={Image} required>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              required
              ref={fileInputRef}
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

          <FormField label="Bible Verse" icon={BookOpen}>
            <input
              type="text"
              placeholder="John 3:16"
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              value={newService.verse}
              onChange={(e) => setNewService({ ...newService, verse: e.target.value })}
            />
          </FormField>

          <FormField label="Description" icon={FileText} required>
            <textarea
              placeholder="Enter details about the service..."
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm resize-none"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              required
            />
          </FormField>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Schedule Service
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesPage;
