import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventCard from "../Components/EventCard";
import ServicesPage from "../Components/Services";
import SectionTitle from "../Components/SectionTitle";
import LeadershipPage from "../Components/Leadership";
import CharityFoundationPage from "../Components/Donate";
import event_1 from "../assets/event_1.JPG";
import event_2 from "../assets/event_2.JPG";
import event_3 from "../assets/event_3.JPG";

export default function Home() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const events = [
    {
      id: 4,
      title: "Sight & Sound Theater Trip – NOAH: 30th Anniversary Show",
      date: "August 22, 2025",
      time: "Departure: 7:00 AM",
      verse: "By faith Noah, when warned about things not yet seen, in holy fear built an ark to save his family. – Hebrews 11:7",
      location: "Pick-up: 52 Connecticut Ave, South Windsor, CT 06074",
      images: [event_3],
      additionalInfo: `🌊 Step into the pages of Scripture as Voice of God Charity Foundation takes you on an extraordinary journey to the Sight & Sound Theatres for their spectacular 30th Anniversary Production of NOAH!

This unforgettable one-day trip brings the Bible to life with stunning visuals, live animals, and an ark-sized stage that immerses you in the dramatic story of Noah's obedience, faith, and deliverance. Perfect for families, couples, youth, and seniors alike!

🎟️ Package Includes:
- ✅ Roundtrip luxury transportation
- ✅ Admission to NOAH at Sight & Sound Theater
- ✅ Delicious lunch included
- ✅ Raffle prizes and more surprises onboard

💵 Cost: $200 per person  
🚌 Departure Time: 7:00 AM sharp  
📍 Pick-up Point: 52 Connecticut Ave, South Windsor, CT 06074

📢 Seats are limited!  
Kindly reach out to any member of the VOG Charity team to reserve your seat today or for more information.

This experience is not just a show — it's a faith-building, community-bonding journey that you'll remember for years to come. Come encounter God's faithfulness through the story of Noah like never before!`,
    },
    {
      id: 2,
      title: "2025 Annual Convention & 6th Anniversary",
      date: "June 26–29, 2025",
      time: "Daily at 6:00 PM | Sunday at 10:00 AM & 6:00 PM",
      verse: "Taste and see that the LORD is good; blessed is the one who takes refuge in him. – Psalm 34:8",
      location: "52 Connecticut Ave, South Windsor, CT 06074",
      images: [event_1],
      additionalInfo: "Join us for four powerful days of worship, prophecy, and celebration. Featuring Major Prophet Isaac Anto, Apostle Oheneba Poku, Minister Isaac Ackah, and the Adonai Worshippers. Don't miss the Love Feast Gala on Saturday at Sky High Events!"
    },
    {
      id: 1,
      title: "Love Feast Gala – 2025 Annual Convention",
      date: "June 28, 2025",
      time: "6:00 PM – 10:00 PM",
      verse: "Let all that you do be done in love. – 1 Corinthians 16:14",
      location: "SkyHigh Events, 5 National Drive, Windsor Locks, CT 06096",
      ticketPrice: "60-100",
      images: [event_2],
      additionalInfo: `Experience an unforgettable evening of elegance, joy, and divine fellowship at the Love Feast Gala, a signature celebration within our 2025 Annual Convention & 6th Anniversary of Voice of God Ministries. Set in the exquisite SkyHigh Events Center, this formal gathering brings together families, couples, and individuals in a beautiful setting to honor love, unity, and the goodness of God.

This year's gala will feature:
- Anointed hosting by Apostle Oheneba Poku
- Lively engagement and entertainment from MC Herbert
- Spirit-filled atmosphere of worship and connection
- A formal banquet dinner and a vibrant community celebration
- Uplifting music, divine encounters, and photo moments that will last a lifetime

🎟️ TICKETS:
- Singles: $60
- Couples: $100

👗 DRESS CODE: Formal wear (Suits, ties, gowns, and glam encouraged)

✨ Whether you're attending with your spouse, friends, or coming to fellowship and connect with believers, the Love Feast Gala is designed to fill your evening with purpose, laughter, and God's love in action.

📌 This event is part of the larger 2025 Annual Convention themed "The Goodness of God", running from June 26th to June 29th. Reserve your seat now and come ready to dine, dance, and delight in God's presence.`,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <Navbar />

      <motion.section
        id="leadership"
        className="container mx-auto px-4 py-12 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <SectionTitle title="Our Leadership" />
          <LeadershipPage />
        </div>
      </motion.section>

      <motion.section
        id="services"
        className="container mx-auto px-4 py-12 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <SectionTitle title="Our Services" />
          <ServicesPage />
        </div>
      </motion.section>

      <motion.section
        id="events"
        className="container mx-auto px-4 py-12 pt-20 mt-4"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
      >
        <div className="text-center mb-12">
          <SectionTitle title="Upcoming Events" />
          <motion.p
            className="text-lg text-gray-200 max-w-2xl mx-auto font-bold"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              type: "spring",
              stiffness: 70,
              delay: 0.2,
            }}
          >
            Join us for these special gatherings as we worship, learn, and grow
            together in faith.
          </motion.p>
        </div>

        <div className="flex justify-center px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="w-full h-full"
                style={{ aspectRatio: "1/1.2" }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 70,
                }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="donation"
        className="container mx-auto px-4 py-12 pt-20"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
      >
        <div className="text-center mb-12">
          <SectionTitle title="Support Our Ministry" />
          <CharityFoundationPage />
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
