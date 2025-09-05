import { useState, useCallback } from 'react';

export const useLocationTracking = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

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
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
          setLocationError(null);
          resolve(location);
        },
        (error) => {
          setLocationError('Unable to retrieve your location');
          console.error('Geolocation error:', error);
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 60000 
        }
      );
    });
  }, []);

  const startWatchingLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError('Unable to track your location');
        console.error('Geolocation error:', error);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 10000,
        timeout: 5000
      }
    );

    setWatchId(id);
    setWatching(true);
  }, []);

  const stopWatchingLocation = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatching(false);
      setWatchId(null);
    }
  }, [watchId]);

  return {
    userLocation,
    locationError,
    watching,
    getUserLocation,
    startWatchingLocation,
    stopWatchingLocation
  };
};