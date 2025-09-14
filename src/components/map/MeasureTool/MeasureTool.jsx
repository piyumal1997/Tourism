import { useEffect } from 'react';

const MeasureTool = ({ points, onClear, onFinish }) => {
  const calculateTotalDistance = () => {
    if (points.length < 2) return 0;
    
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += calculateDistance(
        points[i-1].lat, points[i-1].lng,
        points[i].lat, points[i].lng
      );
    }
    
    return total.toFixed(2);
  };

  // Simple distance calculation (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  return (
    <div className="measurement-tool">
      <h3 className="font-bold mb-2">Measure Distance</h3>
      
      <div className="measurement-points">
        {points.map((point, index) => (
          <div key={index} className="text-sm">
            Point {index + 1}: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
          </div>
        ))}
      </div>
      
      {points.length >= 2 && (
        <div className="font-bold mt-2">
          Total Distance: {calculateTotalDistance()} km
        </div>
      )}
      
      <div className="flex mt-3">
        <button 
          onClick={onClear}
          className="flex-1 bg-gray-500 text-white py-1 px-3 rounded-md"
          disabled={points.length === 0}
        >
          Clear
        </button>
        <button 
          onClick={onFinish}
          className="flex-1 bg-blue-500 text-white py-1 px-3 rounded-md ml-2"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default MeasureTool;