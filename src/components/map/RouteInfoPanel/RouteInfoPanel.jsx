const RouteInfoPanel = ({ routeInfo, onClose }) => {
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

  return (
    <div className="absolute top-20 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Route Information</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="flex items-center mb-3">
        <i className={`fas fa-${getTravelModeIcon(routeInfo.travelMode)} text-emerald-500 mr-2`}></i>
        <span className="font-medium capitalize">{routeInfo.travelMode.toLowerCase()}</span>
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
      
      <div>
        <h4 className="font-semibold mb-2">Directions:</h4>
        <ol className="list-decimal pl-5 space-y-2 max-h-60 overflow-y-auto">
          {routeInfo.steps.map((step, index) => (
            <li key={index} className="text-sm" dangerouslySetInnerHTML={{ __html: step.instructions }} />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RouteInfoPanel;