import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
      <input 
        type="text" 
        placeholder="Search destinations..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
      />
      {searchTerm && (
        <button 
          type="button" 
          onClick={handleClear}
          className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition"
      >
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
};

export default SearchBar;