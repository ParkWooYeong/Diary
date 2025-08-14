// src/looks/DiaryEntry.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
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
    const now = new Date(entry.created_at || Date.now());
    const el = document.getElementById('current-date');
    if (el) {
      el.textContent = now.toLocaleDateString('ko-KR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    const parchment = document.querySelector('.parchment');
    if (!parchment) return;
    parchment.querySelectorAll('.blood-drop').forEach(n => n.remove());
    for (let i = 0; i < 3; i++) {
      const stain = document.createElement('div');
      stain.className = 'blood-drop';
      stain.style.top = `${10 + Math.random() * 80}%`;
      stain.style.left = `${10 + Math.random() * 80}%`;
      stain.style.opacity = `${0.3 + Math.random() * 0.5}`;
      stain.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
      parchment.appendChild(stain);
    }
  }, [entry]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('정말 삭제할까요?')) return;
    try {
      await API.delete(`/notes/${id}/`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data || err.message);
    }
  }, [id, navigate]);

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
          {entry.content.split('\n').map((p, i) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-yellow-100 rounded"
        >
          뒤로
        </button>

        {/* 작성자 또는 슈퍼계정만 버튼 보임 */}
        {entry.can_edit && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/notes/${id}/edit`)}
              className="px-4 py-2 bg-yellow-900 hover:bg-yellow-800 text-yellow-100 rounded"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-yellow-100 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
