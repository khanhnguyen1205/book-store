import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="lg-pagination">
      <div 
        className="lg-page-btn" 
        style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
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
        style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        ›
      </div>
    </div>
  );
}
