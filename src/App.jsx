import { BrowserRouter as Router } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import AppRouter from './router/AppRouter';
import './App.css';

function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="bg-gray-50 font-sans">
          <AppRouter />
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;