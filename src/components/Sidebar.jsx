import React from 'react';

const MIN_PRICE = 10;
const MAX_PRICE = 60;

export default function Sidebar({ categories, activeCategory, onCategoryChange, maxPrice, onPriceChange }) {
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
      <div style={{ fontSize: 12, color: '#3333bb', fontWeight: 500, marginBottom: 4 }}>
        Up to ${maxPrice}.00
      </div>
      <input
        type="range"
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={1}
        value={maxPrice}
        onChange={(e) => onPriceChange(Number(e.target.value))}
        style={{ width: "100%", margin: "4px 0", accentColor: "#3333bb" }}
      />
      <div className="lg-price-label">
        <span>${MIN_PRICE}</span>
        <span>${MAX_PRICE}+</span>
      </div>
      <div className="lg-quote-card">
        <p>"A room without books is like a body without a soul."</p>
        <cite>— Marcus Cicero</cite>
      </div>
    </aside>
  );
}
