import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../styles/List.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function List() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/notes/')
      .then(res => setNotes(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('정말 삭제할까요?')) return;
    try {
      await API.delete(`/notes/${id}/`);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data || err.message);
    }
  };

  return (
    <div className="list-container">
      <h2>일기 목록</h2>

      {/* 공용 버튼 테마 적용 */}
      <button className="btn btn-primary" onClick={() => navigate('/notes/new')}>
        New
      </button>

      {notes.length === 0 ? (
        <div className="empty">
          <div className="empty-title">아직 작성한 일기가 없어요</div>
          <div className="empty-text">‘새 일기 쓰기’를 눌러 첫 글을 남겨보세요.</div>
        </div>
      ) : (
        <ul>
          {notes.map(n => (
            // 👉 유리판 효과 추가: glass-card (필요하면 hover-lift도 함께)
            <li key={n.id} className="diary-entry glass-card">
              <Link to={`/notes/${n.id}`}>
                <div className="entry-header">
                  <h3>{n.title || '(제목 없음)'}</h3>
                  <span>
                    {n.updated_at
                      ? new Date(n.updated_at).toLocaleDateString('ko-KR')
                      : ''}
                  </span>
                </div>
                <p>
                  {n.content?.substring(0, 100)}
                  {n.content?.length > 100 ? '...' : ''}
                </p>
              </Link>

              <div className="entry-footer">
                <div className="entry-actions">
                  <button
                    className="icon-btn"
                    title="수정"
                    aria-label="수정"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/notes/${n.id}/edit`);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn danger"
                    title="삭제"
                    aria-label="삭제"
                    onClick={(e) => handleDelete(e, n.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
