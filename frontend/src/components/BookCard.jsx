import { Link } from 'react-router-dom';
import StatusChip from './StatusChip';

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card fade-in">
      <div className="book-card-cover-wrapper">
        <img
          src={book.cover}
          alt={book.title}
          className="book-card-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop';
          }}
        />
        <div className="book-card-status">
          <StatusChip status={book.status} />
        </div>
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <p className="book-card-owner">持有人：{book.owner?.name || '未知'}</p>
      </div>
    </Link>
  );
}
