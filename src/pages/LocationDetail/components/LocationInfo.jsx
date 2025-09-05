const LocationInfo = ({ location }) => {
  const categoryColors = {
    beach: 'bg-blue-100 text-blue-800',
    cultural: 'bg-yellow-100 text-yellow-800',
    wildlife: 'bg-green-100 text-green-800',
    adventure: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-3 ${categoryColors[location.category]}`}>
          {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
        </span>
        <div className="flex items-center text-yellow-400">
          {'★'.repeat(Math.floor(location.rating))}
          {'☆'.repeat(5 - Math.floor(location.rating))}
          <span className="text-gray-600 ml-1 text-sm">({location.reviews} reviews)</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">About {location.title}</h2>
      
      <p className="text-gray-700 mb-6 leading-relaxed">{location.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Best Time to Visit</h3>
          <p className="text-gray-600">{location.bestTime}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Entry Fee</h3>
          <p className="text-gray-600">{location.entryFee}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">District</h3>
          <p className="text-gray-600">{location.district}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Distance from Colombo</h3>
          <p className="text-gray-600">{location.distanceFromColombo}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Highlights</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {location.highlights.map((highlight, index) => (
            <li key={index} className="flex items-center">
              <i className="fas fa-check-circle text-emerald-500 mr-2"></i>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Travel Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Wear comfortable shoes for walking</li>
          <li>Carry water and sunscreen</li>
          <li>Visit during weekdays to avoid crowds</li>
          <li>Check weather conditions before visiting</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationInfo;