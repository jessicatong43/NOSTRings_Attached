import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const current = (path) => {
    if (path === location.pathname) {
      return true;
    }
    return false;
  };

  return (
    <header>
      <nav className="nav-bar">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={current('/')
              ? 'current-btn'
              : ''}
          >
            Explore
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={current('/dashboard')
              ? 'current-btn'
              : ''}
          >
            Dashboard
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className={current('/profile')
            ? 'current-btn'
            : ''}
        >
          Profile
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
