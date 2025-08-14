import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token'); // 토큰 확인
  if (!token) {
    return <Navigate to="/login" />; // 없으면 로그인 화면으로 이동
  }
  return children; // 있으면 화면 그대로
}