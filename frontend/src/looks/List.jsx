import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../styles/List.css';

export default function List() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/notes/')      // 백엔드 노트 리스트 엔드포인트
      .then(res => setNotes(res.data))
      .catch(() => navigate('/login')); // 인증 안 됐으면 로그인으로
  }, [navigate]);

  return (
    <div className="list-container">
      <h2>일기 목록</h2>
      <button onClick={() => navigate('/notes/new')}>새 일기 쓰기</button>
      <ul>
        {notes.map(n => (
          <li key={n.id}>
            <Link to={`/notes/${n.id}`}>
              {n.content.slice(0, 20)}…
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
