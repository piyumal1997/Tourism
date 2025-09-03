const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-map-marked-alt text-2xl text-emerald-400 mr-2"></i>
              Explore Sri Lanka
            </h3>
            <p className="text-left text-gray-400">Discover the beauty, culture, and adventure of Sri Lanka through our comprehensive travel guide.</p>
          </div>
          <div>
            <h4 className="text-left text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="text-left space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Destinations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Travel Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-left text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="text-left space-y-2">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt text-emerald-400 mr-3"></i>
                <span className="text-gray-400">123 Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt text-emerald-400 mr-3"></i>
                <span className="text-gray-400">+94 112 345 678</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-emerald-400 mr-3"></i>
                <span className="text-gray-400">info@exploresrilanka.lk</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-left text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <h4 className="text-left text-lg font-semibold mt-6 mb-2">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none w-full" />
              <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-r">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 Explore Sri Lanka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer