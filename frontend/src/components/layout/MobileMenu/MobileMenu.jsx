import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, currentPath }) => {
  // Function to handle navigation and close menu
  const handleNavigation = () => {
    onClose();
  };

  return (
    <>
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-4">
            <i className="fas fa-map-marked-alt text-2xl text-emerald-600"></i>
            <h1 className="text-xl font-bold text-gray-800">Explore Sri Lanka</h1>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <nav className="p-4">
          <Link 
            to="/" 
            className={`block py-3 font-medium border-b ${currentPath === '/' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            onClick={handleNavigation}
          >
            Home
          </Link>
          <Link 
            to="/destinations" 
            className={`block py-3 font-medium border-b ${currentPath.startsWith('/destinations') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            onClick={handleNavigation}
          >
            Destinations
          </Link>
          <Link 
            to="/destinations/map" 
            className={`block py-3 font-medium border-b pl-4 ${currentPath === '/destinations/map' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            onClick={handleNavigation}
          >
            Interactive Map
          </Link>
          <Link 
            to="/destinations/route-planner" 
            className={`block py-3 font-medium border-b pl-4 ${currentPath === '/destinations/route-planner' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            onClick={handleNavigation}
          >
            Route Planner
          </Link>
          <Link 
            to="/experiences" 
            className={`block py-3 font-medium border-b ${currentPath === '/experiences' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            onClick={handleNavigation}
          >
            Experiences
          </Link>
          <Link 
            to="/travel-tips" 
            className={`block py-3 font-medium border-b ${currentPath === '/travel-tips' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            onClick={handleNavigation}
          >
            Travel Tips
          </Link>
        </nav>
      </div>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
    </>
  );
};

export default MobileMenu;