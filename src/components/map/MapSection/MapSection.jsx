import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../../hooks/useGoogleMaps';
import { useLocationTracking } from '../../../hooks/useLocationTracking';
import { SRI_LANKA_CENTER, SRI_LANKA_BOUNDS } from '../../../utils/constants';
import MapControls from '../MapControls/MapControls';
import LocationCategories from '../LocationCategories/LocationCategories';
import { calculateDistance } from '../../../utils/locationUtils';
import { useLocation } from '../../../contexts/LocationContext';
import RouteInfoPanel from '../RouteInfoPanel/RouteInfoPanel';

const MapSection = ({ locations, onLocationSelect, searchTerm, filters }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [is3DView, setIs3DView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoverInfoWindow, setHoverInfoWindow] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const { isLoaded } = useGoogleMaps();
  const { userLocation, getUserLocation, startWatchingLocation, stopWatchingLocation, watching } = useLocationTracking();
  const { routeInfo, setRouteInfo, travelMode, radius } = useLocation();

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: SRI_LANKA_CENTER,
        zoom: 8,
        minZoom: 7,
        maxZoom: 18,
        restriction: {
          latLngBounds: SRI_LANKA_BOUNDS,
          strictBounds: true
        },
        styles: [
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#1a1a1a"
              },
              {
                "weight": 2
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#d4e6f1"
              }
            ]
          },
          {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#e8f5e9"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
              { "visibility": "off" }
            ]
          }
        ]
      });

      setMap(newMap);
      setDirectionsRenderer(new window.google.maps.DirectionsRenderer());
    }
  }, [isLoaded]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = locations.map(location => {
        let icon;
        switch(location.category) {
          case 'beach':
            icon = {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            };
            break;
          case 'cultural':
            icon = {
              url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            };
            break;
          case 'wildlife':
            icon = {
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            };
            break;
          case 'adventure':
            icon = {
              url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            };
            break;
          default:
            icon = {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            };
        }
        
        const marker = new window.google.maps.Marker({
          position: location.coordinates,
          map: map,
          title: location.title,
          icon: icon,
          category: location.category,
          animation: window.google.maps.Animation.DROP
        });
        
        // Add click event to show location details
        marker.addListener('click', () => {
          onLocationSelect(location);
        });
        
        // Add hover event to show info window
        let infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2 max-w-xs">
              <h3 class="font-bold text-sm">${location.title}</h3>
              <img src="${location.image}" alt="${location.title}" class="w-full h-24 object-cover mt-2 rounded">
              <p class="text-xs mt-1">${location.location}</p>
            </div>
          `
        });
        
        marker.addListener('mouseover', () => {
          infoWindow.open(map, marker);
          setHoverInfoWindow(infoWindow);
        });
        
        marker.addListener('mouseout', () => {
          infoWindow.close();
          setHoverInfoWindow(null);
        });
        
        return marker;
      });
      
      setMarkers(newMarkers);
    }
  }, [map, locations]);

  const calculateRoute = async (origin, destination, mode = travelMode) => {
    if (!map || !directionsRenderer) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: mode,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(result);
          
          // Extract route information
          const route = result.routes[0];
          const leg = route.legs[0];
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
            steps: leg.steps,
            travelMode: mode
          });
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  const showRouteToLocation = (location) => {
    if (!userLocation) {
      getUserLocation().then(() => {
        if (userLocation) {
          calculateRoute(userLocation, location.coordinates);
        }
      });
    } else {
      calculateRoute(userLocation, location.coordinates);
    }
  };

  const showRouteBetweenLocations = (startLocation, endLocation) => {
    calculateRoute(startLocation.coordinates, endLocation.coordinates);
  };

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setRouteInfo(null);
    }
  };

  const toggle3DView = () => {
    if (map) {
      setIs3DView(prev => {
        const newValue = !prev;
        if (newValue) {
          map.setOptions({
            tilt: 45,
            heading: 20,
            zoom: 15,
            mapTypeId: window.google.maps.MapTypeId.HYBRID
          });
        } else {
          map.setOptions({
            tilt: 0,
            heading: 0,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP
          });
        }
        return newValue;
      });
    }
  };

  const resetView = () => {
    if (map) {
      map.setCenter(SRI_LANKA_CENTER);
      map.setZoom(8);
      map.setOptions({
        tilt: 0,
        heading: 0,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      });
      setIs3DView(false);
      clearRoute();
    }
  };

  const findNearestLocations = () => {
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    // Find locations within selected radius
    const nearestLocations = locations.filter(location => {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        location.coordinates.lat,
        location.coordinates.lng
      );
      return distance <= radius;
    });
    
    // Sort by distance
    nearestLocations.sort((a, b) => {
      const distA = calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distB = calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distA - distB;
    });
    
    // Update markers to show only nearest locations
    markers.forEach(marker => {
      const location = locations.find(l => 
        l.coordinates.lat === marker.position.lat() && 
        l.coordinates.lng === marker.position.lng()
      );
      
      if (location) {
        const isNearby = nearestLocations.includes(location);
        marker.setVisible(isNearby);
      }
    });
    
    // Zoom to user location
    if (nearestLocations.length > 0) {
      map.setCenter(userLocation);
      map.setZoom(10);
    }
  };

  const filterMarkers = (category) => {
    setActiveCategory(category);
    markers.forEach(marker => {
      if (category === 'all' || marker.category === category) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
  };

  const handleTravelModeChange = (mode) => {
    if (routeInfo && userLocation && selectedLocation) {
      calculateRoute(userLocation, selectedLocation.coordinates, mode);
    }
  };

  const handleRadiusChange = (newRadius) => {
    if (userLocation) {
      findNearestLocations();
    }
  };

  return (
    <section className="relative">
      <div ref={mapRef} className="h-screen w-full"></div>
      
      {/* Map Controls */}
      <MapControls 
        toggle3DView={toggle3DView} 
        resetView={resetView} 
        is3DView={is3DView}
        findNearestLocations={findNearestLocations}
        userLocation={userLocation}
        clearRoute={clearRoute}
        onTravelModeChange={handleTravelModeChange}
        onRadiusChange={handleRadiusChange}
        watchingLocation={watching}
        startWatchingLocation={startWatchingLocation}
        stopWatchingLocation={stopWatchingLocation}
      />
      
      {/* Route Information Panel */}
      {routeInfo && (
        <RouteInfoPanel routeInfo={routeInfo} onClose={clearRoute} />
      )}
      
      {/* Location Categories */}
      <LocationCategories 
        filterMarkers={filterMarkers} 
        activeCategory={activeCategory}
      />
    </section>
  );
};

export default MapSection;