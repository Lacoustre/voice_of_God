import React, { useState, useEffect } from "react";
import church_1 from "../assets/church_photo_1.JPEG";
import church_2 from "../assets/church_photo_2.JPEG";
import church_3 from "../assets/church_photo_3.jpg";
import church_4 from "../assets/church_photo_4.jpg";
import church_5 from "../assets/church_photo_5.JPG";
import church_6 from "../assets/church_photo_6.JPG";
import church_7 from "../assets/church_photo_7.jpeg";
import church_8 from "../assets/church_photo_8.JPG";
import church_9 from "../assets/church_photo_9.JPG";
import church_10 from "../assets/church_photo_10.JPG";

export default function CarouselComponent() {
  const fallbackImages = [
    church_1, church_2, church_3, church_4, church_5,
    church_6, church_7, church_8, church_9, church_10,
  ];
  
  const [carouselImages, setCarouselImages] = useState(fallbackImages);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/media/media');
        if (response.ok) {
          const data = await response.json();
          if (data.top && data.top.length > 0) {
            // Make sure we only use published items
            const publishedImages = data.top.filter(item => item.published).map(item => item.image_url);
            if (publishedImages.length > 0) {
              setCarouselImages(publishedImages);
            }
          }
        }
      } catch (error) {
        console.log('Using fallback carousel images');
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length, loading]);

  if (loading) {
    return (
      <div className="relative overflow-hidden h-64 sm:h-96 md:h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-64 sm:h-96 md:h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800/40 to-black/60 z-10" />

      {carouselImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
          }}
        >
          <img
            src={image}
            alt={`Church Image ${index + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
