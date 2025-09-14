import { useState } from 'react';

const SearchPanel = ({ onSearch, onCategoryFilter, activeCategory }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: 'fa-globe' },
    { id: 'restaurant', name: 'Restaurants', icon: 'fa-utensils' },
    { id: 'hotel', name: 'Hotels', icon: 'fa-hotel' },
    { id: 'attraction', name: 'Attractions', icon: 'fa-landmark' },
    { id: 'shopping', name: 'Shopping', icon: 'fa-shopping-cart' },
    { id: 'gas', name: 'Gas Stations', icon: 'fa-gas-pump' },
    { id: 'ev', name: 'EV Charging', icon: 'fa-charging-station' },
    { id: 'parking', name: 'Parking', icon: 'fa-parking' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-panel">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      
      <div className="mt-3 flex justify-between">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-500 text-sm font-medium"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <button className="text-blue-500 text-sm font-medium">
          Advanced
        </button>
      </div>
      
      {showFilters && (
        <div className="search-categories mt-3">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryFilter(category.id)}
            >
              <i className={`fas ${category.icon} mr-1`}></i>
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;