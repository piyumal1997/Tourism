import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [radius, setRadius] = useState(50); // in km

  const showRouteToLocation = (location) => {
    // This function is now handled in MapSection
    console.log('Route to location:', location);
  };

  const value = {
    selectedLocation,
    setSelectedLocation,
    routeInfo,
    setRouteInfo,
    travelMode,
    setTravelMode,
    radius,
    setRadius,
    showRouteToLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};