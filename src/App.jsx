import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import INRRates from './pages/INRRates';
import Historical from './pages/Historical';
import Favorites from './pages/Favorites';
import './App.css';

// Create context for global state
const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('currency-favorites');
    return saved ? JSON.parse(saved) : ['USD', 'EUR', 'GBP', 'JPY'];
  });

  const [recentConversions, setRecentConversions] = useState(() => {
    const saved = localStorage.getItem('recent-conversions');
    return saved ? JSON.parse(saved) : [];
  });

  const addToFavorites = (currency) => {
    if (!favorites.includes(currency)) {
      const newFavorites = [...favorites, currency];
      setFavorites(newFavorites);
      localStorage.setItem('currency-favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (currency) => {
    const newFavorites = favorites.filter(fav => fav !== currency);
    setFavorites(newFavorites);
    localStorage.setItem('currency-favorites', JSON.stringify(newFavorites));
  };

  const addRecentConversion = (conversion) => {
    const newRecent = [conversion, ...recentConversions.slice(0, 9)];
    setRecentConversions(newRecent);
    localStorage.setItem('recent-conversions', JSON.stringify(newRecent));
  };

  const contextValue = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    recentConversions,
    addRecentConversion
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inr-rates" element={<INRRates />} />
              <Route path="/historical" element={<Historical />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;