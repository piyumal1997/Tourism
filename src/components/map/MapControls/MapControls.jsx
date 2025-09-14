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
        title={userLocation ? 'Find Nearby Places' : 'Enable Location to Find Nearby'}
        disabled={!userLocation}
      >
        <i className="fas fa-location-arrow"></i>
      </button>
      
      <button 
        onClick={watchingLocation ? stopWatchingLocation : startWatchingLocation} 
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