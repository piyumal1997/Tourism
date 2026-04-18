import { locations } from '../../../utils/constants';
import { calculateDistance } from '../../../utils/locationUtils';

const NearbyLocations = ({ currentLocation, onLocationSelect }) => {
  // Find locations within 50km radius
  const nearbyLocations = locations
    .filter(location => location.id !== currentLocation.id)
    .map(location => {
      const distance = calculateDistance(
        currentLocation.coordinates.lat,
        currentLocation.coordinates.lng,
        location.coordinates.lat,
        location.coordinates.lng
      );
      return { ...location, distance };
    })
    .filter(location => location.distance <= 50)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  if (nearbyLocations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <i className="fas fa-map-marker-alt text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-600">No nearby locations found</h3>
        <p className="text-gray-500">Try exploring other destinations</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {nearbyLocations.map(location => (
        <div 
          key={location.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onLocationSelect(location)}
        >
          <img 
            src={location.image} 
            alt={location.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{location.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{location.location}</p>
            <p className="text-emerald-500 font-medium">{location.distance.toFixed(1)} km away</p>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400 text-sm">
                {'★'.repeat(Math.floor(location.rating))}
                {'☆'.repeat(5 - Math.floor(location.rating))}
              </div>
              <span className="text-xs text-gray-500 ml-2">({location.reviews})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyLocations;