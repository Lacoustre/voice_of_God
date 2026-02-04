import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Mail, MapPin, Briefcase, Image, 
  Upload, X, ChevronDown, Users, Heart, Star
} from "lucide-react";
import Toast from "./Toast";
import { validateEmail, validatePhone, formatPhoneNumber } from "../utils/validation";

const API_BASE_URL = "https://voice-of-god.onrender.com/api";

const FormField = ({ label, icon: Icon, required, children, description }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <Icon size={16} className="text-orange-500" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {description && (
      <p className="text-xs text-gray-500">{description}</p>
    )}
    {children}
  </div>
);

const JoinModal = ({ isOpen, onClose }) => {
  const [member, setMember] = useState({
    name: "", phone: "", email: "", address: "",
    role: "", groups: [], profile_image: null, approved: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef(null);
  const confettiIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setShowConfetti(false);
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (showConfetti) {
      const launchConfetti = () => {
        const count = 50;
        const colors = ['#ff6b35', '#f7931e', '#fdc830', '#37ecba', '#72ddf7'];
        const particles = [];
        
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * window.innerWidth,
            y: -20,
            vx: (Math.random() - 0.5) * 10,
            vy: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360
          });
        }
        
        let confettiElement = document.getElementById('confetti-canvas');
        if (!confettiElement) {
          confettiElement = document.createElement('canvas');
          confettiElement.id = 'confetti-canvas';
          confettiElement.style.position = 'fixed';
          confettiElement.style.top = '0';
          confettiElement.style.left = '0';
          confettiElement.style.width = '100%';
          confettiElement.style.height = '100%';
          confettiElement.style.pointerEvents = 'none';
          confettiElement.style.zIndex = '9999';
          document.body.appendChild(confettiElement);
        }
        
        confettiElement.width = window.innerWidth;
        confettiElement.height = window.innerHeight;
        const ctx = confettiElement.getContext('2d');
        
        function animate() {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          
          particles.forEach((p, index) => {
            p.y += p.vy;
            p.x += p.vx;
            p.rotation += 5;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
            
            if (p.y > window.innerHeight) {
              particles.splice(index, 1);
            }
          });
          
          if (particles.length > 0 && showConfetti) {
            requestAnimationFrame(animate);
          }
        }
        
        animate();
      };
      
      launchConfetti();
      confettiIntervalRef.current = setInterval(launchConfetti, 1000);
      
      return () => {
        if (confettiIntervalRef.current) {
          clearInterval(confettiIntervalRef.current);
        }
        const confettiElement = document.getElementById('confetti-canvas');
        if (confettiElement) {
          document.body.removeChild(confettiElement);
        }
      };
    }
  }, [showConfetti]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }
      const previewURL = URL.createObjectURL(file);
      setMember((prev) => ({ ...prev, profile_image: previewURL, imageFile: file }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE_URL}/members/upload-image`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const removeGroup = (groupToRemove) => {
    setMember(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group !== groupToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!member.name.trim()) {
      showToast("Please enter your full name", "error");
      return;
    }
    
    if (!member.email.trim()) {
      showToast("Please enter your email address", "error");
      return;
    }
    
    if (!validateEmail(member.email)) {
      showToast("Please enter a valid email address format", "error");
      return;
    }
    
    if (!member.phone.trim()) {
      showToast("Please enter your phone number", "error");
      return;
    }
    
    if (!validatePhone(member.phone)) {
      showToast("Please enter a valid phone number (at least 10 digits)", "error");
      return;
    }
    
    if (!member.role) {
      showToast("Please select your role in the church", "error");
      return;
    }
    
    if (!member.profile_image) {
      showToast("Please upload your profile photo", "error");
      return;
    }
    
    try {
      setLoading(true);
      
      let imageUrl = "";
      if (member.imageFile) {
        imageUrl = await uploadImage(member.imageFile);
      }

      const newMember = {
        name: member.name,
        phone: member.phone,
        email: member.email,
        address: member.address,
        role: member.role,
        groups: member.groups,
        profile_image: imageUrl,
        approved: false
      };

      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      showToast("Registration submitted successfully! Your membership is pending approval.");
      setShowConfetti(true);
      setTimeout(() => onClose(), 3000);
      setMember({
        name: "", phone: "", email: "", address: "",
        role: "", groups: [], profile_image: null, approved: false
      });
      if (fileInputRef.current) fileInputRef.current.value = null;
      setStep(1);

    } catch (err) {
      console.error(err);
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = member.name && member.phone && member.email && member.role;
  const isStep2Valid = member.profile_image !== null;
  const isFormValid = isStep1Valid && isStep2Valid;
  const progress = step === 1 ? 50 : 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Join Voice of God Ministry
              </h1>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'
                  }`}>
                    1
                  </div>
                  <span className="font-medium">Personal Info</span>
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'
                  }`}>
                    2
                  </div>
                  <span className="font-medium">Groups & Photo</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Full Name" icon={User} required>
                      <input
                        type="text"
                        placeholder="Prince Nyamekeh"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        value={member.name}
                        onChange={(e) => setMember({ ...member, name: e.target.value })}
                        required
                      />
                    </FormField>

                    <FormField label="Your Role" icon={Briefcase} required>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none"
                          value={member.role}
                          onChange={(e) => setMember({ ...member, role: e.target.value })}
                          required
                        >
                          <option value="">Choose your calling...</option>
                          <option value="Member">Member</option>
                          <option value="Leader">Ministry Leader</option>
                          <option value="Pastor">Pastor</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Phone Number" icon={Phone} required>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        placeholder="+1 (555) 123-4567"
                        value={member.phone}
                        onChange={(e) => setMember({ ...member, phone: formatPhoneNumber(e.target.value) })}
                        required
                      />
                    </FormField>
                    <FormField label="Email Address" icon={Mail} required>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        placeholder="prince@example.com"
                        value={member.email}
                        onChange={(e) => setMember({ ...member, email: e.target.value })}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Home Address" icon={MapPin}>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      placeholder="123 Faith Street, Hope City, HC 12345"
                      value={member.address}
                      onChange={(e) => setMember({ ...member, address: e.target.value })}
                    />
                  </FormField>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                        isStep1Valid
                          ? 'bg-slate-700 text-white hover:bg-slate-800'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue to Groups & Photo
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <FormField label="Ministry Groups" icon={Users}>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && !member.groups.includes(value)) {
                            setMember({ ...member, groups: [...member.groups, value] });
                          }
                          e.target.value = "";
                        }}
                      >
                        <option value="">+ Add a group...</option>
                        <option value="Children's Ministry">Children's Ministry</option>
                        <option value="Youth Ministry">Youth Ministry</option>
                        <option value="Women's Fellowship">Women's Fellowship</option>
                        <option value="Men's Fellowship">Men's Fellowship</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>

                    {member.groups.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {member.groups.map((group, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                          >
                            <Star size={14} />
                            {group}
                            <button
                              type="button"
                              onClick={() => removeGroup(group)}
                              className="hover:bg-indigo-200 rounded-full p-1 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </FormField>

                  <FormField label="Profile Photo" icon={Image} required>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        dragActive 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-300 hover:border-indigo-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                      />
                      
                      {member.profile_image ? (
                        <div className="space-y-4">
                          <img 
                            src={member.profile_image} 
                            alt="Profile preview" 
                            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg" 
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Choose a different photo
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="text-indigo-600" size={24} />
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-700 font-medium">Drop your photo here</p>
                            <p className="text-sm text-gray-500">or</p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                              Browse Files
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormField>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isFormValid}
                      className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating your profile...
                        </div>
                      ) : (
                        "Complete Registration"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default JoinModal;
