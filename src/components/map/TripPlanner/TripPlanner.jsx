import { useState } from 'react';

const TripPlanner = ({ selectedLocations, onAddLocation, onRemoveLocation, onCalculateRoute, onSaveTrip }) => {
  const [tripName, setTripName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSaveTrip = () => {
    if (!tripName.trim()) {
      alert('Please enter a name for your trip');
      return;
    }
    
    onSaveTrip(tripName);
    setTripName('');
    setShowSaveForm(false);
  };

  return (
    <div className="trip-planner">
      <h3 className="font-bold mb-3">Trip Planner</h3>
      
      {selectedLocations.length === 0 ? (
        <p className="text-gray-500">Select locations on the map to add them to your trip</p>
      ) : (
        <>
          <div className="trip-locations">
            {selectedLocations.map((location, index) => (
              <div key={index} className="trip-location">
                <div>
                  <div className="font-medium">{location.title}</div>
                  <div className="text-sm text-gray-500">{location.location}</div>
                </div>
                <button 
                  onClick={() => onRemoveLocation(index)}
                  className="text-red-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="trip-actions">
            <button 
              onClick={onCalculateRoute}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Calculate Route
            </button>
            
            <button 
              onClick={() => setShowSaveForm(true)}
              className="flex-1 border border-blue-500 text-blue-500 py-2 px-4 rounded-lg ml-2"
            >
              Save Trip
            </button>
          </div>
        </>
      )}
      
      {showSaveForm && (
        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
          <input
            type="text"
            placeholder="Trip name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="flex mt-2">
            <button 
              onClick={handleSaveTrip}
              className="flex-1 bg-blue-500 text-white py-1 px-3 rounded-md"
            >
              Save
            </button>
            <button 
              onClick={() => setShowSaveForm(false)}
              className="flex-1 border border-gray-300 py-1 px-3 rounded-md ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;