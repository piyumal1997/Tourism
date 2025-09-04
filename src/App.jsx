import { LocationProvider } from "./contexts/LocationContext";
import Router from "./router/Router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import React from "react";

function App() {
  return (
    <ErrorBoundary>
      <LocationProvider>
        <div className="bg-gray-50 font-sans">
          <Router />
        </div>
      </LocationProvider>
    </ErrorBoundary>
  );
}

export default App;
