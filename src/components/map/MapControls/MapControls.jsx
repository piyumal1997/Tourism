import { useState } from 'react';

const MapControls = ({ 
  toggle3DView, 
  resetView, 
  is3DView, 
  findNearestLocations, 
  userLocation, 
  clearRoute,
  onTravelModeChange,
  onRadiusChange,
  watchingLocation,
  startWatchingLocation,
  stopWatchingLocation
}) => {
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [radius, setRadius] = useState(50);

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
    onTravelModeChange(mode);
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    onRadiusChange(newRadius);
  };

  const travelModes = [
    { key: 'DRIVING', label: 'Driving', icon: 'car' },
    { key: 'WALKING', label: 'Walking', icon: 'walking' },
    { key: 'BICYCLING', label: 'Bicycling', icon: 'bicycle' },
    { key: 'TRANSIT', label: 'Transit', icon: 'bus' }
  ];

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
      <button 
        onClick={toggle3DView} 
        className="bg-white border border-gray-300 py-2 px-3 font-sans shadow-md rounded cursor-pointer z-10 hover:bg-gray-100 flex items-center"
      >
        <i className={`fas ${is3DView ? 'fa-map' : 'fa-cube'} mr-2`}></i>
        {is3DView ? '2D View' : '3D View'}
      </button>
      
      <button 
        onClick={resetView} 
        className="bg-white border border-gray-300 py-2 px-3 font-sans shadow-md rounded cursor-pointer z-10 hover:bg-gray-100 flex items-center"
      >
        <i className="fas fa-globe-asia mr-2"></i>Reset View
      </button>
      
      <button 
        onClick={findNearestLocations} 
        className="bg-white border border-gray-300 py-2 px-3 font-sans shadow-md rounded cursor-pointer z-10 hover:bg-gray-100 flex items-center"
      >
        <i className="fas fa-location-arrow mr-2"></i>
        {userLocation ? 'Nearby Places' : 'Find Nearby'}
      </button>
      
      <button 
        onClick={watchingLocation ? stopWatchingLocation : startWatchingLocation} 
        className="bg-white border border-gray-300 py-2 px-3 font-sans shadow-md rounded cursor-pointer z-10 hover:bg-gray-100 flex items-center"
      >
        <i className={`fas ${watchingLocation ? 'fa-location-crosshairs' : 'fa-location-dot'} mr-2`}></i>
        {watchingLocation ? 'Stop Tracking' : 'Track Location'}
      </button>
      
      <button 
        onClick={clearRoute} 
        className="bg-white border border-gray-300 py-2 px-3 font-sans shadow-md rounded cursor-pointer z-10 hover:bg-gray-100 flex items-center"
      >
        <i className="fas fa-route mr-2"></i>Clear Route
      </button>
      
      {/* Travel Mode Selection */}
      <div className="bg-white p-2 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-1">Travel Mode</label>
        <div className="grid grid-cols-2 gap-1">
          {travelModes.map(mode => (
            <button
              key={mode.key}
              onClick={() => handleTravelModeChange(mode.key)}
              className={`p-2 rounded text-xs flex items-center justify-center ${travelMode === mode.key ? 'bg-emerald-500 text-white' : 'bg-gray-100'}`}
              title={mode.label}
            >
              <i className={`fas fa-${mode.icon} mr-1`}></i>
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Radius Filter */}
      <div className="bg-white p-2 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-1">Radius: {radius} km</label>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={radius} 
          onChange={handleRadiusChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default MapControls;