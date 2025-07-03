import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Signup.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/accounts/signup/', { username, password });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>회원가입</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" required />
      <button type="submit">가입하기</button>
    </form>
  );
}
