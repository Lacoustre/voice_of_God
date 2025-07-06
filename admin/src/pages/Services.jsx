// ServicesPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { Calendar, Image, BookOpen, FileText } from "lucide-react";
import EditServiceModal from "../components/EditServiceModal";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import Toast from "../components/common/Toast";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com/api";

const ServiceCard = ({ service, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer border rounded-xl bg-white hover:shadow-md transition overflow-hidden flex flex-col"
  >
    {/* Image */}
    <div className="w-full h-72 overflow-hidden rounded-t-xl bg-gray-100">
      <img
        src={service.image}
        alt="service"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col space-y-2 text-left">
      {/* Title */}
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Title:</span> {service.title}
      </p>

      {/* Schedule */}
      {service.schedule && service.schedule.length > 0 && (
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Schedule:</span>{" "}
          {service.schedule.join(", ")}
        </p>
      )}

      {/* Description */}
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Description:</span>{" "}
        <span className="italic text-indigo-600">{service.description}</span>
      </p>
    </div>
  </div>
);


const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    verse: "",
    image: null,
    schedule: [""],
  });
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/services`);
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      showToast("Failed to fetch services", "error");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/services/upload-image`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const createService = async (serviceData) => {
    const response = await fetch(`${API_BASE_URL}/api/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.service;
  };

  const updateService = async (id, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.service;
  };

  const deleteService = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  };

  const handleSave = async (updatedService) => {
    try {
      setSubmitting(true);
      let imageUrl = updatedService.image;

      if (updatedService.imageFile) {
        imageUrl = await uploadImage(updatedService.imageFile);
      }

      const serviceData = {
        title: updatedService.title,
        description: updatedService.description,
        verse: updatedService.verse || "",
        image: imageUrl,
        schedule: updatedService.schedule?.filter((s) => s.trim()) || [],
      };

      console.log("Sending service data to backend:", serviceData);

      if (updatedService.$id || updatedService.id) {
        const serviceId = updatedService.$id || updatedService.id;
        await updateService(serviceId, serviceData);
        setServices((prev) =>
          prev.map((s) =>
            s.$id === serviceId || s.id === serviceId
              ? { ...s, ...updatedService, image: imageUrl }
              : s
          )
        );
        showToast("Service updated successfully!");
      } else {
        const newService = await createService(serviceData);
        setServices((prev) => [...prev, newService]);
        showToast("Service created successfully!");
      }
    } catch (err) {
      showToast("Failed to save service", "error");
      console.error("Error saving service:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.$id !== id && s.id !== id));
      showToast("Service deleted successfully!");
    } catch (err) {
      showToast("Failed to delete service", "error");
      console.error("Error deleting service:", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setNewService((prev) => ({
        ...prev,
        image: previewURL,
        imageFile: file,
      }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Church Services</h2>
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
          >
            <Calendar size={18} />
            Schedule Service
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

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

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[690px] overflow-y-auto pr-2 scrollbar-hide">
        {services.map((service) => (
          <ServiceCard
            key={service.$id || service.id}
            service={service}
            onClick={() => {
              console.log(
                "Service Modal Opened - Service Information:",
                service
              );
              setSelectedService(service);
            }}
          />
        ))}
      </div>

      {selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSave={async (data) => {
            await handleSave(data);
            setSelectedService(null);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Service"
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSave(newService);
            setNewService({
              title: "",
              description: "",
              verse: "",
              image: null,
              schedule: [""],
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
              onChange={(e) =>
                setNewService({ ...newService, title: e.target.value })
              }
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

          <FormField label="Description" icon={FileText} required>
            <textarea
              placeholder="Enter details about the service..."
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm resize-none"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              required
            />
          </FormField>

          <FormField label="Bible Verse" icon={BookOpen}>
            <textarea
              placeholder="Enter Bible verse..."
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm resize-none"
              rows={3}
              value={newService.verse}
              onChange={(e) =>
                setNewService({ ...newService, verse: e.target.value })
              }
            />
          </FormField>

          <FormField label="Schedule" icon={Calendar}>
            <div className="space-y-2">
              {newService.schedule.map((schedule, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Weekly, Monthly, Special Event"
                    className="flex-1 border rounded-md px-3 py-2 text-sm"
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
                        const newSchedules = newService.schedule.filter(
                          (_, i) => i !== index
                        );
                        setNewService({
                          ...newService,
                          schedule: newSchedules,
                        });
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setNewService({
                    ...newService,
                    schedule: [...newService.schedule, ""],
                  })
                }
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Add Schedule
              </button>
            </div>
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            {submitting ? "Scheduling..." : "Schedule Service"}
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

export default ServicesPage;
