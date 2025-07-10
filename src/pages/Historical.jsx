import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Historical = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [period, setPeriod] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' }
  ];

  const periods = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '3 Months' },
    { value: '365', label: '1 Year' }
  ];

  useEffect(() => {
    fetchHistoricalData();
  }, [fromCurrency, toCurrency, period]);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate mock historical data since free APIs have limitations
      const data = generateMockHistoricalData(parseInt(period));
      setChartData(data);
    } catch (err) {
      setError('Failed to fetch historical data. Please try again later.');
      console.error('Error fetching historical data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistoricalData = (days) => {
    const data = [];
    const baseRate = getBaseRate(fromCurrency, toCurrency);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
      const rate = baseRate * (1 + fluctuation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: parseFloat(rate.toFixed(4)),
        displayDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return data;
  };

  const getBaseRate = (from, to) => {
    // Mock base rates for demonstration
    const rates = {
      'USD-INR': 83.25,
      'EUR-INR': 89.50,
      'GBP-INR': 104.75,
      'JPY-INR': 0.56,
      'AUD-INR': 54.30,
      'CAD-INR': 61.20,
      'CHF-INR': 92.15,
      'CNY-INR': 11.45,
      'INR-USD': 0.012,
      'INR-EUR': 0.011,
      'INR-GBP': 0.0095,
      'INR-JPY': 1.78,
      'INR-AUD': 0.018,
      'INR-CAD': 0.016,
      'INR-CHF': 0.011,
      'INR-CNY': 0.087
    };
    
    return rates[`${from}-${to}`] || 1;
  };

  const getCurrentRate = () => {
    if (chartData.length > 0) {
      return chartData[chartData.length - 1].rate;
    }
    return 0;
  };

  const getRateChange = () => {
    if (chartData.length < 2) return { change: 0, percentage: 0 };
    
    const current = chartData[chartData.length - 1].rate;
    const previous = chartData[0].rate;
    const change = current - previous;
    const percentage = ((change / previous) * 100);
    
    return { change, percentage };
  };

  const rateChange = getRateChange();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <TrendingUp size={28} />
            Historical Exchange Rates
          </h1>
          <p className="card-subtitle">
            Track currency exchange rate trends over time
          </p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">From Currency</label>
            <select 
              className="form-select"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">To Currency</label>
            <select 
              className="form-select"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Time Period</label>
            <select 
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {periods.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <Calendar className="animate-spin" size={24} />
            <span>Loading historical data...</span>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Current Rate
                </h3>
                <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  {getCurrentRate().toFixed(4)}
                </p>
              </div>
              
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Change
                </h3>
                <p style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: rateChange.change >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {rateChange.change >= 0 ? '+' : ''}{rateChange.change.toFixed(4)}
                </p>
              </div>
              
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Change %
                </h3>
                <p style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: rateChange.percentage >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {rateChange.percentage >= 0 ? '+' : ''}{rateChange.percentage.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    domain={['dataMin - 0.01', 'dataMax + 0.01']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value) => [value.toFixed(4), `${fromCurrency}/${toCurrency}`]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Historical;