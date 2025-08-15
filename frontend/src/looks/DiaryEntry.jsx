import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/Diary.css';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function DiaryEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);

  // 게시글 불러오기
  useEffect(() => {
    API.get(`/notes/${id}/`)
      .then((res) => setEntry(res.data))
      .catch(() => navigate('/'));
  }, [id, navigate]);

  // 날짜 포맷
  const formattedDate = useMemo(() => {
    if (!entry) return '';
    const d = new Date(entry.created_at || Date.now());
    try {
      return d.toLocaleDateString('ko-KR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }, [entry]);

  // 삭제
  const handleDelete = useCallback(async () => {
    if (!window.confirm('정말 삭제할까요?')) return;
    try {
      await API.delete(`/notes/${id}/`);
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.detail || err?.response?.data || err?.message || '삭제 실패');
    }
  }, [id, navigate]);

  if (!entry) {
    return (
      <div className="diary-entry-box" style={{ marginTop: 40 }}>
        로딩 중…
      </div>
    );
  }

  return (
    <>
      {/* 게시글 상자 */}
      <div className="diary-entry-box glass-card">
        <h1 className="diary-entry-title">{entry.title || '(제목 없음)'}</h1>
        <div className="diary-entry-date">{formattedDate}</div>

        <div className="diary-entry-content">
          {(entry.content || '').split('\n').map((line, i) => (
            <p key={i} style={{ margin: '0 0 10px' }}>
              {line}
            </p>
          ))}
        </div>

        {/* 수정/삭제 아이콘 */}
        {entry.can_edit && (
          <div className="action-buttons">
            <button
              className="icon-btn"
              title="수정"
              aria-label="수정"
              onClick={() => navigate(`/notes/${id}/edit`)}
            >
              <FaEdit />
            </button>
            <button
              className="icon-btn danger"
              title="삭제"
              aria-label="삭제"
              onClick={handleDelete}
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {/* 아래 가운데: 뒤로가기 */}
      <div className="back-button-container">
        <button
          className="icon-btn"
          title="뒤로가기"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>
      </div>
    </>
  );
}
