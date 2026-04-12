import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="lg-footer">
        <div>
          <div className="lg-footer-brand">The Literary Gallery</div>
          <p className="lg-footer-desc">
            Curation of the world's most evocative literature and visual narratives. We believe every shelf tells a story.
          </p>
        </div>
        <div>
          <h5>Explore</h5>
          <ul>
            <li>Journal</li>
            <li>Collections</li>
            <li>Exhibitions</li>
            <li>Membership</li>
          </ul>
        </div>
        <div>
          <h5>Support</h5>
          <ul>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Shipping &amp; Returns</li>
          </ul>
        </div>
        <div>
          <h5>The Atelier Newsletter</h5>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
            Subscribe for weekly curations and exclusive literary events.
          </p>
          <div className="lg-newsletter-input">
            <input placeholder="email@example.com" />
            <button className="lg-newsletter-btn">→</button>
          </div>
        </div>
      </div>
      <div className="lg-footer-bottom">
        <span>© 2024 The Literary Gallery. All rights reserved.</span>
        <div className="lg-footer-bottom-links">
          <span style={{ color: "#4444cc" }}>Journal</span>
          <span>Contact</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}
