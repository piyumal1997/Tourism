import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const isFullScreenMap = location.pathname === '/destinations/map';

  // Don't render footer on full-screen map page
  if (isFullScreenMap) {
    return null;
  }

  // Reusable contact information
  const CONTACT_INFO = {
    address: "123 Colombo, Sri Lanka",
    phone: "+94 112 345 678",
    email: "info@exploresrilanka.lk"
  };

  // Navigation links configuration (matching the header)
  const NAV_LINKS = [
    { path: "/", label: "Home" },
    { path: "/destinations", label: "Destinations" },
    { path: "/destinations/map", label: "Interactive Map" },
    { path: "/destinations/route-planner", label: "Route Planner" },
    { path: "/experiences", label: "Experiences" },
    { path: "/travel-tips", label: "Travel Tips" }
  ];

  // Social media links
  const SOCIAL_LINKS = [
    { icon: "facebook-f", url: "#" },
    { icon: "instagram", url: "#" },
    { icon: "twitter", url: "#" },
    { icon: "youtube", url: "#" }
  ];

  // Handles smooth scroll to top when on same page
  const handleScrollTop = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Store scroll preference for subsequent navigation
    sessionStorage.setItem("shouldScroll", "true");
  };

  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-map-marked-alt text-2xl text-emerald-400 mr-2"></i>
              Explore Sri Lanka
            </h3>
            <p className="text-gray-400">Discover the beauty, culture, and adventure of Sri Lanka through our comprehensive travel guide.</p>
          </div>

          {/* Navigation links */}
          <nav aria-label="Footer navigation">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={(e) => handleScrollTop(e, path)}
                    className={`text-gray-400 hover:text-white transition ${
                      location.pathname === path ? "text-emerald-400" : ""
                    }`}
                    aria-label={`Navigate to ${label}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt text-emerald-400 mr-3"></i>
                <span className="text-gray-400">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt text-emerald-400 mr-3"></i>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Contact phone number"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-emerald-400 mr-3"></i>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Contact email address"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social media and newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              {SOCIAL_LINKS.map(({ icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition"
                  aria-label={`Follow us on ${icon}`}
                >
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
            
            <h4 className="text-lg font-semibold mb-2">Newsletter</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none w-full"
                aria-label="Email for newsletter subscription"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-r">
                <i className="fas fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} Explore Sri Lanka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;