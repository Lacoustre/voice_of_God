import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import WomensMinistry from "../Components/Ministries/WomensMinistry";
import SectionTitle from "../Components/SectionTitle";

const WomensMinistryPage = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 md:pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <SectionTitle title="Women's Ministry" />
          </div>
          <WomensMinistry />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WomensMinistryPage;