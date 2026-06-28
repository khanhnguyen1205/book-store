import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Info.css';

/**
 * Khung chung cho các trang nội dung tĩnh (About, Contact, Privacy, Terms):
 * Navbar + tiêu đề + nội dung + Footer — đồng bộ chrome storefront.
 */
export default function InfoPage({ title, subtitle, children }) {
  // Cuộn lên đầu khi mở trang (giống điều hướng web thật).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="lg-wrap">
      <Navbar />
      <article className="info-page">
        <header className="info-header">
          <h1 className="info-title">{title}</h1>
          {subtitle && <p className="info-subtitle">{subtitle}</p>}
        </header>
        <div className="info-content">{children}</div>
      </article>
      <Footer />
    </div>
  );
}
