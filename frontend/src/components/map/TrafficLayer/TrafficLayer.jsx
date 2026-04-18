import { useEffect, useState } from 'react';

const TrafficLayer = ({ map, incidents, onIncidentClick }) => {
  const [trafficMarkers, setTrafficMarkers] = useState([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    trafficMarkers.forEach(marker => marker.remove());

    // Create new markers for each incident
    const newMarkers = incidents.map(incident => {
      const el = document.createElement('div');
      el.className = 'traffic-incident-marker';
      el.innerHTML = `
        <div class="traffic-icon ${incident.severity}">
          <i class="${
            incident.type === 'congestion' ? 'fa-traffic-light' :
            incident.type === 'accident' ? 'fa-car-crash' :
            'fa-road-closed'
          }"></i>
        </div>
      `;
      
      el.style.cursor = 'pointer';
      
      const marker = new window.maplibregl.Marker(el, { offset: [0, -20] })
        .setLngLat(incident.coordinates)
        .addTo(map);
      
      // Add click event
      el.addEventListener('click', () => {
        onIncidentClick(incident);
      });
      
      return marker;
    });
    
    setTrafficMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [map, incidents, onIncidentClick]);

  // Show traffic popups
  useEffect(() => {
    if (!map) return;

    const popups = incidents.map(incident => {
      const popup = new window.maplibregl.Popup({ offset: 25 })
        .setLngLat(incident.coordinates)
        .setHTML(`
          <div class="traffic-incident">
            <div class="traffic-incident-header">
              <div class="traffic-incident-icon ${incident.type}">
                <i class="${
                  incident.type === 'congestion' ? 'fa-traffic-light' :
                  incident.type === 'accident' ? 'fa-car-crash' :
                  'fa-road-closed'
                }"></i>
              </div>
              <div class="traffic-incident-title">
                ${incident.type === 'congestion' ? 'Traffic Congestion' :
                  incident.type === 'accident' ? 'Accident' :
                  'Road Closure'}
              </div>
            </div>
            <div class="traffic-incident-message">${incident.message}</div>
            <div class="traffic-incident-time">
              Started: ${new Date(incident.startTime).toLocaleTimeString()}
            </div>
          </div>
        `);
      
      return popup;
    });

    // Add popups to map
    popups.forEach(popup => {
      popup.addTo(map);
    });

    return () => {
      popups.forEach(popup => popup.remove());
    };
  }, [map, incidents]);

  return null;
};

export default TrafficLayer;