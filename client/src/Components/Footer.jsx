import React, { useState } from "react";
import SocialIcon from "./Icons";
import { Link } from "react-router-dom";
import logo from "../assets/modified_logo.png";
import Toast from "./Toast";
import { validateEmail, validatePhone, formatPhoneNumber } from "../utils/validation";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Heart } from "lucide-react";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingMessage) return;

    if (!validateEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!validatePhone(phone)) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    if (!message.trim()) {
      showToast("Please enter a message", "error");
      return;
    }

    setIsSubmittingMessage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch("https://voice-of-god.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          message,
        }),
      });

      if (response.ok) {
        showToast("Thank you! Your message has been sent successfully!");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        showToast(`Message could not be sent: ${errorData.message || "Please try again later"}`, "error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return (
    <footer id="contact" className="bg-primary-900 text-white py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between mb-16 gap-12">
          <div className="mb-8 md:mb-0 md:max-w-xl">
            <h3 className="text-3xl font-semibold tracking-tight mb-6 transform transition duration-500 ease-in-out hover:scale-105 text-white">
              New to Voice of God Ministries?
            </h3>
            <p className="text-lg text-white leading-relaxed mb-4 font-bold">
              We are a ministry of faith, community, and worship. Since 2019, we have opened our doors to the Greater Hartford community...
            </p>
            <p className="text-lg text-white leading-relaxed italic border-l-4 border-white pl-4 mb-4 font-bold">
              Matthew 18:20 - "For where two or three are gathered together in my name, there am I in the midst of them."
            </p>
            <p className="text-lg text-white leading-relaxed mb-4 font-bold">
              We invite you to join us..
            </p>
            <Link to="/" onClick={scrollToTop}>
              <div className="bg-primary-900 rounded-lg mt-10 p-2">
                <img src={logo} alt="Logo" className="h-50 mt-6" />
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap gap-16 mb-8 md:mb-0">
            <div className="min-w-[160px]">
              <h4 className="font-bold text-xl mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/" onClick={scrollToTop} className="text-white hover:text-primary-200 group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">HOME</span></Link></li>
                <li><a href="#leadership" onClick={(e) => { e.preventDefault(); document.getElementById('leadership').scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-white hover:text-primary-200 group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">LEADERSHIP</span></a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services').scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-white hover:text-primary-200 group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">SERVICES</span></a></li>
                <li><a href="#ministries" onClick={(e) => { e.preventDefault(); document.getElementById('ministries').scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-white hover:text-primary-200 group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">MINISTRIES</span></a></li>
                <li><a href="#events" onClick={(e) => { e.preventDefault(); document.getElementById('events').scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="text-white hover:text-primary-200 group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">EVENTS</span></a></li>
              </ul>
            </div>

            <div className="min-w-[200px]">
              <h4 className="font-bold text-xl mb-6 text-white">Contact</h4>
              <ul className="space-y-4">
                <li><a href="tel:8607263424" className="text-white hover:text-primary-200 flex items-center group"><FaPhone className="mr-2 text-white" /><span className="group-hover:translate-x-2 transition-transform">+1 (860) 726-3424</span></a></li>
                <li><a href="mailto:INFO@THEVOGMINISTRIES.ORG" className="text-white hover:text-primary-200 flex items-center group"><FaEnvelope className="mr-2 text-white" /><span className="group-hover:translate-x-2 transition-transform break-all">INFO@THEVOGMINISTRIES.ORG</span></a></li>
                <li><a href="https://maps.google.com/?q=52+Connecticut+Avenue+A+South+Windsor+CT+06074" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-200 flex items-center group"><FaMapMarkerAlt className="mr-2 text-white" /><span className="group-hover:translate-x-2 transition-transform">52 Connecticut Avenue, A<br />South Windsor, CT 06074</span></a></li>
              </ul>

              <h1 className="text-white text-2xl font-bold mt-6">Send us a message</h1>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-col space-y-4">
                  <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)} className="p-2 rounded-lg bg-white/20 text-white text-center placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white" required />
                  <input type="tel" placeholder="Your phone" value={phone} onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)} className="p-2 rounded-lg bg-white/20 text-white text-center placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white" required />
                  <textarea placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit(e)} className="p-2 rounded-lg bg-white/20 text-white text-center placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white" rows="4" required />
                  <button type="submit" disabled={isSubmittingMessage} className="p-2 px-4 border border-white bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                    {isSubmittingMessage && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {isSubmittingMessage ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-8 mb-12">
          <SocialIcon href="https://www.facebook.com/vogohenebaPK/" icon="facebook" label="Facebook" />
          <SocialIcon href="https://www.instagram.com/vogministries?igsh=eDV0YnJ3NTV5MzRi" icon="instagram" label="Instagram" />
          <SocialIcon href="https://www.youtube.com/@VoiceOfGodMinistries/streams" icon="youtube" label="YouTube" />
        </div>

        <div className="text-center mb-8">
          <Link to="/join" onClick={scrollToTop} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-600 hover:shadow-lg hover:scale-105 transition-all duration-200">
            <Heart size={20} />
            Join Our Church Family
          </Link>
        </div>

        <p className="text-center text-sm text-white opacity-80">
          &copy; {new Date().getFullYear()} Voice of God Ministries. All rights reserved.
        </p>
      </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </footer>
  );
};

export default Footer;
