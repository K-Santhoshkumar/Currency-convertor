import { useState, useEffect } from 'react';
import { Star, Trash2, Plus } from 'lucide-react';
import { useAppContext } from '../App';
import axios from 'axios';

const Favorites = () => {
  const { favorites, addToFavorites, removeFromFavorites } = useAppContext();
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCurrency, setNewCurrency] = useState('');

  const allCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' }
  ];

  useEffect(() => {
    fetchFavoriteRates();
  }, [favorites]);

  const fetchFavoriteRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = () => {
    if (newCurrency && !favorites.includes(newCurrency)) {
      addToFavorites(newCurrency);
      setNewCurrency('');
    }
  };

  const getCurrencyInfo = (code) => {
    return allCurrencies.find(curr => curr.code === code) || 
           { code, name: code, flag: '💱' };
  };

  const formatRate = (rate) => {
    if (rate < 0.01) {
      return rate.toFixed(6);
    } else if (rate < 1) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(2);
    }
  };

  const availableCurrencies = allCurrencies.filter(
    curr => !favorites.includes(curr.code)
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Star size={28} />
            Favorite Currencies
          </h1>
          <p className="card-subtitle">
            Track your most important currency pairs
          </p>
        </div>

        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Add New Favorite</label>
            <select 
              className="form-select"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
            >
              <option value="">Select a currency</option>
              {availableCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button 
              onClick={handleAddFavorite}
              disabled={!newCurrency}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              Add to Favorites
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <Star className="animate-spin" size={24} />
            <span>Loading favorite rates...</span>
          </div>
        ) : (
          <div className="grid grid-2">
            {favorites.map(currencyCode => {
              const currencyInfo = getCurrencyInfo(currencyCode);
              const rate = rates[currencyCode];
              
              return (
                <div key={currencyCode} className="rate-item">
                  <div className="rate-info">
                    <div className="currency-flag">
                      {currencyInfo.flag}
                    </div>
                    <div className="currency-details">
                      <h3>{currencyInfo.code}</h3>
                      <p>{currencyInfo.name}</p>
                    </div>
                  </div>
                  <div className="rate-value">
                    <div className="rate-amount">
                      {rate ? formatRate(rate) : 'N/A'} USD
                    </div>
                    <button
                      onClick={() => removeFromFavorites(currencyCode)}
                      className="btn btn-icon btn-secondary"
                      style={{ marginTop: '0.5rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {favorites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <Star size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No favorite currencies yet. Add some currencies to track their rates!</p>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div className="grid grid-3">
          <button 
            onClick={() => addToFavorites('BTC')}
            className="btn btn-secondary"
            disabled={favorites.includes('BTC')}
          >
            Add Bitcoin
          </button>
          <button 
            onClick={() => addToFavorites('ETH')}
            className="btn btn-secondary"
            disabled={favorites.includes('ETH')}
          >
            Add Ethereum
          </button>
          <button 
            onClick={fetchFavoriteRates}
            className="btn btn-primary"
          >
            Refresh Rates
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;