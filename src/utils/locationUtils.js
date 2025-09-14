// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Find locations within radius
export const findLocationsWithinRadius = (locations, centerLat, centerLng, radiusKm) => {
  return locations.filter(location => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      location.coordinates.lat,
      location.coordinates.lng
    );
    return distance <= radiusKm;
  });
};

// Generate circle coordinates for radius visualization
export const generateCircleCoordinates = (centerLat, centerLng, radiusKm, points = 72) => {
  const coordinates = [];
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const lat = centerLat + (radiusKm / 111.32) * Math.cos(angle);
    const lng = centerLng + (radiusKm / (111.32 * Math.cos(centerLat * (Math.PI / 180)))) * Math.sin(angle);
    coordinates.push([lng, lat]);
  }
  
  // Close the circle
  coordinates.push(coordinates[0]);
  
  return coordinates;
};