import React from 'react';

// Mờ đi + đổi con trỏ khi nút prev/next bị vô hiệu (đầu/cuối danh sách)
function navButtonStyle(disabled) {
  return { opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' };
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="lg-pagination">
      <div
        className="lg-page-btn"
        style={navButtonStyle(page === 1)}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        ‹
      </div>
      {Array.from({ length: totalPages }).map((_, i) => {
        const n = i + 1;
        return (
          <div 
            key={n} 
            className={`lg-page-btn${n === page ? " active" : ""}`}
            onClick={() => onPageChange(n)}
          >
            {n}
          </div>
        );
      })}
      <div
        className="lg-page-btn"
        style={navButtonStyle(page === totalPages)}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        ›
      </div>
    </div>
  );
}
