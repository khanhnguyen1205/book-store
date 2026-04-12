import React from 'react';

export default function Sidebar({ categories, activeCategory, onCategoryChange }) {
  return (
    <aside className="lg-sidebar">
      <h4>Categories</h4>
      <ul className="lg-cat-list">
        {categories.map((cat) => (
          <li 
            key={cat.label} 
            className={activeCategory === cat.label ? "active" : ""}
            onClick={() => onCategoryChange(cat.label)}
          >
            {cat.label}
          </li>
        ))}
      </ul>
      <h4>Filter by Price</h4>
      <input type="range" min="0" max="500" defaultValue="200" style={{ width: "100%", margin: "8px 0" }} />
      <div className="lg-price-label">
        <span>$0</span>
        <span>$500+</span>
      </div>
      <div className="lg-quote-card">
        <p>"A room without books is like a body without a soul."</p>
        <cite>— Marcus Cicero</cite>
      </div>
    </aside>
  );
}
