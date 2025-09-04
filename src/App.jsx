import { LocationProvider } from './contexts/LocationContext';
import AppRouter from './router/AppRouter';
import React from 'react';

function App() {
  return (
    <LocationProvider>
        <div className="bg-gray-50 font-sans">
          <AppRouter />
        </div>
    </LocationProvider>
  );
}

export default App;