import { useState, useEffect } from 'react';
import { ArrowRightLeft, Star, StarOff } from 'lucide-react';
import { useAppContext } from '../App';
import axios from 'axios';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);

  const { favorites, addToFavorites, removeFromFavorites, addRecentConversion } = useAppContext();

  const currencies = [
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
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' }
  ];

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      const result = (amount * exchangeRate).toFixed(2);
      setConvertedAmount(result);
      
      // Add to recent conversions
      addRecentConversion({
        amount,
        fromCurrency,
        toCurrency,
        result,
        rate: exchangeRate,
        timestamp: new Date().toISOString()
      });
    }
  }, [amount, exchangeRate]);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      setExchangeRate(response.data.rates[toCurrency]);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const isFavorite = (currency) => favorites.includes(currency);

  const toggleFavorite = (currency) => {
    if (isFavorite(currency)) {
      removeFromFavorites(currency);
    } else {
      addToFavorites(currency);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Currency Converter</h2>
        <p className="card-subtitle">Convert between different currencies in real-time</p>
      </div>

      <div className="form-group">
        <label className="form-label">Amount</label>
        <input
          type="number"
          className="form-input"
          value={amount}
          onChange={handleAmountChange}
          min="0"
          step="0.01"
        />
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="form-label">From</label>
            <button
              onClick={() => toggleFavorite(fromCurrency)}
              className="btn btn-icon btn-secondary"
              style={{ padding: '0.25rem' }}
            >
              {isFavorite(fromCurrency) ? (
                <Star size={14} fill="currentColor" />
              ) : (
                <StarOff size={14} />
              )}
            </button>
          </div>
          <select
            className="form-select"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="form-label">To</label>
            <button
              onClick={() => toggleFavorite(toCurrency)}
              className="btn btn-icon btn-secondary"
              style={{ padding: '0.25rem' }}
            >
              {isFavorite(toCurrency) ? (
                <Star size={14} fill="currentColor" />
              ) : (
                <StarOff size={14} />
              )}
            </button>
          </div>
          <select
            className="form-select"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button onClick={swapCurrencies} className="btn btn-secondary">
          <ArrowRightLeft size={16} />
          Swap
        </button>
      </div>

      {loading ? (
        <div className="loading">Converting...</div>
      ) : (
        <div className="result-card">
          <div className="result-amount">
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </div>
          {exchangeRate && (
            <div className="result-rate">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;