import React, { useState } from 'react';

const MapControls = ({ 
  // Map control functions
  toggle3DView, 
  resetView, 
  centerOnUserLocation,
  
  // State values
  is3DView, 
  userLocation, 
  travelMode,
  radius,
  isTracking,
  locationsInRadius,
  showMultiStopPlanner,
  selectedLocations,
  routeOptions,
  showNearbyLocations,
  
  // State setters and handlers
  setRadius,
  onTrackingToggle,
  setShowMultiStopPlanner,
  updateRouteOptions,
  onToggleNearbyLocations,
  
  // Additional functions
  clearRoute,
  map // Map instance
}) => {
  const [showRadiusInfo, setShowRadiusInfo] = useState(false);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [isCentering, setIsCentering] = useState(false);

  // Handle radius change
  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
  };

  // Enhanced center on user location function
  const handleCenterOnUserLocation = async () => {
    if (!map) {
      alert('Map not available. Please try again later.');
      return;
    }

    // If user location is not available but tracking is enabled, try to get it
    if (!userLocation && isTracking) {
      alert('Location not available yet. Please wait for location services to initialize.');
      return;
    }

    // If user location is not available and tracking is off, prompt to enable tracking
    if (!userLocation && !isTracking) {
      const enableTracking = confirm('Location tracking is disabled. Would you like to enable it to center on your current location?');
      if (enableTracking) {
        onTrackingToggle(); // Enable tracking
        // Wait a moment for tracking to start
        setTimeout(() => {
          if (userLocation) {
            centerMapToUserLocation();
          } else {
            alert('Please allow location permissions and ensure location services are enabled.');
          }
        }, 1000);
      }
      return;
    }

    // If we have user location, center the map
    if (userLocation) {
      centerMapToUserLocation();
    }
  };

  // Center map to user location
  const centerMapToUserLocation = () => {
    try {
      setIsCentering(true);
      
      // Use flyTo for smooth animation to current location
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
        bearing: 0,
        pitch: 0,
        duration: 1500,
        essential: true
      });

      // Add slight delay for visual feedback
      setTimeout(() => {
        setIsCentering(false);
      }, 1600);
      
    } catch (error) {
      console.error('Error centering on location:', error);
      setIsCentering(false);
      alert('Failed to center on current location. Please try again.');
    }
  };

  // Travel mode options
  const travelModes = [
    { key: 'DRIVING', label: 'Driving', icon: 'car' },
    { key: 'WALKING', label: 'Walking', icon: 'walking' },
    { key: 'BICYCLING', label: 'Bicycling', icon: 'bicycle' },
    { key: 'TRANSIT', label: 'Transit', icon: 'bus' }
  ];

  // Handle route option changes
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
        {/* Current Location Button - Google Maps style */}
        <button 
          onClick={handleCenterOnUserLocation} 
          className={`map-control-button current-location-btn ${isCentering ? 'centering' : ''}`}
          title="Center on current location"
          disabled={isCentering}
        >
          <i className={`fas ${isCentering ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`}></i>
        </button>
        
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
          title="Reset to default view"
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
        
        {/* Nearby Locations Toggle */}
        <div className="flex flex-col items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={showNearbyLocations} 
              onChange={onToggleNearbyLocations}
              className="sr-only peer" 
              disabled={!isTracking || !userLocation}
            />
            <div className={`w-11 h-6 ${!isTracking || !userLocation ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
          </label>
          <span className="text-xs mt-1 text-gray-600">Nearby</span>
        </div>
        
        {/* Clear Route */}
        <button 
          onClick={clearRoute} 
          className="map-control-button"
          title="Clear current route"
        >
          <i className="fas fa-route"></i>
        </button>
        
        {/* Multi-Stop Planner Toggle */}
        <button 
          onClick={() => setShowMultiStopPlanner(!showMultiStopPlanner)} 
          className={`map-control-button ${selectedLocations.length > 0 ? 'active' : ''}`}
          title="Multi-stop route planner"
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
          title="Route options"
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

      {/* Radius Control - Only shown when nearby locations is enabled */}
      {showNearbyLocations && (
        <div className="map-control-group">
          <div className="flex items-center justify-between mb-2">
            <label className="map-control-label">Search Radius: {radius} km</label>
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
      )}
      
      {/* Travel Mode Selection */}
      <div className="map-control-group">
        <label className="map-control-label">Travel Mode</label>
        <div className="grid grid-cols-1 gap-1">
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