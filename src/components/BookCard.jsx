import React from 'react';

export default function BookCard({ book }) {
  const bg = book.bg || '#1a2a3a';

  return (
    <article className="lg-book-card">
      {/* Tác phẩm đóng khung dưới đèn rọi */}
      <div className="lg-frame">
        <div className="lg-frame-light" aria-hidden="true" />
        <div className="lg-book-cover" style={{ background: bg }}>
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="lg-book-noimg">No Image</div>
          )}
        </div>
      </div>

      {/* Biển đồng */}
      <div className="lg-plaque">
        <div className="lg-plaque-top">
          <span className="lg-book-title">{book.title}</span>
          <span className="lg-book-price">
            {typeof book.price === 'number' ? `$${(book.price / 1000).toFixed(2)}` : book.price}
          </span>
        </div>
        <div className="lg-book-author">{book.author}</div>
        <div className="lg-book-stats">
          <span><span className="lg-stars">★</span> {book.rating || '4.5'} ({book.reviews || '0'})</span>
          <span>{book.sold || 0} sold</span>
        </div>
      </div>
    </article>
  );
}
