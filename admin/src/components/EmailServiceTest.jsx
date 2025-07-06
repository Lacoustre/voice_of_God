import React, { useState } from "react";
import Toast from "./common/Toast";
import LoadingButton from "./common/LoadingButton";
import { useApp } from "../context/AppContext";

const EmailServiceTest = () => {
  const { testEmailService } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setToast({ message: "Please enter an email address", type: "error" });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await testEmailService(email);
      
      if (result.success) {
        setToast({ message: "Test email sent successfully!", type: "success" });
      } else {
        setToast({ message: `Failed to send test email: ${result.error}`, type: "error" });
      }
    } catch (error) {
      console.error("Error testing email service:", error);
      setToast({ message: `Error: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Service Test</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Test Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <LoadingButton
          isLoading={loading}
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Sending..." : "Send Test Email"}
        </LoadingButton>
      </form>
      
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

export default EmailServiceTest;