const TravelTips = () => {
  const travelTips = [
    {
      id: 1,
      title: "Best Time to Visit",
      content: "The best time to visit Sri Lanka depends on the region. The west and south coasts are best from November to April, while the east coast is best from April to September.",
      icon: "fas fa-calendar-alt"
    },
    {
      id: 2,
      title: "Visa Requirements",
      content: "Most travelers need an Electronic Travel Authorization (ETA) to enter Sri Lanka. Apply online before your trip.",
      icon: "fas fa-passport"
    },
    {
      id: 3,
      title: "Currency",
      content: "The local currency is the Sri Lankan Rupee (LKR). Credit cards are widely accepted in cities, but carry cash for rural areas.",
      icon: "fas fa-money-bill-wave"
    },
    {
      id: 4,
      title: "Transportation",
      content: "Use trains for scenic journeys, buses for budget travel, and tuk-tuks for short distances. Consider hiring a driver for longer trips.",
      icon: "fas fa-bus"
    },
    {
      id: 5,
      title: "Cultural Etiquette",
      content: "Dress modestly when visiting temples. Remove shoes and hats before entering religious sites.",
      icon: "fas fa-hands"
    },
    {
      id: 6,
      title: "Health & Safety",
      content: "Drink bottled water. Use mosquito repellent. Sri Lanka is generally safe, but take normal travel precautions.",
      icon: "fas fa-first-aid"
    }
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Tips & Guides</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Essential information to help you plan your perfect trip to Sri Lanka</p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelTips.map(tip => (
              <div key={tip.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <i className={`${tip.icon} text-emerald-600 text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Need More Information?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <i className="fas fa-book-open text-4xl text-emerald-600 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Travel Guides</h3>
              <p className="text-gray-600 mb-4">Comprehensive guides for different regions of Sri Lanka.</p>
              <button className="text-emerald-600 font-semibold hover:underline">Read Guides</button>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <i className="fas fa-map-marked-alt text-4xl text-emerald-600 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Itineraries</h3>
              <p className="text-gray-600 mb-4">Plan your trip with our suggested itineraries.</p>
              <button className="text-emerald-600 font-semibold hover:underline">View Itineraries</button>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <i className="fas fa-question-circle text-4xl text-emerald-600 mb-4"></i>
              <h3 className="text-xl font-bold mb-2">FAQs</h3>
              <p className="text-gray-600 mb-4">Find answers to frequently asked questions.</p>
              <button className="text-emerald-600 font-semibold hover:underline">View FAQs</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TravelTips;