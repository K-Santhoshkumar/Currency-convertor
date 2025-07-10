import { Link, useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <TrendingUp size={24} />
          CurrencyPro
        </Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Converter
            </Link>
          </li>
          <li>
            <Link 
              to="/inr-rates" 
              className={`nav-link ${isActive('/inr-rates') ? 'active' : ''}`}
            >
              INR Rates
            </Link>
          </li>
          <li>
            <Link 
              to="/historical" 
              className={`nav-link ${isActive('/historical') ? 'active' : ''}`}
            >
              Historical
            </Link>
          </li>
          <li>
            <Link 
              to="/favorites" 
              className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
            >
              Favorites
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;