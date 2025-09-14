import { useState, useCallback, useRef } from 'react';

export const useLocationTracking = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef(null);
  const [locationHistory, setLocationHistory] = useState([]);

  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        reject('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          setUserLocation(location);
          setLocationError(null);
          resolve(location);
        },
        (error) => {
          const errorMessage = getGeolocationErrorMessage(error);
          setLocationError(errorMessage);
          console.error('Geolocation error:', error);
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0 
        }
      );
    });
  }, []);

  const startWatchingLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return false;
    }

    if (watchIdRef.current) {
      // Already watching
      return true;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        
        setUserLocation(location);
        setLocationError(null);
        
        // Add to location history
        setLocationHistory(prev => {
          const newHistory = [...prev, location];
          // Keep only last 100 positions
          return newHistory.slice(-100);
        });
      },
      (error) => {
        const errorMessage = getGeolocationErrorMessage(error);
        setLocationError(errorMessage);
        console.error('Geolocation error:', error);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 1000,
        timeout: 5000
      }
    );

    watchIdRef.current = id;
    setWatching(true);
    return true;
  }, []);

  const stopWatchingLocation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setWatching(false);
    }
  }, []);

  const toggleWatchingLocation = useCallback(() => {
    if (watching) {
      stopWatchingLocation();
    } else {
      startWatchingLocation();
    }
  }, [watching, startWatchingLocation, stopWatchingLocation]);

  const clearLocationHistory = useCallback(() => {
    setLocationHistory([]);
  }, []);

  const getGeolocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case error.TIMEOUT:
        return 'The request to get your location timed out.';
      default:
        return 'An unknown error occurred while getting your location.';
    }
  };

  return {
    userLocation,
    locationError,
    watching,
    locationHistory,
    getUserLocation,
    startWatchingLocation,
    stopWatchingLocation,
    toggleWatchingLocation,
    clearLocationHistory
  };
};