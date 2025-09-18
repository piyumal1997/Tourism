import { useState, useMemo } from 'react';
import MapSection from '../../components/map/MapSection/MapSection';
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
    <main className="pt-20 google-maps-theme">
      {/* Hero Section with Search */}
      <section className="relative h-96 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover Sri Lanka's Hidden Gems</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">From pristine beaches to ancient temples, explore the wonders of this island paradise</p>
          
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

      {/* Advanced Filters */}
      {showFilters && (
        <AdvancedFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          locations={locations}
        />
      )}

      {/* Map Section - Location handling is now entirely within this component */}
      <MapSection 
        locations={filteredLocations} 
        searchTerm={searchTerm}
        filters={filters}
      />
    </main>
  );
};

export default Destinations;