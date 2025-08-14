// src/App.jsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const navigate = useNavigate();
  const location = useLocation();

  // 다른 탭/창에서 로그인/로그아웃해도 반영되도록
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('access_token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token'); // 쓰고 있다면 같이 제거
    setToken(null);
    navigate('/login', { replace: true, state: { from: location.pathname } });
  }, [navigate, location.pathname]);

  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/">Notes</Link>

        {token ? (
          <>
            <Link to="/notes/new">New</Link>
            <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <Outlet /> {/* 자식 라우트가 여기 렌더링됩니다 */}
    </div>
  );
}
