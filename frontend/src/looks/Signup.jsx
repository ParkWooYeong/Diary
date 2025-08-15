// src/looks/Signup.jsx (예시)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Login.css'; // 같은 스타일 재사용

export default function Signup(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await API.post('/accounts/signup/', { username, password });
    navigate('/login');
  };

  return (
    <div className="page-center">
      <form className="login-form glass-card" onSubmit={onSubmit}>
        <h2>Sign Up</h2>
        <div className="input-group">
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="아이디" required />
        </div>
        <div className="input-group">
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" required />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
