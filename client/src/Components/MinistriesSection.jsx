import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";

export default function MinistriesSection() {
  const ministries = [
    {
      title: "Women's Ministry",
      description: "Supporting women in their spiritual journey through fellowship, prayer, and service.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3",
      link: "/ministries#womens-ministry"
    },
    {
      title: "Men's Ministry",
      description: "Empowering men to be spiritual leaders through accountability, discipleship, and community service.",
      image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3",
      link: "/ministries#mens-ministry"
    },
    {
      title: "Youth Ministry",
      description: "Guiding young adults and youth in their faith journey through engaging activities and mentorship.",
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3",
      link: "/ministries#youth-ministry"
    },
    {
      title: "Charity Foundation",
      description: "Extending God's love through community outreach and support for those in need.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3",
      link: "/ministries#charity-foundation"
    },
    {
      title: "Children's Ministry",
      description: "Nurturing children's faith through age-appropriate teaching, activities, and worship.",
      image: "https://images.unsplash.com/photo-1602052577122-f73b9710adba?ixlib=rb-4.0.3",
      link: "/ministries#children-ministry"
    }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <SectionTitle title="Our Ministries" />
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto">
          Explore our various ministries dedicated to serving different groups within our community,
          each with a unique focus but united in our mission to spread God's word and love.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ministries.map((ministry, index) => (
          <div
            key={index}
            className="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={ministry.image} 
                alt={ministry.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-2">{ministry.title}</h3>
              <p className="text-gray-300 mb-4">{ministry.description}</p>
              <Link 
                to={ministry.link}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <Link 
          to="/ministries"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          View All Ministries
        </Link>
      </div>
    </div>
  );
}