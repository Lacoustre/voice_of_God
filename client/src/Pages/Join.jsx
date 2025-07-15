import React, { useState, useRef } from "react";
import {
  User, Phone, Mail, MapPin, Briefcase, Image, 
  Upload, X, ChevronDown, Users, Heart, Star
} from "lucide-react";
import Toast from "../Components/Toast";
import { validateEmail, validatePhone, formatPhoneNumber } from "../utils/validation";

const API_BASE_URL = "https://voice-of-god.onrender.com/api";



const FormField = ({ label, icon: Icon, required, children, description }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <Icon size={16} className="text-indigo-600" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {description && (
      <p className="text-xs text-gray-500">{description}</p>
    )}
    {children}
  </div>
);

const MemberRegistrationPage = () => {
  const [member, setMember] = useState({
    name: "", phone: "", email: "", address: "",
    role: "", groups: [], profile_image: null, approved: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

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
    
    if (!validateEmail(member.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    
    if (!validatePhone(member.phone)) {
      showToast("Please enter a valid phone number (at least 10 digits)", "error");
      return;
    }
    
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
        profile_image: imageUrl, // Always use the uploaded URL or empty string
        approved: false
      };

      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      showToast("Registration submitted successfully! Your membership is pending approval. 🙏");
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
  const progress = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Join Voice of God Ministry
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're excited to welcome you into our community of faith, love, and service. 
            Complete your registration to become part of something beautiful.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">Personal Info</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium">Groups & Photo</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
                  <p className="text-gray-600">We'd love to get to know you better</p>
                </div>

                <FormField 
                  label="Full Name" 
                  icon={User} 
                  required
                  description="Your full name as you'd like it to appear in our directory"
                >
                  <input
                    type="text"
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                    value={member.name}
                    onChange={(e) => setMember({ ...member, name: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && isStep1Valid && setStep(2)}
                    required
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Phone Number" icon={Phone} required>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                      placeholder="+1 (555) 123-4567"
                      value={member.phone}
                      onChange={(e) => setMember({ ...member, phone: formatPhoneNumber(e.target.value) })}
                      onKeyDown={(e) => e.key === 'Enter' && isStep1Valid && setStep(2)}
                      required
                    />
                  </FormField>
                  <FormField label="Email Address" icon={Mail} required>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                      placeholder="sarah@example.com"
                      value={member.email}
                      onChange={(e) => setMember({ ...member, email: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && isStep1Valid && setStep(2)}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Home Address" icon={MapPin}>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                    placeholder="123 Faith Street, Hope City, HC 12345"
                    value={member.address}
                    onChange={(e) => setMember({ ...member, address: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && isStep1Valid && setStep(2)}
                  />
                </FormField>

                <FormField 
                  label="Your Role" 
                  icon={Briefcase} 
                  required
                  description="How would you like to serve in our community?"
                >
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 appearance-none"
                      value={member.role}
                      onChange={(e) => setMember({ ...member, role: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && isStep1Valid && setStep(2)}
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isStep1Valid
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue to Groups & Photo
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h2>
                  <p className="text-gray-600">Select groups you'd like to be part of and add your photo</p>
                </div>

                <FormField 
                  label="Ministry Groups" 
                  icon={Users}
                  description="Join groups that align with your interests and calling"
                >
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 appearance-none"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !member.groups.includes(value)) {
                          setMember({ ...member, groups: [...member.groups, value] });
                        }
                        e.target.value = "";
                      }}
                    >
                      <option value="">+ Add a group...</option>
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
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium"
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

                <FormField 
                  label="Profile Photo" 
                  icon={Image}
                  description="Help us put a face to your name (optional, max 5MB)"
                >
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
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
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Looking great!</p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Choose a different photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
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
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating your profile...
                      </div>
                    ) : (
                      "Complete Registration 🎉"
                    )}
                  </button>
                </div>
              </div>
            )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Questions about registration? Contact us at{" "}
            <a href="mailto:welcome@church.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
             INFO@THEVOGMINISTRIES.ORG
            </a>
          </p>
        </div>
      </div>

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

export default MemberRegistrationPage;
