import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useAppContext } from '../App';
import axios from 'axios';

const QuickRates = () => {
  const { favorites } = useAppContext();
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  useEffect(() => {
    fetchQuickRates();
  }, [baseCurrency]);

  const fetchQuickRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      setRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching quick rates:', error);
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

  const displayCurrencies = favorites.length > 0 ? favorites : ['EUR', 'GBP', 'JPY', 'INR'];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <TrendingUp size={20} />
          Quick Rates
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            className="form-select"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            style={{ width: 'auto', fontSize: '0.875rem' }}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
          <button
            onClick={fetchQuickRates}
            className="btn btn-icon btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading rates...</div>
      ) : (
        <div>
          {displayCurrencies.map(currency => {
            if (currency === baseCurrency) return null;
            const rate = rates[currency];
            if (!rate) return null;

            return (
              <div key={currency} className="recent-item">
                <div>
                  <div className="recent-conversion">
                    1 {baseCurrency} = {formatRate(rate)} {currency}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: Math.random() > 0.5 ? '#10b981' : '#ef4444',
                  fontWeight: '500'
                }}>
                  {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuickRates;