import { useState } from 'react';

const AdvancedFilters = ({ filters, onFilterChange, locations }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get unique values for filters
  const districts = [...new Set(locations.map(l => l.district))];
  const bestTimes = [...new Set(locations.map(l => l.bestTime))];
  const allHighlights = [...new Set(locations.flatMap(l => l.highlights))];
  
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };
  
  const handleHighlightToggle = (highlight) => {
    const newHighlights = filters.highlights.includes(highlight)
      ? filters.highlights.filter(h => h !== highlight)
      : [...filters.highlights, highlight];
    
    onFilterChange({
      ...filters,
      highlights: newHighlights
    });
  };
  
  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      district: 'all',
      bestTime: 'all',
      entryFee: 'all',
      highlights: []
    });
  };

  return (
    <div className="bg-white shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Advanced Filters</h3>
        <button onClick={clearFilters} className="text-emerald-600 hover:text-emerald-800">
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* District Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select 
            value={filters.district} 
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        
        {/* Best Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
          <select 
            value={filters.bestTime} 
            onChange={(e) => handleFilterChange('bestTime', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">Any Time</option>
            {bestTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        
        {/* Entry Fee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee</label>
          <select 
            value={filters.entryFee} 
            onChange={(e) => handleFilterChange('entryFee', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">Any Fee</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        
        {/* Highlights Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full p-2 border border-gray-300 rounded-md text-left"
          >
            {filters.highlights.length > 0 
              ? `${filters.highlights.length} selected` 
              : 'Select Highlights'}
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-md p-2 border border-gray-200">
              {allHighlights.map(highlight => (
                <label key={highlight} className="flex items-center p-1">
                  <input
                    type="checkbox"
                    checked={filters.highlights.includes(highlight)}
                    onChange={() => handleHighlightToggle(highlight)}
                    className="mr-2"
                  />
                  {highlight}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;