import React from 'react';

const RouteInfoPanel = ({ routeInfo, onClose, onStartNavigation, trafficIncidents }) => {
  if (!routeInfo) return null;

  const getTravelModeIcon = (mode) => {
    const icons = {
      DRIVING: 'car',
      WALKING: 'walking',
      BICYCLING: 'bicycle',
      TRANSIT: 'bus'
    };
    return icons[mode] || 'car';
  };

  // Safe access to travelMode
  const travelMode = routeInfo.travelMode || 'DRIVING';

  return (
    <div className="absolute top-20 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-sm route-info-panel">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Route Information</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="flex items-center mb-3">
        <i className={`fas fa-${getTravelModeIcon(travelMode)} text-emerald-500 mr-2`}></i>
        <span className="font-medium capitalize">{travelMode.toLowerCase()}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-500 text-sm">Distance</p>
          <p className="font-medium">{routeInfo.distance}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-500 text-sm">Duration</p>
          <p className="font-medium">{routeInfo.duration}</p>
        </div>
      </div>
      
      {routeInfo.fuelEfficiency && (
        <div className="bg-green-50 p-2 rounded mb-4">
          <p className="text-gray-500 text-sm">Fuel Efficiency</p>
          <p className="font-medium text-green-600">{routeInfo.fuelEfficiency.score}/100</p>
          <p className="text-xs text-gray-500">Estimated fuel: {routeInfo.fuelEfficiency.estimatedFuel}</p>
        </div>
      )}
      
      {routeInfo.trafficImpact && routeInfo.trafficImpact.hasTraffic && (
        <div className="bg-yellow-50 p-2 rounded mb-4">
          <p className="text-gray-500 text-sm">Traffic Impact</p>
          <p className="font-medium text-yellow-600">+{routeInfo.trafficImpact.totalDelay} min delay</p>
          <p className="text-xs text-gray-500">{routeInfo.trafficImpact.affectedSegments} affected segments</p>
        </div>
      )}
      
      {routeInfo.alternateRoutes && routeInfo.alternateRoutes.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Alternate Routes:</h4>
          <div className="space-y-2">
            {routeInfo.alternateRoutes.map((route, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">Route {index + 1}</span>
                  <span>{route.distance} • {route.duration}</span>
                </div>
                {route.isEcoFriendly && (
                  <div className="flex items-center text-green-600 text-xs mt-1">
                    <i className="fas fa-leaf mr-1"></i>
                    <span>Eco-friendly option</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="font-semibold mb-2">Directions:</h4>
        <ol className="space-y-2 max-h-60 overflow-y-auto">
          {routeInfo.steps && routeInfo.steps.map((step, index) => (
            <li key={index} className="route-step">
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: step.instructions }} />
              {step.distance && (
                <p className="text-xs text-gray-500 mt-1">{step.distance} • {step.duration}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
      
      <button 
        onClick={onStartNavigation}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 font-medium"
      >
        Start Navigation
      </button>
    </div>
  );
};

export default RouteInfoPanel;