import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/search/SearchBar';
import AdvancedFilters from '../../components/map/AdvancedFilters/AdvancedFilters';
import { locations } from '../../utils/constants';
import { filterLocations } from '../../utils/searchUtils';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    district: 'all',
    bestTime: 'all',
    entryFee: 'all',
    highlights: []
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredLocations = useMemo(() => {
    return filterLocations(locations, searchTerm, filters);
  }, [searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className="pt-0">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover Sri Lanka</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Explore the wonders of this island paradise</p>
          
          <SearchBar onSearch={handleSearch} />
          
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
          >
            <i className="fas fa-filter mr-2"></i>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </section>

      {/* Navigation to Subpages */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/destinations/map" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-emerald-200 transition">
                <i className="fas fa-map-marked-alt text-emerald-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold">Interactive Map</h3>
            </div>
            <p className="text-gray-600">Explore all destinations on a full-screen interactive map with search functionality.</p>
            <div className="mt-4 text-emerald-600 font-medium flex items-center">
              Open Map <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </Link>
          
          <Link 
            to="/destinations/route-planner" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition">
                <i className="fas fa-route text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold">Route Planner</h3>
            </div>
            <p className="text-gray-600">Find the best way to get anywhere with multiple transportation options.</p>
            <div className="mt-4 text-blue-600 font-medium flex items-center">
              Plan Route <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map(location => (
            <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48">
                <img 
                  src={location.image} 
                  alt={location.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium">
                  {location.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{location.title}</h3>
                <p className="text-gray-600 mb-4">{location.location}</p>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/location/${location.id}`}
                    className="text-emerald-600 font-medium hover:text-emerald-700"
                  >
                    View Details
                  </Link>
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span>{location.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Destinations;