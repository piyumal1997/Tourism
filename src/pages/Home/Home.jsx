
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Sri Lanka</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Explore the beautiful landscapes, rich culture, and amazing adventures that Sri Lanka has to offer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/destinations" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition duration-300">
              Explore Destinations
            </Link>
            <Link to="/experiences" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-emerald-600 transition duration-300">
              Find Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Visit Sri Lanka?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-umbrella-beach text-2xl text-emerald-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pristine Beaches</h3>
              <p className="text-gray-600">Discover stunning beaches with golden sands and crystal clear waters.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mountain text-2xl text-emerald-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Majestic Mountains</h3>
              <p className="text-gray-600">Explore lush green mountains and breathtaking landscapes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-history text-2xl text-emerald-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich History</h3>
              <p className="text-gray-600">Immerse yourself in thousands of years of history and culture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80" 
                alt="Sigiriya Rock" 
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Sigiriya Rock Fortress</h3>
                  <p className="mb-4">Ancient rock fortress and UNESCO World Heritage site</p>
                  <Link to="/destinations" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-300">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1564415637253-1a0f44a0e147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Beaches" 
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Pristine Beaches</h3>
                  <p className="mb-4">Golden sands and turquoise waters of Sri Lanka's coast</p>
                  <Link to="/destinations" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-300">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1584597743319-8b634bba1f9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Wildlife" 
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Wildlife Safaris</h3>
                  <p className="mb-4">Experience diverse wildlife in national parks</p>
                  <Link to="/destinations" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-300">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/destinations" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition duration-300">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for an Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Start planning your trip to Sri Lanka today and create memories that will last a lifetime.</p>
          <Link to="/travel-tips" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition duration-300">
            Travel Tips & Guides
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;