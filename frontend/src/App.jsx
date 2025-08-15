import './styles/all.css';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('access_token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    navigate('/login', { replace: true, state: { from: location.pathname } });
  }, [navigate, location.pathname]);

  return (
    <div>
      <nav className="app-nav">
        <Link className="nav-link" to="/">Title</Link>

        {token ? (
          <>
            <Link className="nav-link" to="/notes/new">New</Link>
            <div className="spacer" />
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="spacer" />
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  );
}
