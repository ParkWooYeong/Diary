import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Form.css';

export default function Form() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      API.get(`/notes/${id}/`)    // 백엔드 노트 조회 엔드포인트
        .then(res => setContent(res.data.content))
        .catch(() => navigate('/'));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/notes/${id}/`, { content });
      } else {
        await API.post('/notes/', { content });
      }
      navigate('/');
    } catch (err) {
      alert('오류 발생: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{isEdit ? '일기 수정' : '새 일기 작성'}</h2>
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
