import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SectionTitle from "../Components/SectionTitle";
import WomensMinistry from "../Components/Ministries/WomensMinistry";
import MensMinistry from "../Components/Ministries/MensMinistry";
import YouthMinistry from "../Components/Ministries/YouthMinistry";
import CharityFoundation from "../Components/Ministries/CharityFoundation";
import ChildrenMinistry from "../Components/Ministries/ChildrenMinistry";
import ChosenGeneration from "../Components/Ministries/ChosenGeneration";

export default function Ministries() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-0 pb-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            <motion.section
              id="womens-ministry"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <WomensMinistry />
            </motion.section>

            <motion.section
              id="mens-ministry"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <MensMinistry />
            </motion.section>

            <motion.section
              id="youth-ministry"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <YouthMinistry />
            </motion.section>

            <motion.section
              id="charity-foundation"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <CharityFoundation />
            </motion.section>

            <motion.section
              id="children-ministry"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <ChildrenMinistry />
            </motion.section>

            <motion.section
              id="chosen-generation"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="scroll-mt-24"
            >
              <ChosenGeneration />
            </motion.section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}