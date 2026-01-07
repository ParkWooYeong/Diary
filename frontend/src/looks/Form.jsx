import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Form.css';

export default function Form() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false); // AI 분석 로딩 상태 추가
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

    setLoading(true); // 로딩 시작 (AI 분석 및 이미지 생성 대기)

    try {
      if (isEdit) {
        await API.put(`/notes/${id}/`, { title, content });
      } else {
        // 백엔드에서 제미나이가 분석을 마칠 때까지 여기서 기다립니다 (약 5~10초)
        await API.post('/notes/', { title, content });
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data || err.message);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="form-container glass-card">
        <h2>{isEdit ? '일기 수정' : '오늘의 일기'}</h2>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목 제목"
          required
          autoComplete="off"
          disabled={loading} // 로딩 중에는 입력 방지
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={12}
          placeholder="오늘의 내용"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="loading-text">✨ AI가 일기를 읽고 그림을 그리는 중...</span>
          ) : (
            isEdit ? '수정' : '일기 저장'
          )}
        </button>
        
        {loading && (
          <p className="ai-notice" style={{ color: '#fff', fontSize: '0.8rem', marginTop: '10px' }}>
            ※ AI 분석 및 이미지 생성에는 약 10초 정도 소요될 수 있습니다.
          </p>
        )}
      </form>
    </div>
  );
}