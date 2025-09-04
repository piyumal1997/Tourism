import { LocationProvider } from './contexts/LocationContext';
import Router from './router/AppRouter';
import React from 'react';

function App() {
  return (
    <LocationProvider>
        <div className="bg-gray-50 font-sans">
          <Router />
        </div>
    </LocationProvider>
  );
}

export default App;