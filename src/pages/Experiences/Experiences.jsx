const Experiences = () => {
  const experiences = [
    {
      id: 1,
      title: "Wild Safari Adventure",
      image: "https://images.unsplash.com/photo-1584597743319-8b634bba1f9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Experience the thrill of spotting elephants, leopards, and other wildlife in their natural habitat.",
      duration: "Full day",
      price: "From $50"
    },
    {
      id: 2,
      title: "Tea Plantation Tour",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Visit lush tea plantations, learn about tea processing, and enjoy a fresh cup of Ceylon tea.",
      duration: "Half day",
      price: "From $25"
    },
    {
      id: 3,
      title: "Cultural Dance Show",
      image: "https://images.unsplash.com/photo-1592389109653-ccbc5d7c5944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Enjoy traditional Sri Lankan dance performances showcasing the island's rich cultural heritage.",
      duration: "2 hours",
      price: "From $15"
    },
    {
      id: 4,
      title: "Surfing Lessons",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Catch the waves with professional instructors at some of the best surf spots in Sri Lanka.",
      duration: "2 hours",
      price: "From $30"
    },
    {
      id: 5,
      title: "Ayurvedic Spa Treatment",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Relax and rejuvenate with traditional Ayurvedic treatments and massages.",
      duration: "2-4 hours",
      price: "From $40"
    },
    {
      id: 6,
      title: "Cooking Class",
      image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Learn to cook authentic Sri Lankan dishes with local chefs and take home delicious recipes.",
      duration: "3 hours",
      price: "From $35"
    }
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Unique Experiences</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Discover unforgettable activities and experiences across Sri Lanka</p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map(experience => (
              <div key={experience.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <img src={experience.image} alt={experience.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{experience.title}</h3>
                  <p className="text-gray-600 mb-4">{experience.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{experience.duration}</span>
                    <span className="text-emerald-600 font-bold">{experience.price}</span>
                  </div>
                  <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Experiences;