import { Link, useLocation } from 'react-router-dom';
import MobileMenu from '../MobileMenu/MobileMenu';
import { useMobileMenu } from '../../../hooks/useMobileMenu';

const Header = () => {
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useMobileMenu();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <i className="fas fa-map-marked-alt text-2xl text-emerald-600"></i>
            <h1 className="text-2xl font-bold text-gray-800">Explore <span className="text-emerald-600">Sri Lanka</span></h1>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-700'} hover:text-emerald-600 font-medium`}>Home</Link>
            <Link to="/destinations" className={`${location.pathname === '/destinations' ? 'text-emerald-600' : 'text-gray-700'} hover:text-emerald-600 font-medium`}>Destinations</Link>
            <Link to="/experiences" className={`${location.pathname === '/experiences' ? 'text-emerald-600' : 'text-gray-700'} hover:text-emerald-600 font-medium`}>Experiences</Link>
            <Link to="/travel-tips" className={`${location.pathname === '/travel-tips' ? 'text-emerald-600' : 'text-gray-700'} hover:text-emerald-600 font-medium`}>Travel Tips</Link>
          </nav>
          <button onClick={openMobileMenu} className="md:hidden text-gray-700">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </header>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} currentPath={location.pathname} />
    </>
  );
};

export default Header;