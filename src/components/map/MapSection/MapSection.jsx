import { useEffect, useRef, useState, useCallback } from 'react';
import { useMapLibre } from '../../../hooks/useMapLibre';
import { useLocationTracking } from '../../../hooks/useLocationTracking';
import { SRI_LANKA_CENTER } from '../../../utils/constants';
import MapControls from '../MapControls/MapControls';
import LocationCategories from '../LocationCategories/LocationCategories';
import { calculateDistance, findLocationsWithinRadius, generateCircleCoordinates } from '../../../utils/locationUtils';
import { useLocation } from '../../../contexts/LocationContext';
import RouteInfoPanel from '../RouteInfoPanel/RouteInfoPanel';

const MapSection = ({ locations, onLocationSelect, searchTerm, filters }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [is3DView, setIs3DView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [popup, setPopup] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [radiusCircle, setRadiusCircle] = useState(null);
  const [radiusFill, setRadiusFill] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [buildingLayerAdded, setBuildingLayerAdded] = useState(false);
  const [locationsInRadius, setLocationsInRadius] = useState([]);
  const { isLoaded } = useMapLibre();
  const { userLocation, locationError, watching, toggleWatchingLocation } = useLocationTracking();
  const { routeInfo, setRouteInfo, travelMode, radius, setRadius } = useLocation();

  // Initialize Map with 3D capabilities
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      try {
        const newMap = new window.maplibregl.Map({
          container: mapRef.current,
          style: 'https://tiles.openfreemap.org/styles/bright',
          center: [SRI_LANKA_CENTER.lng, SRI_LANKA_CENTER.lat],
          zoom: 10,
          minZoom: 6,
          maxZoom: 18,
          pitch: 0,
          bearing: 0,
          canvasContextAttributes: { antialias: true }
        });

        newMap.on('load', () => {
          setMap(newMap);
          console.log('Map loaded successfully');
          
          // Add 3D buildings layer
          add3DBuildingsLayer(newMap);
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
        });

        setMap(newMap);
      } catch (mapError) {
        console.error('Failed to initialize map:', mapError);
      }
    }
  }, [isLoaded, map]);

  // Add 3D buildings layer to the map
  const add3DBuildingsLayer = useCallback((mapInstance) => {
    if (!mapInstance || buildingLayerAdded) return;

    try {
      // Insert the layer beneath any symbol layer
      const layers = mapInstance.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      // Add vector source for buildings
      mapInstance.addSource('openfreemap', {
        url: 'https://tiles.openfreemap.org/planet',
        type: 'vector',
      });

      // Add 3D buildings layer
      mapInstance.addLayer(
        {
          'id': '3d-buildings',
          'source': 'openfreemap',
          'source-layer': 'building',
          'type': 'fill-extrusion',
          'minzoom': 13,
          'filter': ['!=', ['get', 'hide_3d'], true],
          'paint': {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'], 
              0, 'lightgray', 
              200, 'royalblue', 
              400, 'lightblue'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              13,
              0,
              16,
              ['get', 'render_height']
            ],
            'fill-extrusion-base': [
              'case',
              ['>=', ['get', 'zoom'], 16],
              ['get', 'render_min_height'], 
              0
            ],
            'fill-extrusion-opacity': 0.9
          }
        },
        labelLayerId
      );

      setBuildingLayerAdded(true);
      console.log('3D buildings layer added successfully');
    } catch (error) {
      console.error('Failed to add 3D buildings layer:', error);
    }
  }, [buildingLayerAdded]);

  // Update user location marker when location changes
  useEffect(() => {
    if (map && userLocation) {
      // Remove existing user location marker
      if (userLocationMarker) {
        userLocationMarker.remove();
      }
      
      // Create a pulsating blue dot for user location
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = `
        <div class="pulsating-circle"></div>
        <div class="location-dot"></div>
      `;
      
      const marker = new window.maplibregl.Marker(el, { offset: [0, 0] })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);
      
      setUserLocationMarker(marker);
      
      // Add accuracy circle
      if (map.getSource('accuracy-circle')) {
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
            radius: userLocation.accuracy || 20
          }
        }
      });
      
      if (!map.getLayer('accuracy-circle')) {
        map.addLayer({
          id: 'accuracy-circle',
          type: 'circle',
          source: 'accuracy-circle',
          paint: {
            'circle-radius': ['get', 'radius'],
            'circle-color': '#4285F4',
            'circle-opacity': 0.2,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#4285F4'
          }
        });
      }
    }
  }, [map, userLocation]);

  // Draw radius circle and filter locations
  useEffect(() => {
    if (map && userLocation && radius > 0) {
      // Remove existing radius circle and fill
      if (radiusCircle) {
        map.removeLayer(radiusCircle);
        map.removeSource(radiusCircle);
      }
      
      if (radiusFill) {
        map.removeLayer(radiusFill);
        map.removeSource(radiusFill);
      }
      
      // Generate circle coordinates
      const circleCoordinates = generateCircleCoordinates(
        userLocation.lat, 
        userLocation.lng, 
        radius,
        72 // Number of points for smooth circle
      );
      
      // Add radius circle source and layer
      map.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: circleCoordinates
          }
        }
      });
      
      map.addLayer({
        id: 'radius-circle',
        type: 'line',
        source: 'radius-circle',
        paint: {
          'line-color': '#FF5722',
          'line-width': 2,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2]
        }
      });
      
      setRadiusCircle('radius-circle');
      
      // Add radius fill source and layer
      map.addSource('radius-fill', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [circleCoordinates]
          }
        }
      });
      
      map.addLayer({
        id: 'radius-fill',
        type: 'fill',
        source: 'radius-fill',
        paint: {
          'fill-color': '#FF5722',
          'fill-opacity': 0.1
        }
      });
      
      setRadiusFill('radius-fill');
      
      // Find and highlight locations within radius
      const locationsWithinRadius = findLocationsWithinRadius(
        locations, 
        userLocation.lat, 
        userLocation.lng, 
        radius
      );
      
      setLocationsInRadius(locationsWithinRadius);
      
      // Update markers visibility and style
      markers.forEach(marker => {
        const location = locations.find(l => 
          l.coordinates.lat === marker._lngLat.lat && 
          l.coordinates.lng === marker._lngLat.lng
        );
        
        if (location) {
          const isWithinRadius = locationsWithinRadius.some(l => l.id === location.id);
          marker.getElement().style.display = isWithinRadius ? 'block' : 'none';
          
          // Add highlight effect for locations within radius
          if (isWithinRadius) {
            marker.getElement().style.filter = 'drop-shadow(0px 0px 8px rgba(255, 87, 34, 0.8))';
            marker.getElement().style.zIndex = '10';
          } else {
            marker.getElement().style.filter = '';
            marker.getElement().style.zIndex = '1';
          }
        }
      });
    }
  }, [map, userLocation, radius, locations]);

  // Add Google Maps-style markers
  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      
      const newMarkers = locations.map(location => {
        // Create Google Maps-style marker
        const el = document.createElement('div');
        el.className = 'google-maps-marker';
        el.innerHTML = `
          <div class="marker-pin">
            <i class="fas ${getCategoryIcon(location.category)}"></i>
          </div>
          <div class="marker-label">${location.title}</div>
        `;
        
        el.style.cursor = 'pointer';

        const marker = new window.maplibregl.Marker(el, {
          offset: [0, -25]
        })
          .setLngLat([location.coordinates.lng, location.coordinates.lat])
          .addTo(map);

        // Click event to select location
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onLocationSelect(location);
        });

        return marker;
      });
      
      setMarkers(newMarkers);
    }
  }, [map, locations]);

  // Toggle 3D view with buildings
  const toggle3DView = useCallback(() => {
    if (map) {
      setIs3DView(prev => {
        const newValue = !prev;
        
        if (newValue) {
          // Enable 3D view
          map.easeTo({
            pitch: 45,
            bearing: -17.6,
            duration: 1000,
            zoom: 15
          });
          
          // Ensure 3D buildings layer is added
          if (!buildingLayerAdded) {
            add3DBuildingsLayer(map);
          }
        } else {
          // Return to 2D view
          map.easeTo({
            pitch: 0,
            bearing: 0,
            duration: 1000
          });
        }
        
        return newValue;
      });
    }
  }, [map, buildingLayerAdded, add3DBuildingsLayer]);

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      beach: 'fa-umbrella-beach',
      cultural: 'fa-landmark',
      wildlife: 'fa-paw',
      adventure: 'fa-hiking',
      restaurant: 'fa-utensils',
      hotel: 'fa-hotel',
      shopping: 'fa-shopping-cart',
      default: 'fa-map-marker-alt'
    };
    return icons[category] || icons.default;
  };

  // Calculate route with multiple stops
  const calculateRoute = async (waypoints, mode = travelMode) => {
    if (!map || waypoints.length < 2) return;

    try {
      // Format waypoints for OSRM
      const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${getOSRMMode(mode)}/${coordinates}?overview=full&geometries=geojson&steps=true`
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
            'line-color': '#4285F4',
            'line-width': 5,
            'line-opacity': 0.7
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

  // Get OSRM travel mode
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
      alert('Please enable location tracking first');
      return;
    }
    
    calculateRoute([userLocation, location.coordinates]);
  };

  const clearRoute = () => {
    if (map && routeLayer) {
      map.removeLayer(routeLayer);
      map.removeSource(routeLayer);
      setRouteLayer(null);
      setRouteInfo(null);
    }
  };

  const resetView = () => {
    if (map) {
      map.flyTo({
        center: [SRI_LANKA_CENTER.lng, SRI_LANKA_CENTER.lat],
        zoom: 8,
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
      alert('Please enable location tracking first');
      return;
    }
    
    // Zoom to user location
    map.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
      duration: 1000
    });
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
        travelMode={travelMode}
        radius={radius}
        setRadius={setRadius}
        watchingLocation={watching}
        toggleWatchingLocation={toggleWatchingLocation}
        locationsInRadius={locationsInRadius}
      />
      
      {/* Location Error Alert */}
      {locationError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Location Error: </strong>
          <span className="block sm:inline">{locationError}</span>
        </div>
      )}
      
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