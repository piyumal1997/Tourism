import { useState } from 'react';

const NavigationPanel = ({ 
  routeInfo, 
  onCancel, 
  onUpdateRoute, 
  is3DView, 
  onToggle3DView,
  routeOptions
}) => {
  const [avoidTolls, setAvoidTolls] = useState(routeOptions.avoidTolls);
  const [avoidHighways, setAvoidHighways] = useState(routeOptions.avoidHighways);
  const [ecoFriendly, setEcoFriendly] = useState(routeOptions.ecoFriendly);
  const [considerTraffic, setConsiderTraffic] = useState(routeOptions.considerTraffic);
  const [showAlternateRoutes, setShowAlternateRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(0); // 0 is the main route

  const handleRouteOptionsChange = () => {
    const newOptions = {
      avoidTolls,
      avoidHighways,
      ecoFriendly,
      considerTraffic
    };
    onUpdateRoute(newOptions);
  };

  const toggleViewMode = () => {
    onToggle3DView();
  };

  const selectRoute = (index) => {
    setSelectedRoute(index);
    // In a real implementation, you would highlight the selected route on the map
  };

  // Safe access to route steps to prevent undefined errors
  const routeSteps = routeInfo?.steps || [];

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white rounded-xl shadow-xl z-10">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button onClick={onCancel} className="text-gray-500">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* 3D/2D View Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button 
              onClick={toggleViewMode}
              className={`px-4 py-2 rounded-full ${!is3DView ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            >
              2D
            </button>
            <button 
              onClick={toggleViewMode}
              className={`px-4 py-2 rounded-full ${is3DView ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            >
              3D
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Distance</div>
            <div className="font-bold">{routeInfo?.distance || 'N/A'}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-bold">{routeInfo?.duration || 'N/A'}</div>
          </div>
        </div>
        
        {routeInfo?.ecoFriendlyAlternative && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-leaf text-green-500 mr-2"></i>
              <div className="font-bold">Eco-Friendly Route</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-500">Distance</div>
                <div className="font-bold">{routeInfo.ecoFriendlyAlternative.distance}</div>
              </div>
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="font-bold">{routeInfo.ecoFriendlyAlternative.duration}</div>
              </div>
              <div>
                <div className="text-gray-500">Fuel Efficiency</div>
                <div className="font-bold text-green-600">{routeInfo.ecoFriendlyAlternative.fuelEfficiency?.score || 'N/A'}/100</div>
              </div>
              <div>
                <div className="text-gray-500">CO₂ Savings</div>
                <div className="font-bold text-green-600">{routeInfo.ecoFriendlyAlternative.fuelEfficiency?.co2Emissions || 'N/A'}</div>
              </div>
            </div>
            <button 
              onClick={() => {
                setEcoFriendly(!ecoFriendly);
                handleRouteOptionsChange();
              }}
              className={`w-full mt-2 py-2 rounded-lg ${ecoFriendly ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'}`}
            >
              {ecoFriendly ? 'Selected' : 'Use This Route'}
            </button>
          </div>
        )}
        
        {routeInfo?.alternateRoutes && routeInfo.alternateRoutes.length > 0 && (
          <div className="mb-4">
            <button 
              onClick={() => setShowAlternateRoutes(!showAlternateRoutes)}
              className="w-full text-left font-medium flex items-center justify-between"
            >
              <span>Alternate Routes ({routeInfo.alternateRoutes.length})</span>
              <i className={`fas fa-${showAlternateRoutes ? 'chevron-up' : 'chevron-down'}`}></i>
            </button>
            
            {showAlternateRoutes && (
              <div className="mt-2 space-y-2">
                {routeInfo.alternateRoutes.map((route, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${selectedRoute === index + 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => selectRoute(index + 1)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Route {index + 1}</div>
                      <div>
                        <span className="font-bold">{route.distance}</span>
                        <span className="text-gray-500"> • {route.duration}</span>
                      </div>
                    </div>
                    {route.isEcoFriendly && (
                      <div className="flex items-center mt-1 text-green-600 text-sm">
                        <i className="fas fa-leaf mr-1"></i>
                        <span>Eco-friendly option</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <div className="font-medium mb-2">Route Options</div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={avoidTolls}
                onChange={() => setAvoidTolls(!avoidTolls)}
                className="mr-2 rounded text-blue-500"
              />
              Avoid Tolls
            </label>
            
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={avoidHighways}
                onChange={() => setAvoidHighways(!avoidHighways)}
                className="mr-2 rounded text-blue-500"
              />
              Avoid Highways
            </label>
            
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={ecoFriendly}
                onChange={() => setEcoFriendly(!ecoFriendly)}
                className="mr-2 rounded text-blue-500"
              />
              Eco-Friendly
            </label>
            
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={considerTraffic}
                onChange={() => setConsiderTraffic(!considerTraffic)}
                className="mr-2 rounded text-blue-500"
              />
              Consider Traffic
            </label>
          </div>
          
          <button 
            onClick={handleRouteOptionsChange}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2"
          >
            Update Route
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="font-medium mb-2">Turn-by-Turn Directions</div>
          <div className="max-h-40 overflow-y-auto">
            {routeSteps.slice(0, 5).map((step, index) => (
              <div key={index} className="py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                    {index + 1}
                  </div>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: step.instructions }} />
                </div>
                {step.distance && (
                  <div className="text-xs text-gray-500 ml-8">
                    {step.distance} • {step.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onCancel}
            className="py-3 px-4 border border-gray-300 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={() => console.log('Start navigation')}
            className="py-3 px-4 bg-blue-500 text-white rounded-lg font-medium"
          >
            Start Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;