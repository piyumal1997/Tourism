import React from 'react';

const LocationDetails = ({ location, onClose, onGetDirections, onAddToTrip }) => {
  const getCategoryColor = (category) => {
    const colors = {
      beach: 'bg-blue-500',
      cultural: 'bg-yellow-500',
      wildlife: 'bg-green-500',
      adventure: 'bg-red-500',
      restaurant: 'bg-orange-500',
      hotel: 'bg-purple-500',
      shopping: 'bg-teal-500'
    };
    return colors[category] || 'bg-blue-500';
  };

  return (
    <div className="location-details-panel">
      <div className="location-details-header">
        <img 
          src={location.image} 
          alt={location.title}
          className="location-details-image"
        />
        <button 
          onClick={onClose}
          className="location-details-close"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className={`location-details-category ${getCategoryColor(location.category)}`}>
          {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
        </div>
      </div>
      
      <div className="location-details-content">
        <h2 className="location-details-title">{location.title}</h2>
        
        <div className="location-details-address">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location.location}</span>
        </div>
        
        <div className="location-details-rating">
          <div className="rating-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(location.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              ></i>
            ))}
          </div>
          <span className="rating-count">({location.reviews} reviews)</span>
        </div>
        
        <p className="location-details-description">{location.description}</p>
        
        <div className="location-details-meta">
          <div className="meta-item">
            <div className="meta-label">Best Time to Visit</div>
            <div className="meta-value">{location.bestTime}</div>
          </div>
          
          <div className="meta-item">
            <div className="meta-label">Entry Fee</div>
            <div className="meta-value">{location.entryFee}</div>
          </div>
        </div>
        
        {location.highlights && location.highlights.length > 0 && (
          <div className="location-details-highlights">
            <h3 className="highlights-title">Highlights</h3>
            <div className="highlights-grid">
              {location.highlights.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="location-details-actions">
          <button 
            onClick={onGetDirections}
            className="action-button action-button-primary"
          >
            <i className="fas fa-directions"></i>
            Directions
          </button>
          
          <button 
            onClick={onAddToTrip}
            className="action-button action-button-secondary"
          >
            <i className="fas fa-plus"></i>
            Add to Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;