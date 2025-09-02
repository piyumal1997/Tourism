import { useState } from 'react';

export const useLocationTracking = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const getUserLocation = () => {
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
            lng: position.coords.longitude
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
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError('Unable to track your location');
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    setWatchId(id);
    setWatching(true);
  };

  const stopWatchingLocation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatching(false);
      setWatchId(null);
    }
  };

  return {
    userLocation,
    locationError,
    watching,
    getUserLocation,
    startWatchingLocation,
    stopWatchingLocation
  };
};