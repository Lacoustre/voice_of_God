import React, { useState, useEffect, useRef } from "react";
import { Image, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Modal from "../components/common/Modal";
import { toast } from "react-toastify";
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <Image size={20} className="text-indigo-600" />
        {type === "top" ? "Top Carousel Showcase" : "Donation Carousel Highlights"} ({data.length})
      </h3>

      <div className="overflow-y-auto max-h-[420px] pr-1 custom-scroll">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((item) => (
            <div
              key={item.$id}
              className="relative bg-white border rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={item.image_url}
                alt="Media"
                className="w-full h-48 object-cover"
              />

              <div className="absolute top-2 left-2" ref={dropdownRef}>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(openDropdownId === item.$id ? null : item.$id)
                    }
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.pusblished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.pusblished ? "Published" : "Unpublished"}
                    {openDropdownId === item.$id ? (
                      <ChevronUp size={14} className="inline ml-1" />
                    ) : (
                      <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </button>

                  {openDropdownId === item.$id && (
                    <div className="absolute mt-1 z-10 w-28 bg-white border rounded shadow">
                      {[true, false]
                        .filter((val) => val !== item.pusblished)
                        .map((status) => (
                          <button
                            key={String(status)}
                            onClick={() => onTogglePublish(item, type)}
                            className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            {status ? "Published" : "Unpublished"}
                          </button>
                        ))}
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

  useEffect(() => {
    fetchUploadedMedia();
  }, []);

  const fetchUploadedMedia = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const result = await fetchMedia();
    if (result.success) {
      setUploadedMedia(result.data);
    }
    setLoading(false);
  };

  const handleTogglePublish = async (item, target) => {
    setActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await updateMedia(item.$id, target, !item.pusblished);
    if (result.success) {
      toast.success(`Media ${!item.pusblished ? "published" : "unpublished"}`);
      await fetchUploadedMedia();
    } else {
      toast.error("Failed to update media");
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
    setActionLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const { item, type } = confirmDelete;
    const result = await deleteMedia(item.$id, type);
    if (result.success) {
      toast.success("Media deleted successfully");
      await fetchUploadedMedia();
    } else {
      toast.error("Failed to delete media");
    }
    setActionLoading(false);
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    for (const item of mediaImages) {
      const fileResult = await uploadFile(item.file);
      if (fileResult.success) {
        const mediaResult = await uploadMedia(
          fileResult.url,
          user?.name || user?.email || "admin",
          mediaTarget
        );

        if (mediaResult.success) {
          toast.success("Media uploaded successfully!");
        } else {
          toast.error("Failed to upload media.");
        }
      } else {
        toast.error("Failed to upload file.");
      }
    }

    await fetchUploadedMedia();
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
        <div className="flex flex-col justify-center items-center h-64 text-lg text-gray-500">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          Loading media...
        </div>
      ) : (
        <div className="space-y-10">
          <MediaSection
            title="Top Carousel"
            type="top"
            data={uploadedMedia.top}
            onTogglePublish={handleTogglePublish}
            onDelete={openConfirmDelete}
          />

          <MediaSection
            title="Donation Carousel"
            type="donation"
            data={uploadedMedia.donation}
            onTogglePublish={handleTogglePublish}
            onDelete={openConfirmDelete}
          />
        </div>
      )}

      {/* Upload Modal */}
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
            {actionLoading && <Loader2 className="animate-spin h-4 w-4" />}
            Upload
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
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
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                onClick={handleConfirmedDelete}
                disabled={actionLoading}
              >
                {actionLoading && <Loader2 className="animate-spin h-4 w-4" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
