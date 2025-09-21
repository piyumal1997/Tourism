import { Link, useLocation } from 'react-router-dom';
import MobileMenu from '../MobileMenu/MobileMenu';
import { useMobileMenu } from '../../../hooks/useMobileMenu';

const Header = () => {
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useMobileMenu();
  const location = useLocation();
  const isFullScreenMap = location.pathname === '/destinations/map';

  // Don't render header on full-screen map page
  if (isFullScreenMap) {
    return null;
  }

  // Check if current path is under destinations
  const isDestinationsActive = location.pathname.startsWith('/destinations');

  // Contact information
  const CONTACT_INFO = {
    phone: "+94 112 345 678",
    email: "info@exploresrilanka.lk",
    social: [
      { platform: "facebook-f", url: "#" },
      { platform: "instagram", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "youtube", url: "#" }
    ]
  };

  // Navigation links with dropdown
  const NAV_LINKS = [
    { path: "/", label: "Home" },
    { 
      path: "/destinations", 
      label: "Destinations",
      dropdown: true,
      dropdownItems: [
        { path: "/destinations/map", label: "Interactive Map" },
        { path: "/destinations/route-planner", label: "Route Planner" }
      ]
    },
    { path: "/experiences", label: "Experiences" },
    { path: "/travel-tips", label: "Travel Tips" }
  ];

  // Reusable component for contact information items
  const ContactItem = ({ icon, href, text }) => (
    <span className="flex items-center">
      <i className={`fas ${icon} mr-2`} aria-hidden="true" />
      <a href={href} className="hover:text-white transition-colors">{text}</a>
    </span>
  );

  // Reusable social media link component
  const SocialLink = ({ platform, url }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-emerald-400"
      aria-label={`Visit our ${platform} page`}
    >
      <i className={`fab fa-${platform}`} aria-hidden="true" />
    </a>
  );

  return (
    <>
      {/* Top contact bar with phone/email and social links */}
      <div className="bg-gray-900 text-gray-300 py-3 text-sm" role="complementary">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex space-x-6">
            <ContactItem icon="fa-phone" href={`tel:${CONTACT_INFO.phone}`} text={CONTACT_INFO.phone} />
            <ContactItem icon="fa-envelope" href={`mailto:${CONTACT_INFO.email}`} text={CONTACT_INFO.email} />
          </div>
          
          <div className="flex space-x-4">
            {CONTACT_INFO.social.map(({ platform, url }) => (
              <SocialLink key={platform} platform={platform} url={url} />
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <i className="fas fa-map-marked-alt text-2xl text-emerald-600"></i>
            <h1 className="text-2xl font-bold text-gray-800">Explore <span className="text-emerald-600">Sri Lanka</span></h1>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(({ path, label, dropdown, dropdownItems }) => (
              <div key={path} className="relative group">
                <Link
                  to={path}
                  className={`${location.pathname === path ? 'text-emerald-600' : 'text-gray-700'} hover:text-emerald-600 font-medium`}
                >
                  {label}
                </Link>
                
                {dropdown && (
                  <div className="absolute hidden group-hover:block bg-white shadow-xl w-48 left-0 p-4 rounded-md">
                    <ul className="space-y-3">
                      {dropdownItems.map((item) => (
                        <li key={item.path}>
                          <Link 
                            to={item.path} 
                            className={`text-gray-600 hover:text-emerald-600 block ${
                              location.pathname === item.path ? 'text-emerald-600 font-medium' : ''
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <button onClick={openMobileMenu} className="md:hidden text-gray-700">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </header>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
        currentPath={location.pathname}
        navLinks={NAV_LINKS}
      />
    </>
  );
};

export default Header;