import React from 'react';

export default function Button({ children, variant = 'primary', ...props }) {
  const className = variant === 'primary' ? 'lg-btn-primary' : 'lg-btn-secondary';
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
