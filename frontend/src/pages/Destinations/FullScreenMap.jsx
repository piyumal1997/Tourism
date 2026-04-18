import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MapSection from '../../components/map/MapSection/MapSection';
import SearchBar from '../../components/search/SearchBar';
import { locations } from '../../utils/constants';
import { filterLocations } from '../../utils/searchUtils';

const FullScreenMap = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters] = useState({
    category: 'all',
    district: 'all',
    bestTime: 'all',
    entryFee: 'all',
    highlights: []
  });

  const filteredLocations = useMemo(() => {
    return filterLocations(locations, searchTerm, filters);
  }, [searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={() => navigate('/destinations')}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          <i className="fas fa-arrow-left text-gray-700"></i>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="absolute top-4 left-20 right-4 z-50">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {/* Map Section - Full Screen */}
      <MapSection 
        locations={filteredLocations} 
        searchTerm={searchTerm}
        filters={filters}
      />
    </div>
  );
};

export default FullScreenMap;