import React from 'react';
import { Link } from 'react-router-dom';

const TravelTipsPreview = () => {
  const tips = [
    {
      id: 1,
      title: "Best Time to Visit Sri Lanka",
      excerpt: "Learn about the ideal seasons to visit different regions of Sri Lanka",
      image: "https://images.unsplash.com/photo-1580548254596-1efd73b35e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "Local Customs and Etiquette",
      excerpt: "Understand the cultural norms and practices in Sri Lanka",
      image: "https://images.unsplash.com/photo-1559481758-c6fa43c8da54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "Budget Travel Guide",
      excerpt: "Tips for exploring Sri Lanka without breaking the bank",
      image: "https://images.unsplash.com/photo-1580548254596-1efd73b35e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Travel Tips & Advice</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip) => (
            <div key={tip.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={tip.image} 
                alt={tip.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                <p className="text-gray-600 mb-4">{tip.excerpt}</p>
                <button className="text-emerald-500 hover:text-emerald-600 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/travel-tips"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Travel Tips
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TravelTipsPreview;