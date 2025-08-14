// src/components/Form.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Form.css';

export default function Form() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');       // 제목 상태 추가
  const [content, setContent] = useState('');   // 내용 상태
  const navigate = useNavigate();

  // 수정 모드면 기존 데이터 불러오기
  useEffect(() => {
    if (isEdit) {
      API.get(`/notes/${id}/`)
        .then(res => {
          setTitle(res.data.title);       // 제목 초기화
          setContent(res.data.content);   // 내용 초기화
        })
        .catch(() => navigate('/'));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();

    // 필수 값 체크 (폼에서 required지만 추가 안전장치)
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
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{isEdit ? '수정' : '새 게시물 작성'}</h2>

      {/* 제목 입력 */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        required
      />

      {/* 내용 입력 */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={10}
        placeholder="내용을 입력하세요"
        required
      />

      <button type="submit">{isEdit ? '수정' : '작성'}</button>
    </form>
  );
}
