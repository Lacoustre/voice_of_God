import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const SocialIcon = ({ href, icon, label }) => {
  const getIcon = () => {
    switch (icon) {
      case "facebook":
        return <FaFacebook className="w-6 h-6" />;
      case "twitter":
        return <FaTwitter className="w-6 h-6" />;
      case "instagram":
        return <FaInstagram className="w-6 h-6" />;
      case "youtube":
        return <FaYoutube className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 rounded-full p-2"
    >
      {getIcon()}
    </a>
  );
};

export default SocialIcon;