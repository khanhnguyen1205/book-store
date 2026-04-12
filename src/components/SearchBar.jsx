import React from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search for titles..." }) {
  return (
    <div className="lg-search">
      <input 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
