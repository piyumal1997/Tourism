import { useEffect, useRef, useState } from 'react';
import { useMapLibre } from '../../../hooks/useMapLibre';
import { useLocationTracking } from '../../../hooks/useLocationTracking';
import { SRI_LANKA_CENTER } from '../../../utils/constants';
import MapControls from '../MapControls/MapControls';
import LocationCategories from '../LocationCategories/LocationCategories';
import { calculateDistance } from '../../../utils/locationUtils';
import { useLocation } from '../../../contexts/LocationContext';
import RouteInfoPanel from '../RouteInfoPanel/RouteInfoPanel';
import { getMapStyle, setupCustomProtocol } from '../../../utils/tileServerUtils';

const MapSection = ({ locations, onLocationSelect, searchTerm, filters }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [is3DView, setIs3DView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [popup, setPopup] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);
  const [currentTileServer, setCurrentTileServer] = useState('OPENSTREETMAP');
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [radiusCircle, setRadiusCircle] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const { isLoaded } = useMapLibre();
  const { userLocation, getUserLocation, startWatchingLocation, stopWatchingLocation, watching } = useLocationTracking();
  const { routeInfo, setRouteInfo, travelMode, radius } = useLocation();

  // CORS proxy function
  const corsProxy = (url) => {
    return `https://cors-anywhere.herokuapp.com/${url}`;
  };

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      try {
        // Initialize MapLibre with proper User-Agent headers
        const newMap = new window.maplibregl.Map({
          container: mapRef.current,
          style: getMapStyle(currentTileServer),
          center: [SRI_LANKA_CENTER.lng, SRI_LANKA_CENTER.lat],
          zoom: 7,
          minZoom: 6,
          maxZoom: 18,
          pitch: 0,
          bearing: 0,
          transformRequest: (url, resourceType) => {
            // Add User-Agent header to avoid 403 errors
            if (url.includes('openstreetmap.org') || url.includes('openfreemap.org')) {
              return {
                url: url,
                headers: {
                  'User-Agent': 'Sri-Lanka-Travel-Guide/1.0 (https://yourdomain.com)',
                  'Accept': 'image/webp,image/*,*/*'
                }
              };
            }
            // Use proxy for CORS issues
            if (url.includes('openfreemap.org') && resourceType === 'Tile') {
              return {
                url: corsProxy(url),
                headers: {
                  'User-Agent': 'Sri-Lanka-Travel-Guide/1.0'
                }
              };
            }
            return { url: url };
          }
        });

        // Set up custom protocol handling
        setupCustomProtocol(newMap);

        newMap.on('load', () => {
          setMap(newMap);
          console.log('Map loaded successfully with', currentTileServer);
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
          // Fallback to alternative tile server if OpenFreeMap fails
          if (e.error && (e.error.status === 403 || e.error.status === 429)) {
            console.log('Falling back to OpenStreetMap due to', e.error.status);
            setCurrentTileServer('OPENSTREETMAP');
            newMap.setStyle(getMapStyle('OPENSTREETMAP'));
          }
        });

        newMap.on('style.load', () => {
          // Add terrain after style load if available
          try {
            newMap.addSource('terrain', {
              type: 'raster-dem',
              url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
              tileSize: 256
            });
            newMap.setTerrain({ source: 'terrain', exaggeration: 1 });
          } catch (terrainError) {
            console.warn('Terrain not available:', terrainError);
          }
        });

        setMap(newMap);
      } catch (mapError) {
        console.error('Failed to initialize map:', mapError);
        // Fallback to basic OSM if everything else fails
        const fallbackMap = new window.maplibregl.Map({
          container: mapRef.current,
          style: {
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [{
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 22
            }]
          },
          center: [SRI_LANKA_CENTER.lng, SRI_LANKA_CENTER.lat],
          zoom: 7
        });
        setMap(fallbackMap);
      }
    }
  }, [isLoaded, map, currentTileServer]);

  // Update user location marker when location changes
  useEffect(() => {
    if (map && userLocation) {
      // Remove existing user location marker
      if (userLocationMarker) {
        userLocationMarker.remove();
      }
      
      // Create a new marker for user location
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = '<i class="fas fa-circle" style="color: #4285F4; font-size: 16px;"></i>';
      el.style.cursor = 'pointer';
      
      const marker = new window.maplibregl.Marker(el)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);
      
      setUserLocationMarker(marker);
      
      // Add accuracy circle if available
      if (userLocation.accuracy) {
        if (radiusCircle) {
          map.removeLayer('accuracy-circle');
          map.removeSource('accuracy-circle');
        }
        
        map.addSource('accuracy-circle', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [userLocation.lng, userLocation.lat]
            },
            properties: {
              radius: userLocation.accuracy
            }
          }
        });
        
        map.addLayer({
          id: 'accuracy-circle',
          type: 'circle',
          source: 'accuracy-circle',
          paint: {
            'circle-radius': {
              stops: [
                [0, 0],
                [20, userLocation.accuracy]
              ],
              base: 2
            },
            'circle-color': '#4285F4',
            'circle-opacity': 0.2,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#4285F4'
          }
        });
        
        setRadiusCircle('accuracy-circle');
      }
    }
  }, [map, userLocation]);

  // Draw radius circle when radius changes
  useEffect(() => {
    if (map && userLocation && radius) {
      // Remove existing radius circle
      if (map.getLayer('radius-circle')) {
        map.removeLayer('radius-circle');
        map.removeSource('radius-circle');
      }
      
      // Add new radius circle
      map.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [userLocation.lng, userLocation.lat]
          },
          properties: {
            radius: radius * 1000 // Convert km to meters
          }
        }
      });
      
      map.addLayer({
        id: 'radius-circle',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, radius * 1000]
            ],
            base: 2
          },
          'circle-color': '#FF9800',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FF9800'
        }
      });
    }
  }, [map, userLocation, radius]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      
      const newMarkers = locations.map(location => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(https://maps.google.com/mapfiles/ms/icons/${getMarkerColor(location.category)}-dot.png)`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        const marker = new window.maplibregl.Marker(el)
          .setLngLat([location.coordinates.lng, location.coordinates.lat])
          .addTo(map);

        el.addEventListener('click', () => {
          onLocationSelect(location);
          // Add to selected locations for route planning
          setSelectedLocations(prev => [...prev, location]);
        });

        let hoverPopup = null;
        
        el.addEventListener('mouseenter', () => {
          // Remove any existing popup
          if (popup) {
            popup.remove();
          }
          
          // Create new popup
          hoverPopup = new window.maplibregl.Popup({ offset: 25 })
            .setLngLat([location.coordinates.lng, location.coordinates.lat])
            .setHTML(`
              <div class="p-2 max-w-xs">
                <h3 class="font-bold text-sm">${location.title}</h3>
                <img src="${location.image}" alt="${location.title}" class="w-full h-24 object-cover mt-2 rounded">
                <p class="text-xs mt-1">${location.location}</p>
              </div>
            `)
            .addTo(map);
            
          setPopup(hoverPopup);
        });

        el.addEventListener('mouseleave', () => {
          if (hoverPopup) {
            hoverPopup.remove();
            setPopup(null);
          }
        });

        return marker;
      });
      
      setMarkers(newMarkers);
    }
  }, [map, locations]);

  const getMarkerColor = (category) => {
    const colors = {
      beach: 'blue',
      cultural: 'yellow',
      wildlife: 'green',
      adventure: 'purple'
    };
    return colors[category] || 'red';
  };

  const calculateRoute = async (waypoints, mode = travelMode) => {
    if (!map || waypoints.length < 2) return;

    try {
      // Format waypoints for OSRM
      const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${getOSRMMode(mode)}/${coordinates}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Remove existing route layer if any
        if (routeLayer) {
          map.removeLayer(routeLayer);
          map.removeSource(routeLayer);
        }
        
        // Add route source and layer
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });
        
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
        
        setRouteLayer('route');
        
        // Extract route information
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1) + ' km',
          duration: Math.round(route.duration / 60) + ' min',
          steps: route.legs.flatMap(leg => leg.steps),
          travelMode: mode
        });
      }
    } catch (error) {
      console.error('Routing error:', error);
    }
  };

  const getOSRMMode = (mode) => {
    const modes = {
      DRIVING: 'driving',
      WALKING: 'walking',
      BICYCLING: 'cycling',
      TRANSIT: 'driving' // OSRM doesn't support transit directly
    };
    return modes[mode] || 'driving';
  };

  const showRouteToLocation = (location) => {
    if (!userLocation) {
      getUserLocation().then(() => {
        if (userLocation) {
          calculateRoute([userLocation, location.coordinates]);
        }
      });
    } else {
      calculateRoute([userLocation, location.coordinates]);
    }
  };

  const calculateMultiPointRoute = () => {
    if (selectedLocations.length < 2) {
      alert('Please select at least 2 locations for route planning');
      return;
    }
    
    // If user location is available, start from there
    const waypoints = userLocation ? [userLocation, ...selectedLocations.map(l => l.coordinates)] : 
      selectedLocations.map(l => l.coordinates);
    
    calculateRoute(waypoints);
  };

  const clearRoute = () => {
    if (map && routeLayer) {
      map.removeLayer(routeLayer);
      map.removeSource(routeLayer);
      setRouteLayer(null);
      setRouteInfo(null);
      setSelectedLocations([]);
    }
  };

  const toggle3DView = () => {
    if (map) {
      setIs3DView(prev => {
        const newValue = !prev;
        if (newValue) {
          map.easeTo({
            pitch: 60,
            bearing: 0,
            duration: 1000
          });
        } else {
          map.easeTo({
            pitch: 0,
            bearing: 0,
            duration: 1000
          });
        }
        return newValue;
      });
    }
  };

  const resetView = () => {
    if (map) {
      map.flyTo({
        center: [SRI_LANKA_CENTER.lng, SRI_LANKA_CENTER.lat],
        zoom: 7,
        pitch: 0,
        bearing: 0,
        duration: 2000
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
        l.coordinates.lat === marker._lngLat.lat && 
        l.coordinates.lng === marker._lngLat.lng
      );
      
      if (location) {
        const isNearby = nearestLocations.includes(location);
        marker.getElement().style.display = isNearby ? 'block' : 'none';
      }
    });
    
    // Zoom to user location
    if (nearestLocations.length > 0) {
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 10,
        duration: 1000
      });
    }
  };

  const filterMarkers = (category) => {
    setActiveCategory(category);
    markers.forEach(marker => {
      const location = locations.find(l => 
        l.coordinates.lat === marker._lngLat.lat && 
        l.coordinates.lng === marker._lngLat.lng
      );
      
      if (location) {
        const shouldShow = category === 'all' || location.category === category;
        marker.getElement().style.display = shouldShow ? 'block' : 'none';
      }
    });
  };

  const handleTravelModeChange = (mode) => {
    if (selectedLocations.length > 0) {
      const waypoints = userLocation ? [userLocation, ...selectedLocations.map(l => l.coordinates)] : 
        selectedLocations.map(l => l.coordinates);
      
      calculateRoute(waypoints, mode);
    } else if (routeInfo && userLocation) {
      calculateRoute([userLocation, selectedLocation.coordinates], mode);
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
        selectedLocations={selectedLocations}
        calculateMultiPointRoute={calculateMultiPointRoute}
      />
      
      {/* Route Information Panel */}
      {routeInfo && (
        <RouteInfoPanel routeInfo={routeInfo} onClose={clearRoute} />
      )}
      
      {/* Selected Locations Panel */}
      {selectedLocations.length > 0 && (
        <div className="absolute top-20 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Selected Locations</h3>
            <button onClick={() => setSelectedLocations([])} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <ul className="space-y-2">
            {selectedLocations.map((location, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm">{location.title}</span>
                <button 
                  onClick={() => setSelectedLocations(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </li>
            ))}
          </ul>
          <button 
            onClick={calculateMultiPointRoute}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg"
          >
            Calculate Route
          </button>
        </div>
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