import React, { useState } from 'react';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';

const RoutePlanner = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!fromLocation || !toLocation) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        from: fromLocation,
        to: toLocation,
        options: [
          {
            type: 'Flight',
            duration: '1h 15m',
            price: '$120-$180',
            details: 'Direct flights available',
            providers: ['Airline A', 'Airline B']
          },
          {
            type: 'Train',
            duration: '3h 30m',
            price: '$35-$50',
            details: 'Scenic route through mountains',
            providers: ['Railway Company']
          },
          {
            type: 'Bus',
            duration: '4h 15m',
            price: '$20-$30',
            details: 'Economy and luxury options',
            providers: ['Bus Company A', 'Bus Company B']
          },
          {
            type: 'Car',
            duration: '3h 45m',
            price: '$45-$60 (fuel)',
            details: 'Flexible timing, toll roads available',
            providers: ['Rental Company A', 'Rental Company B']
          }
        ]
      };
      
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col pt-10">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Discover How to Get Anywhere</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="text"
                  placeholder="Starting location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  placeholder="Destination"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date (Optional)</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !fromLocation || !toLocation}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Finding Routes...
                </>
              ) : (
                'Find Routes'
              )}
            </button>
          </form>
          
          {/* Results */}
          {results && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Travel Options from {results.from} to {results.to}</h2>
              
              <div className="space-y-4">
                {results.options.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{option.type}</h3>
                      <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-sm font-medium">
                        {option.price}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        <i className="fas fa-clock mr-2"></i>
                        {option.duration}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {option.details}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Available with: </span>
                      {option.providers.map((provider, i) => (
                        <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                          {provider}
                        </span>
                      ))}
                    </div>
                    
                    <button className="mt-3 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm hover:bg-emerald-700 transition">
                      View Details & Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {!results && !loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <i className="fas fa-route text-4xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Find the Best Way to Travel</h2>
              <p className="text-gray-500">Enter your starting location and destination to see all available travel options.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoutePlanner;