import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";
import men_1 from "../../assets/men_1.jpg";
import men_2 from "../../assets/men_2.jpg";

const fallbackMensImages = [men_1, men_2];

export default function MensMinistry() {
  const [mensImages, setMensImages] = useState(fallbackMensImages);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchMensImages = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/media/media');
        if (response.ok) {
          const data = await response.json();
          if (data.mens_ministry && data.mens_ministry.length > 0) {
            const publishedImages = data.mens_ministry.filter(item => item.published).map(item => item.image_url);
            if (publishedImages.length > 0) {
              setMensImages(publishedImages);
            }
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchMensImages();
  }, [setLoading]);

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-xl">
            <MinistryCarousel 
              images={mensImages}
              title="Men's Ministry"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Men's Ministry</h2>
          <p className="text-gray-700 mb-6">
            The Men's Ministry is designed to strengthen men in their walk with God, equipping them to be godly leaders in their homes, workplaces, and communities. We focus on building strong Christian character and fostering brotherhood among men of all ages.
          </p>
          <p className="italic text-blue-600 text-sm mb-6 font-bold">
            1 Corinthians 16:13 NIV - "Be on your guard; stand firm in the faith; be courageous; be strong."
          </p>
          <ul className="space-y-4 list-disc pl-5">
            <li>
              <h3 className="text-xl font-semibold text-blue-600">Men's Bible Study</h3>
              <p className="text-gray-700">Weekly studies focused on biblical manhood and leadership</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold text-blue-600">Brotherhood Fellowship</h3>
              <p className="text-gray-700">Building strong relationships and accountability among men</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold text-blue-600">Service Projects</h3>
              <p className="text-gray-700">Serving the church and community through practical ministry</p>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}