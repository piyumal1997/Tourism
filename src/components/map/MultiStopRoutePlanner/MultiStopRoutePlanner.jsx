import { useState } from 'react';

const MultiStopRoutePlanner = ({ 
  selectedLocations, 
  onRemoveLocation, 
  onCalculateRoute, 
  onClearAll, 
  onClose 
}) => {
  const [reordering, setReordering] = useState(false);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (sourceIndex !== targetIndex) {
      const newLocations = [...selectedLocations];
      const [movedItem] = newLocations.splice(sourceIndex, 1);
      newLocations.splice(targetIndex, 0, movedItem);
      // In a real implementation, you would update the state with the new order
      console.log('Reordered stops:', newLocations);
    }
  };

  return (
    <div className="multi-stop-planner">
      <div className="planner-header">
        <h2 className="planner-title">Multi-Stop Route Planner</h2>
        <button onClick={onClose} className="planner-close">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="planner-stops">
        {selectedLocations.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="fas fa-route text-3xl mb-2"></i>
            <p>Add locations to create a multi-stop route</p>
          </div>
        ) : (
          selectedLocations.map((location, index) => (
            <div
              key={index}
              className="planner-stop"
              draggable={reordering}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="planner-stop-number">{index + 1}</div>
              <div className="planner-stop-info">
                <div className="planner-stop-name">{location.title}</div>
                <div className="planner-stop-address">{location.location}</div>
              </div>
              <button 
                onClick={() => onRemoveLocation(index)}
                className="planner-stop-remove"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-between mb-4">
        <span className="text-sm text-gray-500">
          {selectedLocations.length} of 9 stops added
        </span>
        {selectedLocations.length > 0 && (
          <button 
            onClick={() => setReordering(!reordering)}
            className="text-sm text-blue-500"
          >
            {reordering ? 'Done Reordering' : 'Reorder Stops'}
          </button>
        )}
      </div>
      
      <div className="planner-actions">
        <button 
          onClick={onClearAll}
          className="planner-button planner-button-secondary"
          disabled={selectedLocations.length === 0}
        >
          <i className="fas fa-trash"></i>
          Clear All
        </button>
        <button 
          onClick={onCalculateRoute}
          className="planner-button planner-button-primary"
          disabled={selectedLocations.length < 2}
        >
          <i className="fas fa-route"></i>
          Calculate Route
        </button>
      </div>
    </div>
  );
};

export default MultiStopRoutePlanner;