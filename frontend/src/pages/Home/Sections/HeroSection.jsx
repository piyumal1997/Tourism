import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1562583489-bf23ec64651d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Sri Lanka</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Explore the pearl of the Indian Ocean with its pristine beaches, ancient temples, and lush landscapes
        </p>
        <Link 
          to="/destinations" 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
        >
          Explore Destinations
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;