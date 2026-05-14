import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, Calendar, Clock, RotateCcw } from 'lucide-react';
import { getBookById, borrowBook, returnBook } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusChip from '../components/StatusChip';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setIsLoading(true);
    const res = await getBookById(id);
    if (res.code === 0) {
      setBook(res.data);
    } else {
      setMessage(res.message);
    }
    setIsLoading(false);
  };

  const handleBorrow = async () => {
    setActionLoading(true);
    setMessage('');
    const res = await borrowBook(id);
    if (res.code === 0) {
      setMessage('借阅成功！请在 14 天内归还。');
      await fetchBook();
    } else {
      setMessage(res.message);
    }
    setActionLoading(false);
  };

  const handleReturn = async () => {
    setActionLoading(true);
    setMessage('');
    const res = await returnBook(id);
    if (res.code === 0) {
      setMessage('归还成功！');
      await fetchBook();
    } else {
      setMessage(res.message);
    }
    setActionLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('zh-CN');
  };

  if (isLoading) {
    return (
      <div className="container detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container detail-page">
        <div className="empty-state">
          <p>{message || '图书不存在'}</p>
          <Link to="/books" className="btn btn-secondary">
            <ArrowLeft size={16} />
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === book.owner?.id;
  const isBorrower = user?.id === book.borrower?.id;
  const canBorrow = book.status === 'available' && !isOwner;
  const canReturn = book.status === 'borrowed' && isBorrower;

  return (
    <div className="container detail-page fade-in">
      {/* 返回按钮 */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        返回
      </button>

      {/* 消息提示 */}
      {message && (
        <div className={`alert ${message.includes('成功') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="detail-layout">
        {/* 左侧：封面 */}
        <div className="detail-cover">
          <img
            src={book.cover}
            alt={book.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop';
            }}
          />
        </div>

        {/* 右侧：信息 */}
        <div className="detail-info">
          <div className="detail-header">
            <h1 className="detail-title">{book.title}</h1>
            <StatusChip status={book.status} />
          </div>

          <p className="detail-author">
            <BookOpen size={16} />
            {book.author}
          </p>

          <p className="detail-publisher">
            出版社：{book.publisher}
          </p>

          <div className="detail-owner">
            <div className="owner-item">
              <User size={16} />
              <span>持有人：{book.owner?.name || '未知'}</span>
            </div>
            {book.borrower && (
              <div className="owner-item">
                <Calendar size={16} />
                <span>
                  借阅人：{book.borrower.name}
                  {book.borrower.dueDate && (
                    <span className="due-date">（归还截止：{formatDate(book.borrower.dueDate)}）</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="detail-description">
            <h3>简介</h3>
            <p>{book.description}</p>
          </div>

          {/* 操作按钮 */}
          <div className="detail-actions">
            {canBorrow && (
              <button
                className="btn btn-primary"
                onClick={handleBorrow}
                disabled={actionLoading}
              >
                {actionLoading ? '处理中...' : '申请借阅'}
              </button>
            )}
            {canReturn && (
              <button
                className="btn btn-primary"
                onClick={handleReturn}
                disabled={actionLoading}
              >
                <RotateCcw size={16} />
                {actionLoading ? '处理中...' : '归还图书'}
              </button>
            )}
            {isOwner && book.status === 'available' && (
              <p className="action-hint">您是该书的持有人</p>
            )}
          </div>
        </div>
      </div>

      {/* 借阅历史 */}
      {book.borrowHistory && book.borrowHistory.length > 0 && (
        <div className="borrow-history fade-in">
          <h3>
            <Clock size={18} />
            借阅历史
          </h3>
          <div className="history-list">
            {book.borrowHistory.map((record, index) => (
              <div key={index} className="history-item">
                <div className="history-user">{record.userName}</div>
                <div className={`history-action ${record.action}`}>
                  {record.action === 'borrow' ? '借阅' : '归还'}
                </div>
                <div className="history-time">{formatTime(record.time)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
