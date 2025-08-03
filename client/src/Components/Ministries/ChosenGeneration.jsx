import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";
import church_9 from "../../assets/church_photo_9.JPG";
import church_10 from "../../assets/church_photo_10.JPG";

const fallbackChosenGenerationImages = [church_9, church_10];

export default function ChosenGeneration() {
  const [chosenGenerationImages, setChosenGenerationImages] = useState(fallbackChosenGenerationImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChosenGenerationImages = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/media/media');
        if (response.ok) {
          const data = await response.json();
          if (data.chosen_generation && data.chosen_generation.length > 0) {
            const publishedImages = data.chosen_generation.filter(item => item.published).map(item => item.image_url);
            if (publishedImages.length > 0) {
              setChosenGenerationImages(publishedImages);
            }
          }
        }
      } catch (error) {
        console.log('Using fallback chosen generation images');
      } finally {
        setLoading(false);
      }
    };

    fetchChosenGenerationImages();
  }, []);

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-1 rounded-xl">
            <MinistryCarousel 
              images={chosenGenerationImages}
              title="Chosen Generation"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-3xl font-bold text-green-700 mb-4">Chosen Generation</h2>
          <p className="text-gray-700 mb-6">
            Chosen Generation is our vibrant group of singers who lead worship and praise through music. This talented ensemble brings energy and spiritual depth to our services, inspiring the congregation through powerful vocals and heartfelt worship songs.
          </p>
          <p className="italic text-green-600 text-sm mb-6 font-bold">
            Psalm 100:2 NIV - "Worship the Lord with gladness; come before him with joyful songs."
          </p>
          <ul className="space-y-4 list-disc pl-5">
            <li>
              <h3 className="text-xl font-semibold text-green-600">Worship Leading</h3>
              <p className="text-gray-700">Leading the congregation in praise and worship during services</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold text-green-600">Special Performances</h3>
              <p className="text-gray-700">Ministering through music at special events and celebrations</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold text-green-600">Musical Ministry</h3>
              <p className="text-gray-700">Using their voices to spread God's love and inspire hearts</p>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}