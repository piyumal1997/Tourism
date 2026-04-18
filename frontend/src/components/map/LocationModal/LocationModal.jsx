import React from 'react';

const LocationModal = ({ location, onClose, onGetDirections, onAddToTrip }) => {
  const getCategoryColor = (category) => {
    const colors = {
      beach: 'bg-blue-500 text-white',
      cultural: 'bg-yellow-500 text-white',
      wildlife: 'bg-green-500 text-white',
      adventure: 'bg-red-500 text-white',
      restaurant: 'bg-orange-500 text-white',
      hotel: 'bg-purple-500 text-white',
      shopping: 'bg-teal-500 text-white'
    };
    return colors[category] || 'bg-blue-500 text-white';
  };

  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-0 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Location Panel */}
      <div className="relative w-80 h-full bg-white shadow-xl pointer-events-auto transform transition-transform duration-300 location-modal">
        <div className="h-full overflow-y-auto">
          <div className="relative h-48">
            <img 
              src={location.image} 
              alt={location.title}
              className="w-full h-full object-cover"
            />
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(location.category)}`}>
              {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">{location.title}</h2>
            
            <div className="flex items-center text-gray-600 mt-1">
              <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
              <span>{location.location}</span>
            </div>
            
            <div className="flex items-center mt-3">
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.floor(location.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  ></i>
                ))}
              </div>
              <span className="text-gray-600 text-sm">({location.reviews} reviews)</span>
            </div>
            
            <p className="text-gray-700 mt-3 text-sm">{location.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Best Time to Visit</div>
                <div className="font-medium text-sm">{location.bestTime}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Entry Fee</div>
                <div className="font-medium text-sm">{location.entryFee}</div>
              </div>
            </div>
            
            {location.highlights && location.highlights.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-800">Highlights</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {location.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={onGetDirections}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
              >
                <i className="fas fa-directions mr-2"></i>
                Directions
              </button>
              
              <button 
                onClick={onAddToTrip}
                className="py-2 px-4 border border-blue-500 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-50 transition"
              >
                <i className="fas fa-plus mr-2"></i>
                Add to Route
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;