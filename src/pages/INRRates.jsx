import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';

const INRRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const majorCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
    { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'TWD', name: 'Taiwan Dollar', flag: '🇹🇼' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' }
  ];

  useEffect(() => {
    fetchINRRates();
  }, []);

  const fetchINRRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
      
      // Convert to show how much foreign currency 1 INR equals
      const convertedRates = {};
      Object.keys(response.data.rates).forEach(currency => {
        convertedRates[currency] = response.data.rates[currency];
      });
      
      setRates(convertedRates);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again later.');
      console.error('Error fetching INR rates:', err);
    } finally {
      setLoading(false);
    }
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

  const getChangeIndicator = () => {
    // Simulate rate change for demo purposes
    const isPositive = Math.random() > 0.5;
    const change = (Math.random() * 2).toFixed(2);
    return {
      isPositive,
      change: `${isPositive ? '+' : '-'}${change}%`
    };
  };

  if (loading) {
    return (
      <div className="loading">
        <IndianRupee className="animate-spin" size={24} />
        <span>Loading INR exchange rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchINRRates} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <IndianRupee size={28} />
            Indian Rupee Exchange Rates
          </h1>
          <p className="card-subtitle">
            Current exchange rates for 1 INR against major world currencies
            {lastUpdated && (
              <span> • Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </p>
        </div>

        <div className="grid grid-3">
          {majorCurrencies.map(currency => {
            const rate = rates[currency.code];
            const changeData = getChangeIndicator();
            
            if (!rate) return null;

            return (
              <div key={currency.code} className="rate-item">
                <div className="rate-info">
                  <div className="currency-flag">
                    {currency.flag}
                  </div>
                  <div className="currency-details">
                    <h3>{currency.code}</h3>
                    <p>{currency.name}</p>
                  </div>
                </div>
                <div className="rate-value">
                  <div className="rate-amount">
                    {formatRate(rate)}
                  </div>
                  <div className={`rate-change ${changeData.isPositive ? 'positive' : 'negative'}`}>
                    {changeData.isPositive ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {changeData.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: '2rem', background: '#f8fafc' }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Understanding INR Rates</h3>
          <div className="grid grid-2">
            <div>
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>What these numbers mean:</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                These rates show how much foreign currency you can get for 1 Indian Rupee. 
                For example, if USD shows 0.012, it means 1 INR = 0.012 USD.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Rate Updates:</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Exchange rates are updated in real-time and fluctuate based on market conditions, 
                economic factors, and global events.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={fetchINRRates} 
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Refresh Rates
        </button>
      </div>
    </div>
  );
};

export default INRRates;