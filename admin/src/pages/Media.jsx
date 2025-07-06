import React, { useState, useEffect, useRef } from "react";
import { Image, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Modal from "../components/common/Modal";
import LoadingButton from "../components/common/LoadingButton";
import Toast from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

const MediaSection = ({ title, type, data, onTogglePublish, onDelete }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center gap-2">
        <Image size={20} className="text-indigo-600" />
        {title} ({data.length})
      </h3>

      <div className="h-[650px] overflow-y-auto pr-2 mt-6 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={item.$id}
              className="relative bg-white border rounded-lg shadow hover:shadow-md transition overflow-hidden w-full"
            >
              <img
                src={item.image_url}
                alt="Media"
                className="w-full h-48 object-cover"
              />

              <div className="absolute top-2 left-2">
                <div className="relative" ref={openDropdownId === item.$id ? dropdownRef : null}>
                  <button
                    onClick={() =>
                      setOpenDropdownId(openDropdownId === item.$id ? null : item.$id)
                    }
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.published ? "Published" : "Unpublished"}
                    {openDropdownId === item.$id ? (
                      <ChevronUp size={14} className="inline ml-1" />
                    ) : (
                      <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </button>

                  {openDropdownId === item.$id && (
                    <div className="absolute mt-1 z-10 w-28 bg-white border rounded shadow">
                      <button
                        onClick={() => {
                          onTogglePublish(item, type);
                          setOpenDropdownId(null);
                        }}
                        className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        {item.published ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  onClick={() => onDelete(item, type)}
                  className="bg-white text-red-600 p-1 rounded-full shadow hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-3 text-sm text-gray-600">
                <p className="font-medium truncate">By: {item.uploaded_by}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const MediaPage = () => {
  const { user } = useAuth();
  const { uploadFile, fetchMedia, uploadMedia, updateMedia, deleteMedia } = useApp();

  const [mediaImages, setMediaImages] = useState([]);
  const [mediaTarget, setMediaTarget] = useState("top");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState({ top: [], donation: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, item: null, type: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchUploadedMedia();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUploadedMedia = async () => {
    setLoading(true);
    const result = await fetchMedia();
    if (result.success) {
      setUploadedMedia(result.data);
    }
    setLoading(false);
  };

  const refreshMedia = async () => {
    const result = await fetchMedia();
    if (result.success) {
      setUploadedMedia(result.data);
    }
  };

  const handleTogglePublish = async (item, target) => {
    console.log('handleTogglePublish called:', { item: item.$id, target, currentPublished: item.published });
    setActionLoading(true);
    const newPublishedState = !item.published;
    
    try {
      const result = await updateMedia(item.$id, target, newPublishedState);
      console.log('updateMedia result:', result);
      
      if (result.success) {
        showToast(`Media ${newPublishedState ? "published" : "unpublished"}`);
        // Immediately update local state to reflect the change
        setUploadedMedia(prev => ({
          ...prev,
          [target]: prev[target].map(mediaItem => 
            mediaItem.$id === item.$id 
              ? { ...mediaItem, published: newPublishedState }
              : mediaItem
          )
        }));
        console.log('Local state updated');
      } else {
        console.error('Update failed:', result.error);
        showToast(`Failed to update media: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error in handleTogglePublish:', error);
      showToast(`Error updating media: ${error.message}`, 'error');
    }
    setActionLoading(false);
  };

  const openConfirmDelete = (item, type) => {
    setConfirmDelete({ show: true, item, type });
  };

  const closeConfirmDelete = () => {
    setConfirmDelete({ show: false, item: null, type: null });
  };

  const handleConfirmedDelete = async () => {
    setIsDeleting(true);
    const { item, type } = confirmDelete;
    const result = await deleteMedia(item.$id, type);
    if (result.success) {
      showToast("Media deleted successfully");
      await refreshMedia();
    } else {
      showToast("Failed to delete media", 'error');
    }
    setIsDeleting(false);
    closeConfirmDelete();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setMediaImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setMediaImages((prev) => prev.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setShowUpload(false);
    setMediaImages([]);
    setMediaTarget("top");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    for (const item of mediaImages) {
      const fileResult = await uploadFile(item.file);
      if (fileResult.success) {
        const mediaResult = await uploadMedia(
          fileResult.url,
          user?.name || user?.email || "admin",
          mediaTarget
        );

        if (mediaResult.success) {
          showToast("Media uploaded successfully!");
        } else {
          showToast("Failed to upload media.", 'error');
        }
      } else {
        showToast("Failed to upload file.", 'error');
      }
    }

    await refreshMedia();
    setActionLoading(false);
    closeModal();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow border h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Media Management</h2>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
        >
          <Image size={16} /> Upload Media
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading media...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-r md:pr-4">
            <MediaSection
              title="Top Carousel"
              type="top"
              data={uploadedMedia.top}
              onTogglePublish={handleTogglePublish}
              onDelete={openConfirmDelete}
            />
          </div>

          <div className="md:pl-4">
            <MediaSection
              title="Donation Carousel"
              type="donation"
              data={uploadedMedia.donation}
              onTogglePublish={handleTogglePublish}
              onDelete={openConfirmDelete}
            />
          </div>
        </div>
      )}

      <Modal isOpen={showUpload} onClose={closeModal} title="Upload Media">
        <form className="space-y-4" onSubmit={handleUploadSubmit}>
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
                  src={img.preview}
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

          <button 
            className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            disabled={actionLoading}
          >
            {actionLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {actionLoading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </Modal>

      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
            <hr className="border-t border-gray-300" />
            <p className="text-sm text-gray-600">
              Are you sure you want to permanently delete this media file?
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                onClick={closeConfirmDelete}
              >
                Cancel
              </button>
              <LoadingButton
                isLoading={isDeleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmedDelete}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </LoadingButton>
            </div>
          </div>
        </div>
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

export default MediaPage;