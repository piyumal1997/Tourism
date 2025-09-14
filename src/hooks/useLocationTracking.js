import { useState, useCallback } from 'react';

export const useLocationTracking = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [shareSession, setShareSession] = useState(null);

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
          setLocationError('Unable to retrieve your location');
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
      return;
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
        
        // Emit event for real-time sharing
        if (shareSession) {
          document.dispatchEvent(new CustomEvent('locationUpdated', { 
            detail: location 
          }));
        }
      },
      (error) => {
        setLocationError('Unable to track your location');
        console.error('Geolocation error:', error);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 1000,
        timeout: 5000
      }
    );

    setWatchId(id);
    setWatching(true);
  }, [shareSession]);

  const stopWatchingLocation = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatching(false);
      setWatchId(null);
    }
  }, [watchId]);

  const startSharingLocation = useCallback((duration = 60 * 60 * 1000) => {
    if (!userLocation) {
      alert('Please enable location tracking first');
      return false;
    }
    
    const sessionId = Math.random().toString(36).substring(2, 15);
    setShareSession({
      id: sessionId,
      startedAt: Date.now(),
      expiresAt: Date.now() + duration
    });
    
    // Start watching location if not already
    if (!watching) {
      startWatchingLocation();
    }
    
    return sessionId;
  }, [userLocation, watching, startWatchingLocation]);

  const stopSharingLocation = useCallback(() => {
    setShareSession(null);
    
    // If no other reason to watch location, stop it
    if (watching) {
      stopWatchingLocation();
    }
  }, [watching, stopWatchingLocation]);

  return {
    userLocation,
    locationError,
    watching,
    shareSession,
    getUserLocation,
    startWatchingLocation,
    stopWatchingLocation,
    startSharingLocation,
    stopSharingLocation
  };
};