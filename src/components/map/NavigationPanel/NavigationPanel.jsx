import { useState, useEffect } from 'react';

const NavigationPanel = ({ routeInfo, onCancel, onUpdateRoute }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(routeInfo.duration);
  const [distanceRemaining, setDistanceRemaining] = useState(routeInfo.distance);

  useEffect(() => {
    // Simulate navigation progress
    const interval = setInterval(() => {
      setEta(prev => {
        const newEta = parseInt(prev) - 1;
        return newEta > 0 ? `${newEta} min` : 'Arrived';
      });
      
      setDistanceRemaining(prev => {
        const currentDistance = parseFloat(prev);
        const newDistance = (currentDistance - 0.1).toFixed(1);
        return newDistance > 0 ? `${newDistance} km` : '0 km';
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getManeuverIcon = (instruction) => {
    if (instruction.includes('left')) return 'fa-arrow-left';
    if (instruction.includes('right')) return 'fa-arrow-right';
    if (instruction.includes('straight')) return 'fa-arrow-up';
    if (instruction.includes('roundabout')) return 'fa-exchange-alt';
    if (instruction.includes('arrived')) return 'fa-flag-checkered';
    return 'fa-arrow-up';
  };

  return (
    <div className="navigation-panel">
      <div className="navigation-instruction">
        <div className="navigation-icon">
          <i className={`fas ${getManeuverIcon(routeInfo.steps[currentStep]?.maneuver?.instruction || '')}`}></i>
        </div>
        <div>
          <h3>{routeInfo.steps[currentStep]?.maneuver?.instruction || 'Continue straight'}</h3>
          <p>In {routeInfo.steps[currentStep]?.distance || '0'} m</p>
        </div>
      </div>
      
      <div className="navigation-details">
        <div>
          <div>ETA</div>
          <div className="font-bold">{eta}</div>
        </div>
        <div>
          <div>Distance</div>
          <div className="font-bold">{distanceRemaining}</div>
        </div>
        <div>
          <div>Mode</div>
          <div className="font-bold capitalize">{routeInfo.travelMode.toLowerCase()}</div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button 
          onClick={() => onUpdateRoute(routeInfo)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Alternate Route
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;