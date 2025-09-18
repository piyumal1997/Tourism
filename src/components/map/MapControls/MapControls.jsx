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
  isTracking,
  onTrackingToggle,
  locationsInRadius,
  showMultiStopPlanner,
  setShowMultiStopPlanner,
  selectedLocations,
  routeOptions,
  updateRouteOptions
}) => {
  const [showRadiusInfo, setShowRadiusInfo] = useState(false);
  const [showRouteOptions, setShowRouteOptions] = useState(false);

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
  };

  const travelModes = [
    { key: 'DRIVING', label: 'Driving', icon: 'car' },
    { key: 'WALKING', label: 'Walking', icon: 'walking' },
    { key: 'BICYCLING', label: 'Bicycling', icon: 'bicycle' },
    { key: 'TRANSIT', label: 'Transit', icon: 'bus' }
  ];

  const handleRouteOptionChange = (option) => {
    const newOptions = {
      ...routeOptions,
      [option]: !routeOptions[option]
    };
    updateRouteOptions(newOptions);
  };

  return (
    <div className="map-controls-container">
      {/* Main controls container */}
      <div className="map-control-group">
        {/* 3D View Toggle */}
        <button 
          onClick={toggle3DView} 
          className={`map-control-button ${is3DView ? 'active' : ''}`}
          title={is3DView ? 'Switch to 2D View' : 'Switch to 3D View'}
        >
          <i className={`fas ${is3DView ? 'fa-map' : 'fa-cube'}`}></i>
        </button>
        
        {/* Reset View */}
        <button 
          onClick={resetView} 
          className="map-control-button"
          title="Reset View"
        >
          <i className="fas fa-globe-asia"></i>
        </button>
        
        {/* Location Tracking Toggle */}
        <div className="flex flex-col items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isTracking} 
              onChange={onTrackingToggle}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-xs mt-1 text-gray-600">Track</span>
        </div>
        
        {/* Find Nearest Locations */}
        <button 
          onClick={findNearestLocations} 
          className="map-control-button"
          title="Find Nearby Locations"
          disabled={!userLocation}
          style={{ 
            backgroundColor: userLocation ? '#fbbf24' : '#f3f4f6',
            color: userLocation ? 'white' : '#9ca3af'
          }}
        >
          <i className="fas fa-location-arrow"></i>
        </button>
        
        {/* Clear Route */}
        <button 
          onClick={clearRoute} 
          className="map-control-button"
          title="Clear Route"
        >
          <i className="fas fa-route"></i>
        </button>
        
        {/* Multi-Stop Planner */}
        <button 
          onClick={() => setShowMultiStopPlanner(!showMultiStopPlanner)} 
          className={`map-control-button ${selectedLocations.length > 0 ? 'active' : ''}`}
          title="Multi-Stop Route Planner"
        >
          <i className="fas fa-route"></i>
          {selectedLocations.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {selectedLocations.length}
            </span>
          )}
        </button>
        
        {/* Route Options Toggle */}
        <button 
          onClick={() => setShowRouteOptions(!showRouteOptions)}
          className="map-control-button"
          title="Route Options"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>

      {/* Route Options Panel */}
      {showRouteOptions && (
        <div className="map-control-group">
          <div className="map-control-label">Route Options</div>
          <div className="space-y-2">
            <label className="flex items-center text-sm">
              <input 
                type="checkbox" 
                checked={routeOptions.avoidTolls}
                onChange={() => handleRouteOptionChange('avoidTolls')}
                className="mr-2 rounded text-blue-500"
              />
              Avoid Tolls
            </label>
            
            <label className="flex items-center text-sm">
              <input 
                type="checkbox" 
                checked={routeOptions.avoidHighways}
                onChange={() => handleRouteOptionChange('avoidHighways')}
                className="mr-2 rounded text-blue-500"
              />
              Avoid Highways
            </label>
            
            <label className="flex items-center text-sm">
              <input 
                type="checkbox" 
                checked={routeOptions.ecoFriendly}
                onChange={() => handleRouteOptionChange('ecoFriendly')}
                className="mr-2 rounded text-blue-500"
              />
              Eco-Friendly
            </label>
            
            <label className="flex items-center text-sm">
              <input 
                type="checkbox" 
                checked={routeOptions.considerTraffic}
                onChange={() => handleRouteOptionChange('considerTraffic')}
                className="mr-2 rounded text-blue-500"
              />
              Consider Traffic
            </label>
          </div>
        </div>
      )}

      {/* Radius Control */}
      <div className="map-control-group">
        <div className="flex items-center justify-between mb-2">
          <label className="map-control-label">Radius: {radius} km</label>
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
          className="map-control-slider"
          disabled={!userLocation}
        />
        
        {showRadiusInfo && (
          <div className="mt-2 text-xs text-gray-600">
            {locationsInRadius.length} locations within {radius} km radius
          </div>
        )}
      </div>
      
      {/* Travel Mode Selection */}
      <div className="map-control-group">
        <label className="map-control-label">Travel Mode</label>
        <div className="grid grid-cols-2 gap-1">
          {travelModes.map(mode => (
            <button
              key={mode.key}
              className={`p-1 rounded text-xs flex items-center justify-center ${travelMode === mode.key ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}`}
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