import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './pages/Home/Home';
import Destinations from './pages/Destinations/Destinations';
import Experiences from './pages/Experiences/Experiences';
import TravelTips from './pages/TravelTips/TravelTips';
import LocationDetail from './pages/LocationDetail/LocationDetail';
import { LocationProvider } from './contexts/LocationContext';
import './App.css';

function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="bg-gray-50 font-sans">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/travel-tips" element={<TravelTips />} />
            <Route path="/location/:id" element={<LocationDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;