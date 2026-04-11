import React from 'react';

export default function BookCard({ book }) {
  // Use a fallback background if not provided
  const bg = book.bg || '#e8e8e8';
  
  return (
    <div className="lg-book-card">
      <div className="lg-book-cover" style={{ background: bg }}>
        {book.image ? (
          <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No Image</div>
        )}
      </div>
      <div className="lg-book-meta">
        <span className="lg-book-title">{book.title}</span>
        <span className="lg-book-price">
          {typeof book.price === 'number' ? `$${(book.price / 1000).toFixed(2)}` : book.price}
        </span>
      </div>
      <div className="lg-book-author">{book.author}</div>
      <div className="lg-book-stats">
        <span><span className="lg-stars">★</span> {book.rating || "4.5"} ({book.reviews || "0"})</span>
        <span>{book.sold || 0} sold</span>
      </div>
    </div>
  );
}
