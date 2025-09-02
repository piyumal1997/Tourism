import { useState } from 'react'

const LocationCategories = ({ filterMarkers }) => {
  const [activeCategory, setActiveCategory] = useState('all')

  const handleFilter = (category) => {
    setActiveCategory(category)
    filterMarkers(category)
  }

  const getButtonClass = (category) => {
    const baseClass = "px-4 py-2 rounded-full"
    if (category === activeCategory) {
      return `${baseClass} bg-emerald-600 text-white`
    }

    const colorClasses = {
      all: "bg-emerald-100 text-emerald-800",
      beach: "bg-blue-100 text-blue-800",
      cultural: "bg-yellow-100 text-yellow-800",
      wildlife: "bg-green-100 text-green-800",
      adventure: "bg-purple-100 text-purple-800"
    }

    return `${baseClass} ${colorClasses[category]} hover:${colorClasses[category].replace('100', '200')}`
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg p-2">
      <div className="flex space-x-2 overflow-x-auto py-1 max-w-[90vw]">
        <button className={getButtonClass('all')} onClick={() => handleFilter('all')}>
          <i className="fas fa-globe mr-2"></i>All
        </button>
        <button className={getButtonClass('beach')} onClick={() => handleFilter('beach')}>
          <i className="fas fa-umbrella-beach mr-2"></i>Beaches
        </button>
        <button className={getButtonClass('cultural')} onClick={() => handleFilter('cultural')}>
          <i className="fas fa-landmark mr-2"></i>Cultural
        </button>
        <button className={getButtonClass('wildlife')} onClick={() => handleFilter('wildlife')}>
          <i className="fas fa-paw mr-2"></i>Wildlife
        </button>
        <button className={getButtonClass('adventure')} onClick={() => handleFilter('adventure')}>
          <i className="fas fa-hiking mr-2"></i>Adventure
        </button>
      </div>
    </div>
  )
}

export default LocationCategories