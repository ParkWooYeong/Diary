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

  const sorted = [...notes].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const getEmoji = (sentiment) => {
    const emojis = {
      '행복': '😊',
      '슬픔': '😢',
      '화남': '🔥',
      '평온': '🌿'
    };
    return emojis[sentiment] || '✨';
  };

  return (
    <div className="list-container">
      <h2>일기 목록</h2>

      <button className="btn btn-primary" onClick={() => navigate('/notes/new')}>
        New
      </button>

      {sorted.length === 0 ? (
        <div className="empty">
          <div className="empty-title">아직 작성한 일기가 없어요</div>
          <div className="empty-text">‘새 일기 쓰기’를 눌러 첫 글을 남겨보세요.</div>
        </div>
      ) : (
        <ul>
          {sorted.map(n => (
            <li key={n.id} className="diary-entry glass-card">
              <Link to={`/notes/${n.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                
                {/* 1. 헤더 영역 (제목 + 감정 + 날짜) */}
                <div className="entry-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>{n.title || '(제목 없음)'}</h3>
                    {n.sentiment && (
                      <span className="sentiment-badge" title={n.sentiment}>
                        {getEmoji(n.sentiment)}
                      </span>
                    )}
                  </div>
                  <span>
                    {n.created_at ? new Date(n.created_at).toLocaleDateString('ko-KR') : ''}
                  </span>
                </div>

                {/* 2. AI 이미지 미리보기 (본문 위로 배치하여 카드 폭 활용) */}
                {n.image_url && (
                  <div className="entry-image-preview">
                    <img src={n.image_url} alt="AI Summary" />
                  </div>
                )}

                {/* 3. 본문 내용 */}
                <p>
                  {n.content?.substring(0, 100)}
                  {n.content?.length > 100 ? '...' : ''}
                </p>

                {/* 4. AI 답변 미리보기 */}
                {n.ai_reply && (
                  <div className="ai-reply-mini">
                    <strong>✨ AI 위로:</strong> {n.ai_reply}
                  </div>
                )}
              </Link>

              {/* 5. 하단 버튼 영역 */}
              <div className="entry-footer">
                <div className="entry-actions">
                  <button className="icon-btn" title="수정" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/notes/${n.id}/edit`);
                    }}>
                    <FaEdit />
                  </button>
                  <button className="icon-btn danger" title="삭제" onClick={(e) => handleDelete(e, n.id)}>
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