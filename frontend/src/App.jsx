// src/App.jsx
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Notes</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/signup">Signup</Link>
      </nav>
      <Outlet />  {/* 페이지 컴포넌트가 이 자리에 렌더됩니다 */}
    </div>
  );
}
