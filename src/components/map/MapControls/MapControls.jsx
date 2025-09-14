import { useState } from 'react';

const MapControls = ({ 
  toggle3DView, 
  resetView, 
  is3DView, 
  findNearestLocations, 
  userLocation, 
  clearRoute,
  travelMode,
  radius,
  setRadius,
  watchingLocation,
  toggleWatchingLocation,
  locationsInRadius
}) => {
  const [showRadiusInfo, setShowRadiusInfo] = useState(false);

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
  };

  const travelModes = [
    { key: 'DRIVING', label: 'Driving', icon: 'car' },
    { key: 'WALKING', label: 'Walking', icon: 'walking' },
    { key: 'BICYCLING', label: 'Bicycling', icon: 'bicycle' }
  ];

  return (
    <div className="map-controls">
      <button 
        onClick={toggle3DView} 
        className={`control-button ${is3DView ? 'active' : ''}`}
        title={is3DView ? 'Switch to 2D View' : 'Switch to 3D View'}
      >
        <i className={`fas ${is3DView ? 'fa-map' : 'fa-cube'}`}></i>
      </button>
      
      <button 
        onClick={resetView} 
        className="control-button"
        title="Reset View"
      >
        <i className="fas fa-globe-asia"></i>
      </button>
      
      <button 
        onClick={findNearestLocations} 
        className="control-button"
        title="Find Nearby Locations"
        disabled={!userLocation}
      >
        <i className="fas fa-location-arrow"></i>
      </button>
      
      <button 
        onClick={toggleWatchingLocation} 
        className={`control-button ${watchingLocation ? 'active' : ''}`}
        title={watchingLocation ? 'Stop Tracking' : 'Track Location'}
      >
        <i className={`fas ${watchingLocation ? 'fa-location-crosshairs' : 'fa-location-dot'}`}></i>
      </button>
      
      <button 
        onClick={clearRoute} 
        className="control-button"
        title="Clear Route"
      >
        <i className="fas fa-route"></i>
      </button>
      
      {/* Radius Control */}
      <div className="bg-white p-3 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Radius: {radius} km</label>
          <button 
            onClick={() => setShowRadiusInfo(!showRadiusInfo)}
            className="text-blue-500 text-sm"
          >
            <i className={`fas ${showRadiusInfo ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
        </div>
        
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={radius} 
          onChange={handleRadiusChange}
          className="w-full"
        />
        
        {showRadiusInfo && (
          <div className="mt-2 text-xs text-gray-600">
            {locationsInRadius.length} locations within {radius} km radius
          </div>
        )}
      </div>
      
      {/* Travel Mode Selection */}
      <div className="bg-white p-2 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-1">Travel Mode</label>
        <div className="grid grid-cols-2 gap-1">
          {travelModes.map(mode => (
            <button
              key={mode.key}
              className={`p-2 rounded text-xs flex items-center justify-center ${travelMode === mode.key ? 'bg-emerald-500 text-white' : 'bg-gray-100'}`}
              title={mode.label}
            >
              <i className={`fas fa-${mode.icon} mr-1`}></i>
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapControls;