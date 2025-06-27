import React, { useState } from "react";
import SocialIcon from "./Icons";
import { Link } from "react-router-dom";
import logo from "../assets/modified_logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingNewsletter) return;

    setIsSubmittingNewsletter(true);
    try {
      const response = await fetch("https://voice-of-god.onrender.com/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (response.ok) {
        toast.success("Thank you for subscribing to our newsletter!");
        setNewsletterEmail("");
      } else {
        const errorData = await response.json();
        toast.error(`Subscription failed: ${errorData.message || "Please try again"}`);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingMessage) return;

    setIsSubmittingMessage(true);
    try {

      const response = await fetch("https://voice-of-god.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Website Contact Form",
          email,
          phone,
          message,
        }),
      });

      if (response.ok) {
        toast.success("Thank you! Your message has been sent successfully!");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        toast.error(`Message could not be sent: ${errorData.message || "Please try again later"}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-black py-16 mt-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between mb-16 gap-12">
          <div className="mb-8 md:mb-0 md:max-w-xl">
            <h3 className="text-3xl font-semibold tracking-tight mb-6 transform transition duration-500 ease-in-out hover:scale-105 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
              New to Voice of God Ministries?
            </h3>
            <p className="text-lg text-gray-200 leading-relaxed mb-4 font-bold">
              We are a ministry of faith, community, and worship. Since 2019, we have opened our doors to the Greater Hartford community...
            </p>
            <p className="text-lg text-gray-200 leading-relaxed italic border-l-4 border-purple-300 pl-4 mb-4 font-bold">
              Matthew 18:20 - "For where two or three are gathered together in my name, there am I in the midst of them."
            </p>
            <p className="text-lg text-gray-200 leading-relaxed mb-4 font-bold">
              We invite you to join us..
            </p>
            <Link to="/" onClick={scrollToTop}>
              <div className="bg-gray-900 rounded-lg mt-10">
                <img src={logo} alt="Logo" className="h-50 mt-6" />
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap gap-16 mb-8 md:mb-0">
            <div className="min-w-[160px]">
              <h4 className="font-bold text-xl mb-6 text-purple-200">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/" onClick={scrollToTop} className="text-gray-200 hover:text-white group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">HOME</span></Link></li>
                <li><a href="#services" className="text-gray-200 hover:text-white group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">SERVICES</span></a></li>
                <li><a href="#donation" className="text-gray-200 hover:text-white group flex items-center transition-all duration-300"><span className="group-hover:translate-x-2 transition-transform">DONATE</span></a></li>
              </ul>
            </div>

            <div className="min-w-[200px]">
              <h4 className="font-bold text-xl mb-6 text-purple-200">Contact</h4>
              <ul className="space-y-4">
                <li><a href="tel:8607263424" className="text-gray-200 hover:text-white flex items-center group"><FaPhone className="mr-2 text-purple-200" /><span className="group-hover:translate-x-2 transition-transform">+1 (860) 726-3424</span></a></li>
                <li><a href="mailto:INFO@THEVOGMINISTRIES.ORG" className="text-gray-200 hover:text-white flex items-center group"><FaEnvelope className="mr-2 text-purple-200" /><span className="group-hover:translate-x-2 transition-transform break-all">INFO@THEVOGMINISTRIES.ORG</span></a></li>
                <li><a href="https://maps.google.com/?q=52+Connecticut+Avenue+A+South+Windsor+CT+06074" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white flex items-center group"><FaMapMarkerAlt className="mr-2 text-purple-200" /><span className="group-hover:translate-x-2 transition-transform">52 Connecticut Avenue, A<br />South Windsor, CT 06074</span></a></li>
              </ul>

              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200 text-2xl font-bold mt-6">Send us a message</h1>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-col space-y-4">
                  <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 rounded-lg bg-gray-700 text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  <input type="text" placeholder="Your phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 rounded-lg bg-gray-700 text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  <textarea placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} className="p-2 rounded-lg bg-gray-700 text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows="4" required />
                  <button type="submit" disabled={isSubmittingMessage} className="p-2 px-4 border border-white-600 bg-gray-600 text-white rounded-lg hover:bg-gray-900 hover:border-purple-700 transition-all duration-300 shadow-md">
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

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="md:w-1/3 text-left">
            <h4 className="font-bold text-xl mb-4 text-purple-200">Subscribe to Our Newsletter</h4>
            <p className="text-gray-200 mb-4 font-bold">Stay updated with our latest events and announcements</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:w-2/3 max-w-md">
            <input type="email" placeholder="Enter email to join our newsletter" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="p-2 text-center rounded-lg bg-gray-600 text-white placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow" required />
            <button type="submit" disabled={isSubmittingNewsletter} className="p-2 px-4 border border-white-600 bg-gray-600 text-white rounded-lg hover:bg-gray-900 hover:border-purple-700 transition-all duration-300 shadow-md">
              {isSubmittingNewsletter ? "Submitting..." : "Subscribe"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Voice of God Ministries. All rights reserved.
        </p>
      </div>


    </footer>
  );
};

export default Footer;
