import React from 'react';
import { Link } from 'react-router-dom';
import { locations } from '../../../utils/constants';

const FeaturedDestinations = () => {
  const featuredLocations = locations.slice(0, 3);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Destinations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredLocations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={location.image} 
                alt={location.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{location.title}</h3>
                <p className="text-gray-600 mb-4">{location.location}</p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{location.description}</p>
                <Link 
                  to={`/location/${location.id}`}
                  className="text-emerald-500 hover:text-emerald-600 font-medium"
                >
                  Explore More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/destinations"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;