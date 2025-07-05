import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/modified_logo.png";
import background_image from "../assets/prayer.jpg";
import { useAuth } from "../context";
import Toast from "../components/common/Toast";
import { validateEmail } from "../utils/validation";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setToast({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    
    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    
    setSigningIn(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await login(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setToast({ message: result.error || 'Login failed', type: 'error' });
      }
    } catch (err) {
      console.error("Login failed:", err);
      setToast({ message: 'Login failed', type: 'error' });
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* LEFT: Info Panel */}
      <div className="w-[60%] relative text-white px-10 py-8 flex flex-col justify-between overflow-hidden">
        <img
          src={background_image}
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-800 opacity-50 z-0" />
        <div className="relative z-10 flex items-center gap-4">
          <a 
            href="https://thevogministries.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={logo}
              alt="Church Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold tracking-wide">Voice of God</h1>
          </a>
        </div>
        <div className="relative z-10 text-sm text-white/90 mt-auto">
          Manage church activities securely. Authorized church members only.
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-[40%] bg-black text-white px-10 py-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-xs">
          <h2 className="text-xl font-semibold mb-6 text-left">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-sm w-full">
            <div>
              <label className="block mb-1 text-left">Email</label>
              <div className="flex items-center bg-zinc-900 rounded px-3 py-1.5">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="bg-transparent outline-none w-full text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-left">Password</label>
              <div className="flex items-center bg-zinc-900 rounded px-3 py-1.5 relative">
                <Lock className="w-4 h-4 mr-2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
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

            <button
              type="submit"
              disabled={signingIn}
              className={`w-full flex items-center justify-center gap-2 text-sm bg-pink-600 hover:bg-pink-700 transition-all text-white font-medium py-1.5 rounded ${
                signingIn ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {signingIn ? (
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
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

export default SignIn;
