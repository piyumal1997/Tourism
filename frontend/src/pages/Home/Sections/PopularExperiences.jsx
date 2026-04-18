import React from 'react';
import { Link } from 'react-router-dom';

const PopularExperiences = () => {
  const experiences = [
    {
      id: 1,
      title: "Wildlife Safari",
      description: "Experience the diverse wildlife in Sri Lanka's national parks",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "Tea Plantation Tour",
      description: "Explore the lush tea plantations in the hill country",
      image: "https://images.unsplash.com/photo-1592389148855-8b2ad7082d6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: 3,
      title: "Beach Relaxation",
      description: "Unwind on Sri Lanka's pristine sandy beaches",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Experiences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <div key={experience.id} className="relative group overflow-hidden rounded-lg">
              <img 
                src={experience.image} 
                alt={experience.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{experience.title}</h3>
                <p className="text-gray-200 mb-4">{experience.description}</p>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors self-start">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/experiences"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Explore All Experiences
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularExperiences;