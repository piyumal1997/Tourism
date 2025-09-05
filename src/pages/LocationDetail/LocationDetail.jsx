import { React, lazy, Suspense, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocation } from '../../contexts/LocationContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { locations } from '../../utils/constants';

// Lazy load components
const LocationGallery = lazy(() => import('./components/LocationGallery'));
const LocationInfo = lazy(() => import('./components/LocationInfo'));
const LocationMap = lazy(() => import('./components/LocationMap'));
const NearbyLocations = lazy(() => import('./components/NearbyLocations'));

const LocationDetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedLocation } = useLocation();

  useEffect(() => {
    // Simulate API call
    const fetchLocation = async () => {
      setLoading(true);
      // In a real app, you would fetch from an API
      const foundLocation = locations.find(loc => loc.id === parseInt(id));
      
      setTimeout(() => {
        setLocation(foundLocation);
        setLoading(false);
      }, 500);
    };

    fetchLocation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Location Not Found</h2>
          <p className="mt-2">The location you're looking for doesn't exist.</p>
          <Link to="/destinations" className="mt-4 inline-block text-emerald-500 hover:text-emerald-600">
            ← Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="location-detail-page pt-20">
      <Suspense fallback={<LoadingSpinner />}>
        <LocationGallery location={location} />
      </Suspense>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<LoadingSpinner />}>
              <LocationInfo location={location} />
            </Suspense>
          </div>
          
          <div>
            <Suspense fallback={<LoadingSpinner />}>
              <LocationMap location={location} />
            </Suspense>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Nearby Locations</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <NearbyLocations currentLocation={location} onLocationSelect={setSelectedLocation} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;