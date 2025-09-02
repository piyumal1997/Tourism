import { useLocation } from '../../../contexts/LocationContext';

const LocationModal = ({ location, onClose }) => {
  const { showRouteToLocation } = useLocation();

  if (!location) return null;

  const categoryColors = {
    beach: 'bg-blue-100 text-blue-800',
    cultural: 'bg-yellow-100 text-yellow-800',
    wildlife: 'bg-green-100 text-green-800',
    adventure: 'bg-purple-100 text-purple-800'
  };

  const handleGetDirections = () => {
    showRouteToLocation(location);
    onClose();
  };

  return (
    <div className="modal fixed inset-0 z-50 flex items-center justify-center active">
      <div className="absolute inset-0 bg-black" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
          <i className="fas fa-times"></i>
        </button>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 md:h-full">
            <img src={location.image} alt={location.title} className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none" />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-3 ${categoryColors[location.category]}`}>
                {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
              </span>
              <div className="flex items-center text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span className="text-gray-600 ml-1 text-sm">({location.reviews} reviews)</span>
              </div>
            </div>
            <h3 className="text-left  text-2xl font-bold text-gray-800 mb-2">{location.title}</h3>
            <p className="text-gray-600 mb-4 flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-emerald-500"></i>
              <span>{location.location}</span>
            </p>
            <p className="text-gray-700 mb-6 text-justify">{location.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Best Time to Visit</p>
                <p className="font-medium">{location.bestTime}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Entry Fee</p>
                <p className="font-medium">{location.entryFee}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-left text-lg font-bold text-gray-800 mb-2">Highlights</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {location.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center mb-1 highlight-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <i className="fas fa-check-circle text-emerald-500 mr-2"></i>{highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button onClick={handleGetDirections} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg text-center font-medium transition">
                <i className="fas fa-directions mr-2"></i>Get Directions
              </button>
              <button className="flex-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 px-6 rounded-lg text-center font-medium transition">
                <i className="fas fa-bookmark mr-2"></i>Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;