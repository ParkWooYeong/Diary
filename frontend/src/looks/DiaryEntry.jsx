// src/looks/DiaryEntry.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }     from 'react-router-dom';
import API                            from '../api';
import '../styles/Diary.css';

export default function DiaryEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    API.get(`/notes/${id}/`)
      .then(res => setEntry(res.data))
      .catch(() => navigate('/'));
  }, [id, navigate]);

  useEffect(() => {
    if (!entry) return;
    // 날짜 세팅
    const now = new Date(entry.created_at || Date.now());
    document.getElementById('current-date').textContent =
      now.toLocaleDateString('ko-KR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

    // 블러드 드롭 생성
    const parchment = document.querySelector('.parchment');
    for (let i = 0; i < 3; i++) {
      const stain = document.createElement('div');
      stain.className = 'blood-drop';
      stain.style.top     = `${10 + Math.random() * 80}%`;
      stain.style.left    = `${10 + Math.random() * 80}%`;
      stain.style.opacity = `${0.3 + Math.random() * 0.5}`;
      stain.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
      parchment.appendChild(stain);
    }
  }, [entry]);

  if (!entry) return <p className="text-center mt-8">로딩 중…</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="title-font text-5xl text-yellow-200 mb-4">{entry.title}</h1>
        <div className="mt-6 border-t border-b border-yellow-800 py-2 flex justify-center">
          <div className="mx-4 text-yellow-200 flex items-center">
            <span className="text-red-500 mr-2"><i className="fas fa-circle"></i></span>
            <span id="current-date"></span>
          </div>
        </div>
      </header>

      <div className="parchment p-8 md:p-12 relative overflow-hidden rounded-lg mb-8">
        <div className="page-content text-gray-800 text-lg leading-relaxed">
          {entry.content.split('\n').map((p,i) =>
            <p key={i} className="mb-4">{p}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-yellow-100 rounded"
        >
          뒤로
        </button>
        <button
          onClick={() => navigate(`/notes/${id}/edit`)}  /* 수정 폼으로 이동 */
          className="px-4 py-2 bg-yellow-900 hover:bg-yellow-800 text-yellow-100 rounded"
        >
          수정
        </button>
      </div>
    </div>
  );
}
