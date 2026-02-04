import React, { useState } from "react";
import { motion } from "framer-motion";
import Apostle_PK from "../assets/Apostle_PK.jpg";
import Pastor_Geina from "../assets/Pastor_Geina.jpg";
import Pastor_Alfred from "../assets/Pastor_Alfred.jpg";
import Pastor_David from "../assets/Pastor_David.jpg";
import Pastor_Giuseppina from "../assets/Pastor_Giuseppina.jpg";

const leaders = [
  {
    name: "Apostle Oheneba Poku (PK)",
    title: "Founder & Lead Pastor",
    image: Apostle_PK,
    bio: "Leading with vision and passion to transform lives through the power of God's Word."
  },
  {
    name: "Pastor Geina",
    title: "Resident Pastor",
    image: Pastor_Geina,
    bio: "Dedicated to nurturing spiritual growth and providing pastoral care to the congregation."
  },
  {
    name: "Pastor Alfred",
    title: "Head of Charity & Outreach Foundation",
    image: Pastor_Alfred,
    bio: "Committed to extending God's love through community service and charitable initiatives."
  },
  {
    name: "Pastor David",
    title: "Head of Youth Ministry",
    image: Pastor_David,
    bio: "Inspiring the next generation to develop a personal relationship with Christ."
  },
  {
    name: "Pastor Giuseppina Wetteyson",
    title: "Head of Chosen Generation",
    image: Pastor_Giuseppina,
    bio: "Leading and mentoring young adults in their spiritual journey and purpose."
  }
];

const LeadershipPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(null);
  const [direction, setDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPreviousSlide(currentSlide);
    setDirection('right');
    setCurrentSlide((prev) => (prev + 1) % leaders.length);
    setTimeout(() => {
      setPreviousSlide(null);
      setIsAnimating(false);
    }, 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPreviousSlide(currentSlide);
    setDirection('left');
    setCurrentSlide((prev) => (prev - 1 + leaders.length) % leaders.length);
    setTimeout(() => {
      setPreviousSlide(null);
      setIsAnimating(false);
    }, 700);
  };

  return (
    <section className="bg-white pt-32 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Leadership</h2>
        
        <div className="relative">
          {/* Current Slide */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Left Side - Image */}
            <div className="md:col-span-7">
              <div 
                key={`current-${currentSlide}`}
                className={`h-96 w-full overflow-hidden ${
                  direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                }`}
              >
                <img
                  src={leaders[currentSlide].image}
                  alt={leaders[currentSlide].name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-103"
                />
              </div>
            </div>
            
            {/* Right Side - Content */}
            <div className="md:col-span-5 flex flex-col justify-center text-left">
              <div 
                key={`content-${currentSlide}`}
                className={direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{leaders[currentSlide].name}</h3>
                <p className="text-lg text-gray-600 mb-2">{leaders[currentSlide].title}</p>
                <p className="text-gray-700 leading-relaxed mb-6">{leaders[currentSlide].bio}</p>
              </div>
            </div>
          </div>

          {/* Previous Slide (Exiting) */}
          {previousSlide !== null && previousSlide !== currentSlide && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-7">
                  <div 
                    className={`h-96 w-full overflow-hidden ${
                      direction === 'right' ? 'animate-slide-out-left' : 'animate-slide-out-right'
                    }`}
                  >
                    <img
                      src={leaders[previousSlide].image}
                      alt={leaders[previousSlide].name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="md:col-span-5 flex flex-col justify-center text-left">
                  <div className={direction === 'right' ? 'animate-slide-out-left' : 'animate-slide-out-right'}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{leaders[previousSlide].name}</h3>
                    <p className="text-lg text-gray-600 mb-2">{leaders[previousSlide].title}</p>
                    <p className="text-gray-700 leading-relaxed mb-6">{leaders[previousSlide].bio}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
          >
            ❮
          </button>
          <span className="text-lg font-medium">{currentSlide + 1}/{leaders.length}</span>
          <button
            onClick={handleNext}
            className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default LeadershipPage;