import { motion } from "framer-motion";
import SectionTitle from "../Components/SectionTitle";
import WomensMinistry from "../Components/Ministries/WomensMinistry";
import MensMinistry from "../Components/Ministries/MensMinistry";
import YouthMinistry from "../Components/Ministries/YouthMinistry";
import CharityFoundation from "../Components/Ministries/CharityFoundation";
import ChildrenMinistry from "../Components/Ministries/ChildrenMinistry";

export default function Ministries() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <div className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <SectionTitle title="Our Ministries" />
          </motion.div>

          <div className="space-y-24">
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
          </div>
        </div>
      </div>
    </div>
  );
}