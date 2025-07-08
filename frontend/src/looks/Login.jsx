// src/looks/Login.jsx
import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import API                  from '../api';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await API.post('/accounts/login/', { username, password });
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      alert('로그인 실패: ' + msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <div className="input-group">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="아이디"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
        />
      </div>
      <button type="submit">로그인</button>
    </form>
  );
}
