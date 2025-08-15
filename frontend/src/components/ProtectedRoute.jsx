import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token'); // 로그인 여부 체크
  return token ? children : <Navigate to="/login" replace />;
}
