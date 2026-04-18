const Hero = () => {
  return (
    <section className="relative h-96 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="container mx-auto px-4 z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover Sri Lanka's Hidden Gems</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">From pristine beaches to ancient temples, explore the wonders of this island paradise</p>
        <div className="relative max-w-md mx-auto">
          <input type="text" placeholder="Search destinations..." className="bg-white w-full py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"/>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition">
          <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero