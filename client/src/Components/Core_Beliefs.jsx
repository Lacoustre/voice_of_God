import { motion } from "framer-motion";
import { Heart, BookOpen, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import church_1 from "../assets/church_photo_1.JPEG";

export default function CoreBeliefSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const progress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 1 - scrollProgress * 0.6;
  const translateX = -scrollProgress * 80;

  return (
    <section
      ref={sectionRef}
      id="core-belief"
      className="relative py-16 md:py-32 overflow-hidden bg-white"
      aria-labelledby="core-belief-heading"
    >
      {/* Background Image - Desktop Only */}
      <div 
        className="hidden md:block absolute inset-0 w-full h-full"
        style={{
          transform: `scale(${scale}) translateX(${translateX}%)`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out'
        }}
      >
        <img
          src={church_1}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile Image */}
        <div className="md:hidden w-screen -mx-4 h-64 mb-8">
          <img
            src={church_1}
            alt="Core Belief"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Content - Right Side */}
          <div className="md:col-start-8 md:col-span-5 relative z-10">
            <p className="uppercase tracking-widest text-xs font-semibold mb-3 md:mb-4">About</p>
            <h2 id="core-belief-heading" className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
              Core Belief
            </h2>
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
              We are a Christ-centered community committed to loving and welcoming all people. While we embrace everyone
              with compassion and respect, we uphold the Bible as the ultimate authority and guide for life. We believe
              that all people, regardless of background, are on a journey of transformation—turning from worldly desires
              and aligning their lives with God's will. Together, we walk in Grace, stand in Truth, and pursue lasting change through the hope found in Jesus Christ.
            </p>

            {/* Pillars */}
            <ul className="space-y-3 mb-6 md:mb-8">
              <li className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg">
                  <Heart className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">Grace</p>
                  <p className="text-sm text-primary-600">Love that welcomes and restores</p>
                </div>
              </li>
              <li className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">Truth</p>
                  <p className="text-sm text-primary-600">Scripture as our foundation</p>
                </div>
              </li>
              <li className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">Transformation</p>
                  <p className="text-sm text-primary-600">A lifelong journey with Jesus</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}