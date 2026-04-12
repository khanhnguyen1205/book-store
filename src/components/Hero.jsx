import React from 'react';
import Button from './Button';

const HeroCover = () => (
  <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" width="200" height="260">
    <rect width="200" height="280" rx="4" fill="#0d1f2d" />
    <circle cx="100" cy="100" r="55" fill="none" stroke="#c8a030" strokeWidth="1" opacity="0.6" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="#c8a030" strokeWidth="0.5" opacity="0.4" />
    <circle cx="100" cy="80" r="18" fill="#e8c060" opacity="0.9" />
    <path d="M70 160 Q100 100 130 160 Q100 150 70 160Z" fill="#1a3a50" opacity="0.8" />
    <path d="M80 160 Q100 110 120 160" fill="none" stroke="#2a5a70" strokeWidth="2" />
    <ellipse cx="100" cy="165" rx="35" ry="8" fill="#1a2a3a" opacity="0.5" />
    <text x="100" y="230" textAnchor="middle" fontSize="7" fill="#8899aa" fontFamily="serif" letterSpacing="2">MCXLEE BEAURELY SAFE LLE DASCUE</text>
    <text x="100" y="248" textAnchor="middle" fontSize="10" fill="#aabbc0" fontFamily="serif" letterSpacing="1">SAFE FOR WORK</text>
  </svg>
);

export default function Hero() {
  return (
    <section className="lg-hero">
      <div className="lg-hero-text">
        <div className="lg-hero-eyebrow">Editor's Choice</div>
        <h1 className="lg-hero-title">
          A Journey<br />Through<br /><em>Lost Archives</em>
        </h1>
        <p className="lg-hero-desc">
          Discover a curated collection of rare first editions and contemporary masterpieces in our latest seasonal archive.
        </p>
        <div className="lg-hero-btns">
          <Button variant="primary">Explore Collection</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
      <div className="lg-hero-book-wrap">
        <div className="lg-hero-book-img">
          <HeroCover />
        </div>
      </div>
    </section>
  );
}
