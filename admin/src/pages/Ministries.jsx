import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, Trash, Plus } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import MinistryModal from "../components/MinistryModal";

const Ministries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMinistry, setCurrentMinistry] = useState(null);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://voice-of-god.onrender.com/api/ministries");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMinistries(data.ministries || []);
      } else {
        // If API returns no ministries yet, use default ones
        if (data.ministries && data.ministries.length === 0) {
          const defaultMinistries = [
            {
              id: "1",
              title: "Women's Ministry",
              description: "Our Women's Ministry provides a supportive community where women can grow in their faith, develop meaningful relationships, and serve others.",
              imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3",
              activities: [
                { title: "Bible Study Groups", description: "Weekly gatherings for spiritual growth and fellowship" },
                { title: "Prayer Circles", description: "Supporting one another through prayer and encouragement" },
                { title: "Outreach Programs", description: "Serving the community through various initiatives" }
              ],
              order: 1
            },
            {
              id: "2",
              title: "Men's Ministry",
              description: "Our Men's Ministry is dedicated to helping men grow in their relationship with God and become spiritual leaders in their homes, church, and community.",
              imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3",
              activities: [
                { title: "Brotherhood Meetings", description: "Monthly gatherings for fellowship and spiritual growth" },
                { title: "Mentorship Program", description: "Pairing experienced men with younger men for guidance" },
                { title: "Service Projects", description: "Using skills and strength to serve the church and community" }
              ],
              order: 2
            },
            // Add other ministries as needed
          ];
          setMinistries(defaultMinistries);
        } else {
          toast.error("Failed to load ministries");
        }
      }
    } catch (error) {
      console.error("Error fetching ministries:", error);
      toast.error("Error loading ministries: " + error.message);
      
      // Fallback to default ministries on error
      const fallbackMinistries = [
        {
          id: "1",
          title: "Women's Ministry",
          description: "Our Women's Ministry provides a supportive community where women can grow in their faith.",
          imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3",
          activities: [
            { title: "Bible Study Groups", description: "Weekly gatherings for spiritual growth" }
          ],
          order: 1
        },
        {
          id: "2",
          title: "Men's Ministry",
          description: "Our Men's Ministry is dedicated to helping men grow in their relationship with God.",
          imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3",
          activities: [
            { title: "Brotherhood Meetings", description: "Monthly gatherings for fellowship" }
          ],
          order: 2
        }
      ];
      setMinistries(fallbackMinistries);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMinistry = () => {
    setCurrentMinistry(null);
    setShowModal(true);
  };

  const handleEditMinistry = (ministry) => {
    setCurrentMinistry(ministry);
    setShowModal(true);
  };

  const handleDeleteMinistry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ministry?")) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://voice-of-god.onrender.com/api/ministries/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Ministry deleted successfully");
        fetchMinistries(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to delete ministry");
        // Update UI optimistically even if API fails
        setMinistries(prev => prev.filter(ministry => ministry.id !== id && ministry.$id !== id));
      }
    } catch (error) {
      console.error("Error deleting ministry:", error);
      toast.error(`Error deleting ministry: ${error.message}`);
      // Update UI optimistically even if API fails
      setMinistries(prev => prev.filter(ministry => ministry.id !== id && ministry.$id !== id));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMinistry = async (ministryData) => {
    try {
      setLoading(true);
      const url = currentMinistry 
        ? `https://voice-of-god.onrender.com/api/ministries/${currentMinistry.id || currentMinistry.$id}`
        : "https://voice-of-god.onrender.com/api/ministries";
      
      const method = currentMinistry ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ministryData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Ministry ${currentMinistry ? "updated" : "added"} successfully`);
        setShowModal(false);
        fetchMinistries(); // Refresh the list
      } else {
        toast.error(data.message || `Failed to ${currentMinistry ? "update" : "add"} ministry`);
        
        // Update UI optimistically even if API fails
        if (currentMinistry) {
          setMinistries(prev => 
            prev.map(ministry => 
              ministry.id === currentMinistry.id ? 
                { ...ministry, ...ministryData } : 
                ministry
            )
          );
        } else {
          const newMinistry = {
            ...ministryData,
            id: Date.now().toString(),
          };
          setMinistries(prev => [...prev, newMinistry]);
        }
        setShowModal(false);
      }
    } catch (error) {
      console.error(`Error ${currentMinistry ? "updating" : "adding"} ministry:`, error);
      toast.error(`Error ${currentMinistry ? "updating" : "adding"} ministry: ${error.message}`);
      
      // Update UI optimistically even if API fails
      if (currentMinistry) {
        setMinistries(prev => 
          prev.map(ministry => 
            ministry.id === currentMinistry.id ? 
              { ...ministry, ...ministryData } : 
              ministry
          )
        );
      } else {
        const newMinistry = {
          ...ministryData,
          id: Date.now().toString(),
        };
        setMinistries(prev => [...prev, newMinistry]);
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ministries</h1>
        <button
          onClick={handleAddMinistry}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Ministry
        </button>
      </div>

      {ministries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No ministries found. Add your first ministry!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry) => (
            <div
              key={ministry.$id || ministry.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={ministry.imageUrl || "https://via.placeholder.com/400x200?text=Ministry+Image"}
                  alt={ministry.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{ministry.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{ministry.description}</p>
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => handleEditMinistry(ministry)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full flex items-center gap-1"
                  >
                    <Edit size={18} /> <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMinistry(ministry.$id || ministry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full flex items-center gap-1"
                  >
                    <Trash size={18} /> <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MinistryModal
          ministry={currentMinistry}
          onClose={() => setShowModal(false)}
          onSave={handleSaveMinistry}
        />
      )}
    </div>
  );
};

export default Ministries;