// src/components/Form.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Form.css';

export default function Form() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      API.get(`/notes/${id}/`)
        .then(res => {
          setTitle(res.data.title || '');
          setContent(res.data.content || '');
        })
        .catch(() => navigate('/'));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      if (isEdit) {
        await API.put(`/notes/${id}/`, { title, content });
      } else {
        await API.post('/notes/', { title, content });
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data || err.message);
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="form-container glass-card">
        <h2>{isEdit ? '수정' : '새 게시물 작성'}</h2>

        {/* 제목 */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
          autoComplete="off"
        />

        {/* 내용 */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={12}
          placeholder="내용을 입력하세요"
          required
        />

        <button type="submit">{isEdit ? '수정' : '작성'}</button>
      </form>
    </div>
  );
}
