import { useEffect, useRef, useState, useCallback } from 'react';
import { useMapLibre } from '../../../hooks/useMapLibre';
import { useLocationTracking } from '../../../hooks/useLocationTracking';
import { SRI_LANKA_CENTER } from '../../../utils/constants';
import MapControls from '../MapControls/MapControls';
import LocationCategories from '../LocationCategories/LocationCategories';
import { calculateDistance, findLocationsWithinRadius, generateCircleCoordinates } from '../../../utils/locationUtils';
import { useLocation } from '../../../contexts/LocationContext';
import RouteInfoPanel from '../RouteInfoPanel/RouteInfoPanel';
import NavigationPanel from '../NavigationPanel/NavigationPanel';
import LocationPanel from '../LocationPanel/LocationPanel';
import TrafficLayer from '../TrafficLayer/TrafficLayer';
import MultiStopRoutePlanner from '../MultiStopRoutePlanner/MultiStopRoutePlanner';

const MapSection = ({ locations, onLocationSelect, searchTerm, filters }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [is3DView, setIs3DView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [radiusCircle, setRadiusCircle] = useState(null);
  const [radiusFill, setRadiusFill] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [buildingLayerAdded, setBuildingLayerAdded] = useState(false);
  const [locationsInRadius, setLocationsInRadius] = useState([]);
  const [navigationMode, setNavigationMode] = useState(false);
  const [ecoRoute, setEcoRoute] = useState(null);
  const [showMultiStopPlanner, setShowMultiStopPlanner] = useState(false);
  const [trafficIncidents, setTrafficIncidents] = useState([]);
  const [alternateRoutes, setAlternateRoutes] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [routeOptions, setRouteOptions] = useState({
    avoidTolls: false,
    avoidHighways: false,
    ecoFriendly: false,
    considerTraffic: true
  });
  const [showTraffic, setShowTraffic] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const { isLoaded } = useMapLibre();
  const { userLocation, locationError, watching, toggleWatchingLocation, startWatchingLocation } = useLocationTracking();
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
          
          // Load traffic data but don't show it initially
          loadTrafficData();
        });

        newMap.on('click', (e) => {
          // Close details when clicking on the map (except when clicking on controls)
          if (selectedLocation && !e.originalEvent.target.closest('.map-controls, .location-panel')) {
            setSelectedLocation(null);
            setSelectedMarker(null);
          }
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
        });

        setMap(newMap);
      } catch (mapError) {
        console.error('Failed to initialize map:', mapError);
      }
    }
  }, [isLoaded, map, selectedLocation]);

  // Load traffic data
  const loadTrafficData = useCallback(() => {
    // Simulate traffic data (in a real app, this would come from an API)
    const simulatedIncidents = [
      {
        id: 1,
        type: 'congestion',
        message: 'Heavy traffic on A1 highway',
        coordinates: [79.8612, 6.9271],
        severity: 'high',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: 'accident',
        message: 'Accident on Colombo-Kandy road',
        coordinates: [80.6337, 7.2906],
        severity: 'medium',
        startTime: new Date(),
        endTime: new Date(Date.now() + 1 * 60 * 60 * 1000)
      }
    ];

    setTrafficIncidents(simulatedIncidents);
  }, []);

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

  // Toggle location tracking
  const handleTrackingToggle = useCallback(() => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    
    if (newTrackingState) {
      // Start tracking
      toggleWatchingLocation();
      if (!userLocation) {
        startWatchingLocation();
      }
    } else {
      // Stop tracking
      toggleWatchingLocation();
      
      // Hide radius visualization
      if (map && radiusCircle) {
        map.setLayoutProperty(radiusCircle, 'visibility', 'none');
      }
      
      if (map && radiusFill) {
        map.setLayoutProperty(radiusFill, 'visibility', 'none');
      }
      
      // Reset markers visibility
      markers.forEach(marker => {
        marker.getElement().style.display = 'block';
        marker.getElement().style.filter = '';
        marker.getElement().style.zIndex = '1';
      });
      
      setLocationsInRadius([]);
    }
  }, [isTracking, userLocation, map, radiusCircle, radiusFill, toggleWatchingLocation, startWatchingLocation]);

  // Update user location marker when location changes
  useEffect(() => {
    if (map && userLocation) {
      // Remove existing user location marker
      if (userLocationMarker) {
        userLocationMarker.remove();
      }
      
      // Create Google Maps-style blue dot with accuracy circle
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = `
        <div class="pulsating-circle"></div>
        <div class="location-dot">
          <div class="inner-dot"></div>
        </div>
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
      
      // Center map on user location if watching
      if (watching && navigationMode) {
        map.flyTo({
          center: [userLocation.lng, userLocation.lat],
          zoom: 15,
          duration: 1000
        });
      }
    }
  }, [map, userLocation, watching, navigationMode]);

  // Draw radius circle and filter locations
  useEffect(() => {
    if (map && userLocation && radius > 0 && isTracking) {
      // Show radius visualization
      if (radiusCircle) {
        map.setLayoutProperty(radiusCircle, 'visibility', 'visible');
      }
      
      if (radiusFill) {
        map.setLayoutProperty(radiusFill, 'visibility', 'visible');
      }
      
      // Generate circle coordinates
      const circleCoordinates = generateCircleCoordinates(
        userLocation.lat, 
        userLocation.lng, 
        radius,
        72
      );
      
      // Add radius circle source and layer if they don't exist
      if (!map.getSource('radius-circle')) {
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
      } else {
        // Update existing source
        map.getSource('radius-circle').setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: circleCoordinates
          }
        });
      }
      
      // Add radius fill source and layer if they don't exist
      if (!map.getSource('radius-fill')) {
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
      } else {
        // Update existing source
        map.getSource('radius-fill').setData({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [circleCoordinates]
          }
        });
      }
      
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
    } else if (map && (radiusCircle || radiusFill)) {
      // Hide the radius when not tracking
      if (radiusCircle) {
        map.setLayoutProperty(radiusCircle, 'visibility', 'none');
      }
      
      if (radiusFill) {
        map.setLayoutProperty(radiusFill, 'visibility', 'none');
      }
    }
  }, [map, userLocation, radius, locations, isTracking]);

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
          <div class="marker-pin ${location.category}">
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
          setSelectedLocation(location);
          
          // Highlight selected marker
          setSelectedMarker(marker);
          
          // Remove previous highlights
          markers.forEach(m => {
            if (m !== marker) {
              m.getElement().classList.remove('selected');
            }
          });
          
          // Add highlight to selected marker
          el.classList.add('selected');
          
          // Center map on selected location
          map.flyTo({
            center: [location.coordinates.lng, location.coordinates.lat],
            zoom: 15,
            duration: 1000
          });
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

  // Calculate route with multiple stops and traffic consideration
  const calculateRoute = async (waypoints, mode = travelMode, options = routeOptions) => {
    if (!map || waypoints.length < 2) return;

    try {
      // Show loading state
      setRouteInfo({ loading: true });
      
      // Format waypoints for OSRM
      const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
      
      // Add options for routing
      const params = new URLSearchParams({
        overview: 'full',
        geometries: 'geojson',
        steps: 'true',
        alternatives: '3'
      });
      
      if (options.avoidTolls) {
        params.append('avoid', 'tolls');
      }
      
      if (options.avoidHighways) {
        params.append('avoid', 'motorways');
      }
      
      // Include traffic consideration in route calculation
      if (options.considerTraffic && trafficIncidents.length > 0) {
        params.append('annotations', 'duration,speed');
      }
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${getOSRMMode(mode)}/${coordinates}?${params}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        // Process route data with traffic information
        processRouteDataWithTraffic(data, waypoints, mode, options);
        
        // Show traffic layer after route calculation
        setShowTraffic(true);
      }
    } catch (error) {
      console.error('Routing error:', error);
      setRouteInfo({ error: 'Failed to calculate route' });
    }
  };

  // Process route data with traffic information
  const processRouteDataWithTraffic = (data, waypoints, mode, options) => {
    // Sort routes by duration (fastest first)
    data.routes.sort((a, b) => a.duration - b.duration);
    
    const mainRoute = data.routes[0];
    const alternativeRoutes = data.routes.slice(1);
    
    // Calculate traffic impact
    const trafficImpact = calculateTrafficImpact(mainRoute, trafficIncidents);
    
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
        geometry: mainRoute.geometry
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
        'line-width': 6,
        'line-opacity': 0.8
      }
    });
    
    setRouteLayer('route');
    
    // Add alternative routes
    const altRoutes = alternativeRoutes.map((route, index) => {
      map.addSource(`alt-route-${index}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      });
      
      map.addLayer({
        id: `alt-route-${index}`,
        type: 'line',
        source: `alt-route-${index}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': index === 0 && ecoRoute ? '#34A853' : '#9E9E9E',
          'line-width': 4,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2]
        }
      });
      
      return {
        distance: (route.distance / 1000).toFixed(1) + ' km',
        duration: Math.round(route.duration / 60) + ' min',
        geometry: route.geometry
      };
    });
    
    setAlternateRoutes(altRoutes);
    
    // Extract route information with traffic details
    setRouteInfo({
      distance: (mainRoute.distance / 1000).toFixed(1) + ' km',
      duration: Math.round(mainRoute.duration / 60) + ' min',
      steps: mainRoute.legs.flatMap(leg => leg.steps),
      travelMode: mode,
      trafficImpact: trafficImpact,
      alternateRoutes: altRoutes,
      trafficIncidents: trafficIncidents.filter(incident => 
        isIncidentOnRoute(incident, mainRoute.geometry)
      )
    });
    
    // Enable navigation mode
    setNavigationMode(true);
  };

  // Calculate traffic impact on route
  const calculateTrafficImpact = (route, incidents) => {
    let totalDelay = 0;
    let affectedSegments = 0;
    
    incidents.forEach(incident => {
      if (isIncidentOnRoute(incident, route.geometry)) {
        // Simple estimation of delay based on incident severity
        const severityMultipliers = { high: 1.5, medium: 1.2, low: 1.1 };
        const delay = route.duration * 0.1 * severityMultipliers[incident.severity];
        totalDelay += delay;
        affectedSegments++;
      }
    });
    
    return {
      totalDelay: Math.round(totalDelay / 60), // Convert to minutes
      affectedSegments,
      hasTraffic: affectedSegments > 0
    };
  };

  // Check if incident is on the route
  const isIncidentOnRoute = (incident, routeGeometry) => {
    // Simple implementation - check if incident is near any point on the route
    const incidentPoint = { lng: incident.coordinates[0], lat: incident.coordinates[1] };
    
    for (let i = 0; i < routeGeometry.coordinates.length; i++) {
      const routePoint = {
        lng: routeGeometry.coordinates[i][0],
        lat: routeGeometry.coordinates[i][1]
      };
      
      const distance = calculateDistance(
        incidentPoint.lat, incidentPoint.lng,
        routePoint.lat, routePoint.lng
      );
      
      if (distance < 2) { // Within 2km of route
        return true;
      }
    }
    
    return false;
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

  // Start navigation
  const startNavigation = useCallback((route) => {
    setNavigationMode(true);
    // In a real implementation, this would start turn-by-turn navigation
    console.log('Starting navigation with route:', route);
  }, []);

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
      setNavigationMode(false);
      setShowTraffic(false);
      
      // Remove alternative routes
      alternateRoutes.forEach((_, index) => {
        if (map.getLayer(`alt-route-${index}`)) {
          map.removeLayer(`alt-route-${index}`);
          map.removeSource(`alt-route-${index}`);
        }
      });
      setAlternateRoutes([]);
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
      alert('Please enable location services first');
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

  // Add location to multi-stop route
  const addToMultiStopRoute = useCallback((location) => {
    if (selectedLocations.length >= 9) {
      alert('Maximum of 9 stops allowed');
      return;
    }
    
    // Check if location is already in the route
    const isAlreadyAdded = selectedLocations.some(
      loc => loc.id === location.id
    );
    
    if (isAlreadyAdded) {
      alert('This location is already in your route');
      return;
    }
    
    setSelectedLocations(prev => [...prev, location]);
    setShowMultiStopPlanner(true);
    
    // Show confirmation message
    alert(`${location.title} has been added to your route`);
  }, [selectedLocations]);

  // Calculate multi-stop route
  const calculateMultiStopRoute = useCallback(() => {
    if (selectedLocations.length < 2) {
      alert('Please select at least 2 locations for a multi-stop route');
      return;
    }
    
    const waypoints = userLocation 
      ? [userLocation, ...selectedLocations.map(l => l.coordinates)] 
      : selectedLocations.map(l => l.coordinates);
    
    calculateRoute(waypoints);
  }, [selectedLocations, userLocation]);

  // Update route options
  const updateRouteOptions = useCallback((newOptions) => {
    setRouteOptions(newOptions);
    
    // Recalculate route with new options
    if (routeInfo && userLocation && selectedLocations.length > 0) {
      const waypoints = userLocation 
        ? [userLocation, ...selectedLocations.map(l => l.coordinates)] 
        : selectedLocations.map(l => l.coordinates);
      
      calculateRoute(waypoints, travelMode, newOptions);
    }
  }, [routeInfo, userLocation, selectedLocations, travelMode]);

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
        isTracking={isTracking}
        onTrackingToggle={handleTrackingToggle}
        locationsInRadius={locationsInRadius}
        showMultiStopPlanner={showMultiStopPlanner}
        setShowMultiStopPlanner={setShowMultiStopPlanner}
        selectedLocations={selectedLocations}
        routeOptions={routeOptions}
        updateRouteOptions={updateRouteOptions}
      />
      
      {/* Location Error Alert */}
      {locationError && (
        <div className="error-message">
          <strong>Location Error: </strong>
          <span>{locationError}</span>
        </div>
      )}
      
      {/* Location Panel */}
      {selectedLocation && (
        <LocationPanel 
          location={selectedLocation}
          onClose={() => {
            setSelectedLocation(null);
            setSelectedMarker(null);
          }}
          onGetDirections={() => showRouteToLocation(selectedLocation)}
          onAddToTrip={() => addToMultiStopRoute(selectedLocation)}
        />
      )}
      
      {/* Multi-Stop Route Planner */}
      {showMultiStopPlanner && (
        <MultiStopRoutePlanner 
          selectedLocations={selectedLocations}
          onRemoveLocation={(index) => setSelectedLocations(prev => prev.filter((_, i) => i !== index))}
          onCalculateRoute={calculateMultiStopRoute}
          onClearAll={() => setSelectedLocations([])}
          onClose={() => setShowMultiStopPlanner(false)}
        />
      )}
      
      {/* Route Information Panel */}
      {routeInfo && !navigationMode && (
        <RouteInfoPanel 
          routeInfo={routeInfo}
          onClose={clearRoute}
          onStartNavigation={() => startNavigation(routeInfo)}
          trafficIncidents={trafficIncidents}
        />
      )}
      
      {/* Navigation Panel */}
      {navigationMode && routeInfo && (
        <NavigationPanel 
          routeInfo={routeInfo}
          onCancel={() => setNavigationMode(false)}
          onUpdateRoute={updateRouteOptions}
          is3DView={is3DView}
          onToggle3DView={toggle3DView}
          routeOptions={routeOptions}
        />
      )}
      
      {/* Traffic Layer - Only show when route is calculated and showTraffic is true */}
      {showTraffic && trafficIncidents.length > 0 && (
        <TrafficLayer 
          map={map} 
          incidents={trafficIncidents}
          onIncidentClick={(incident) => {
            if (routeInfo && routeInfo.alternateRoutes.length > 0) {
              alert(`Alternate routes available due to: ${incident.message}`);
            }
          }}
        />
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