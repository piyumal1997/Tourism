// utils/tileServerUtils.js

// Alternative tile servers with CORS support
export const TILE_SERVERS = {
  OPENSTREETMAP: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    requiresKey: false
  },
  MAPTILER: {
    name: 'MapTiler',
    url: 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=YOUR_KEY_HERE',
    attribution: '© MapTiler © OpenStreetMap contributors',
    requiresKey: true
  },
  OPENTOPOMAP: {
    name: 'OpenTopoMap',
    url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    requiresKey: false
  },
  OPENFREEMAP: {
    name: 'OpenFreeMap',
    url: 'https://tiles.openfreemap.org/{z}/{x}/{y}.png',
    attribution: '© OpenFreeMap © OpenStreetMap contributors',
    requiresKey: false
  }
};

// Function to get appropriate style configuration
export const getMapStyle = (serverType = 'OPENSTREETMAP', apiKey = '') => {
  switch(serverType) {
    case 'MAPTILER':
      return {
        version: 8,
        sources: {
          'maptiler-tiles': {
            type: 'raster',
            tiles: [TILE_SERVERS.MAPTILER.url.replace('YOUR_KEY_HERE', apiKey)],
            tileSize: 256,
            attribution: TILE_SERVERS.MAPTILER.attribution
          }
        },
        layers: [{
          id: 'maptiler-tiles',
          type: 'raster',
          source: 'maptiler-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      };
    case 'OPENTOPOMAP':
      return {
        version: 8,
        sources: {
          'opentopomap-tiles': {
            type: 'raster',
            tiles: [TILE_SERVERS.OPENTOPOMAP.url],
            tileSize: 256,
            attribution: TILE_SERVERS.OPENTOPOMAP.attribution
          }
        },
        layers: [{
          id: 'opentopomap-tiles',
          type: 'raster',
          source: 'opentopomap-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      };
    case 'OPENFREEMAP':
      return {
        version: 8,
        sources: {
          'openfreemap-tiles': {
            type: 'raster',
            tiles: [TILE_SERVERS.OPENFREEMAP.url],
            tileSize: 256,
            attribution: TILE_SERVERS.OPENFREEMAP.attribution
          }
        },
        layers: [{
          id: 'openfreemap-tiles',
          type: 'raster',
          source: 'openfreemap-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      };
    default:
      return {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [TILE_SERVERS.OPENSTREETMAP.url],
            tileSize: 256,
            attribution: TILE_SERVERS.OPENSTREETMAP.attribution
          }
        },
        layers: [{
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      };
  }
};

// Custom protocol handler for better tile loading control
export const setupCustomProtocol = (mapInstance) => {
  if (!window.maplibregl || !mapInstance) return;

  window.maplibregl.addProtocol('custom', (params, callback) => {
    const url = params.url.replace('custom://', 'https://');
    
    fetch(url, {
      headers: {
        'User-Agent': 'Sri-Lanka-Travel-Guide/1.0 (https://yourdomain.com)',
        'Accept': 'image/webp,image/*,*/*'
      },
      mode: 'cors'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} loading tile`);
      }
      return response.arrayBuffer();
    })
    .then(data => callback(null, data, null, null))
    .catch(error => {
      console.warn('Tile loading error:', error);
      callback(error);
    });
  });
};

// Fallback mechanism for missing tiles 
export const handleMissingTiles = (mapInstance) => {
  if (!mapInstance) return;
  
  mapInstance.on('error', (e) => {
    if (e.error && e.error.status === 404) {
      // Handle 404 errors for missing tiles
      console.log('Tile not found, implementing fallback');
    }
  });
};