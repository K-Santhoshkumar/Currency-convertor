import { Clock, Trash2 } from 'lucide-react';
import { useAppContext } from '../App';
import { formatDistanceToNow } from 'date-fns';

const RecentConversions = () => {
  const { recentConversions } = useAppContext();

  if (recentConversions.length === 0) {
    return (
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={20} />
            Recent Conversions
          </h3>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <Clock size={32} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No recent conversions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Clock size={20} />
          Recent Conversions
        </h3>
      </div>
      
      <div>
        {recentConversions.slice(0, 5).map((conversion, index) => (
          <div key={index} className="recent-item">
            <div>
              <div className="recent-conversion">
                {conversion.amount} {conversion.fromCurrency} → {conversion.result} {conversion.toCurrency}
              </div>
              <div className="recent-time">
                {formatDistanceToNow(new Date(conversion.timestamp), { addSuffix: true })}
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Rate: {conversion.rate.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentConversions;