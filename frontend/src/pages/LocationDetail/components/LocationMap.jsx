import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../../hooks/useGoogleMaps';

const LocationMap = ({ location }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: location.coordinates,
        zoom: 14,
        styles: [
          {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
              { "visibility": "off" }
            ]
          }
        ]
      });

      // Add marker for the location
      new window.google.maps.Marker({
        position: location.coordinates,
        map: newMap,
        title: location.title
      });

      setMap(newMap);
    }
  }, [isLoaded, map, location]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Location Map</h3>
      <div ref={mapRef} className="h-64 rounded-md"></div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Getting There</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <i className="fas fa-bus text-emerald-500 mr-2 w-5"></i>
            <span>Public transport available</span>
          </li>
          <li className="flex items-center">
            <i className="fas fa-car text-emerald-500 mr-2 w-5"></i>
            <span>Parking available nearby</span>
          </li>
          <li className="flex items-center">
            <i className="fas fa-walking text-emerald-500 mr-2 w-5"></i>
            <span>Walking distance from main road</span>
          </li>
        </ul>
      </div>
      
      <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md flex items-center justify-center">
        <i className="fas fa-directions mr-2"></i>
        Get Directions
      </button>
    </div>
  );
};

export default LocationMap;