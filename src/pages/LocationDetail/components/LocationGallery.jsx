import { useState } from 'react';

const LocationGallery = ({ location }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // For demonstration, using the same image multiple times
  // In a real app, you would have multiple images for each location
  const images = [
    location.image,
    "https://images.unsplash.com/photo-1580548254596-1efd73b35e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1559481758-c6fa43c8da54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  return (
    <div className="relative h-96">
      <img 
        src={images[selectedImage]} 
        alt={location.title}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
        <h1 className="text-3xl font-bold">{location.title}</h1>
        <p className="flex items-center">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {location.location}
        </p>
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-3 h-3 rounded-full ${
              selectedImage === index ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationGallery;