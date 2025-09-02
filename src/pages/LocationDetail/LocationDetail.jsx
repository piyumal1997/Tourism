import { useParams, Link } from 'react-router-dom';
import { locations } from '../../utils/constants';

const LocationDetail = () => {
  const { id } = useParams();
  const location = locations.find(loc => loc.id === parseInt(id));

  if (!location) {
    return (
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Location Not Found</h1>
          <p className="text-gray-600 mb-8">The location you're looking for doesn't exist.</p>
          <Link to="/destinations" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition duration-300">
            Back to Destinations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96">
        <img src={location.image} alt={location.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{location.title}</h1>
            <p className="text-xl flex items-center">
              <i className="fas fa-map-marker-alt mr-2"></i>
              {location.location}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">About {location.title}</h2>
              <p className="text-gray-700 mb-6">{location.description}</p>
              
              <h3 className="text-2xl font-bold mb-4">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {location.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check-circle text-emerald-600 mr-2"></i>
                    {highlight}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-bold mb-4">Location</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-8">
                <p className="mb-2"><span className="font-semibold">District:</span> {location.district}</p>
                <p className="mb-2"><span className="font-semibold">Best Time to Visit:</span> {location.bestTime}</p>
                <p><span className="font-semibold">Entry Fee:</span> {location.entryFee}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <span className="text-gray-600">({location.reviews} reviews)</span>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300">
                    <i className="fas fa-directions mr-2"></i>Get Directions
                  </button>
                  <button className="w-full border border-emerald-600 text-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition duration-300">
                    <i className="fas fa-bookmark mr-2"></i>Save to Itinerary
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                    <i className="fas fa-share-alt mr-2"></i>Share
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">{location.category}</span>
                    {location.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{highlight}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations
              .filter(loc => loc.category === location.category && loc.id !== location.id)
              .slice(0, 3)
              .map(relatedLocation => (
                <div key={relatedLocation.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <img src={relatedLocation.image} alt={relatedLocation.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{relatedLocation.title}</h3>
                    <p className="text-gray-600 mb-4">{relatedLocation.location}</p>
                    <Link 
                      to={`/location/${relatedLocation.id}`} 
                      className="text-emerald-600 font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LocationDetail;