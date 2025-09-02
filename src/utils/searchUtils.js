export const filterLocations = (locations, searchTerm, filters) => {
  return locations.filter(location => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filters.category === 'all' || location.category === filters.category;
    
    // District filter
    const matchesDistrict = filters.district === 'all' || location.district === filters.district;
    
    // Best time filter
    const matchesBestTime = filters.bestTime === 'all' || location.bestTime === filters.bestTime;
    
    // Entry fee filter
    const matchesEntryFee = filters.entryFee === 'all' || 
      (filters.entryFee === 'free' && location.entryFee.toLowerCase().includes('free')) ||
      (filters.entryFee === 'paid' && !location.entryFee.toLowerCase().includes('free'));
    
    // Highlights filter
    const matchesHighlights = filters.highlights.length === 0 || 
      filters.highlights.some(highlight => location.highlights.includes(highlight));
    
    return matchesSearch && matchesCategory && matchesDistrict && 
           matchesBestTime && matchesEntryFee && matchesHighlights;
  });
};

export const searchLocations = (locations, searchTerm) => {
  if (!searchTerm) return locations;
  
  const searchTermLower = searchTerm.toLowerCase();
  
  return locations.filter(location => 
    location.title.toLowerCase().includes(searchTermLower) ||
    location.location.toLowerCase().includes(searchTermLower) ||
    location.description.toLowerCase().includes(searchTermLower) ||
    location.highlights.some(highlight => 
      highlight.toLowerCase().includes(searchTermLower)
    )
  );
};