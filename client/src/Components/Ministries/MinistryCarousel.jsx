import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function MinistryCarousel({ images, title }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl relative">
      <div className="relative h-80 w-full">
        {images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`${title} ${index + 1}`} 
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";
            }}
          />
        ))}
        <button 
          onClick={prevSlide} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        >
          <FaChevronRight />
        </button>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              className={`h-2 rounded-full ${
                currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
              } transition-all`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}