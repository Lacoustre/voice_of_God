import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../context";
import { validateEmail } from "../utils/validation";

const ForgotPassword = ({ onBack }) => {
  const { requestPasswordReset, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setStep(2);
      } else {
        setError(result.error || "Failed to request password reset");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a temporary endpoint to verify the code without changing the password
      const res = await fetch('/api/password-reset/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep(3);
      } else {
        setError(data.error || "Invalid or expired verification code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await resetPassword(email, code, newPassword);
      if (result.success) {
        // Show success message and go back to login
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white mr-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold text-left">Reset Password</h2>
      </div>
      
      {step === 1 && (
        <form onSubmit={handleRequestReset} className="space-y-5 text-sm w-full">
          <div>
            <label className="block mb-1 text-left">Email</label>
            <div className="flex items-center bg-zinc-900 rounded px-3 py-1.5">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs text-left">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-sm bg-pink-600 hover:bg-pink-700 transition-all text-white font-medium py-1.5 rounded ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-5 text-sm w-full">
          <p className="text-gray-400 text-xs text-left mb-4">
            We've sent a 6-digit code to your email. Please enter it below.
          </p>
          
          <div>
            <label className="block mb-1 text-left">Verification Code</label>
            <div className="flex items-center bg-zinc-900 rounded px-3 py-1.5">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="bg-transparent outline-none w-full text-sm text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs text-left">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-sm bg-pink-600 hover:bg-pink-700 transition-all text-white font-medium py-1.5 rounded ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>
      )}
      
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-5 text-sm w-full">
          <div>
            <label className="block mb-1 text-left">New Password</label>
            <div className="flex items-center bg-zinc-900 rounded px-3 py-1.5 relative">
              <Lock className="w-4 h-4 mr-2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-sm pr-7"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block mb-1 text-left">Confirm Password</label>
            <div className="flex items-center bg-zinc-900 rounded px-3 py-1.5">
              <Lock className="w-4 h-4 mr-2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs text-left">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-sm bg-pink-600 hover:bg-pink-700 transition-all text-white font-medium py-1.5 rounded ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;