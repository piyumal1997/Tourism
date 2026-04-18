import React from 'react';

const LocationPanel = ({ location, onClose, onGetDirections, onAddToTrip }) => {
  const getCategoryColor = (category) => {
    const colors = {
      beach: 'category-beach',
      cultural: 'category-cultural',
      wildlife: 'category-wildlife',
      adventure: 'category-adventure',
      restaurant: 'category-restaurant',
      hotel: 'category-hotel',
      shopping: 'category-shopping'
    };
    return colors[category] || 'category-beach';
  };

  if (!location) return null;

  return (
    <div className="location-panel">
      <div className="location-panel-header">
        <img 
          src={location.image} 
          alt={location.title}
          className="location-panel-image"
        />
        <button 
          onClick={onClose}
          className="location-panel-close"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className={`location-panel-category ${getCategoryColor(location.category)}`}>
          {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
        </div>
      </div>
      
      <div className="location-panel-content">
        <h2 className="location-panel-title">{location.title}</h2>
        
        <div className="location-panel-address">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location.location}</span>
        </div>
        
        <div className="location-panel-rating">
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
        
        <p className="location-panel-description">{location.description}</p>
        
        <div className="location-panel-meta">
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
          <div className="location-panel-highlights">
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
        
        <div className="location-panel-actions">
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

export default LocationPanel;