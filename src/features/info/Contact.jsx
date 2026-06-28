import React from 'react';
import InfoPage from './InfoPage';

export default function Contact() {
  return (
    <InfoPage
      title="Liên hệ"
      subtitle="Chúng tôi luôn sẵn lòng lắng nghe bạn."
    >
      <div className="info-contact-grid">
        <div className="info-contact-card">
          <h3>Email</h3>
          <p><a href="mailto:hello@literarygallery.com">hello@literarygallery.com</a></p>
        </div>
        <div className="info-contact-card">
          <h3>Hotline</h3>
          <p><a href="tel:+842838221234">+84 28 3822 1234</a></p>
        </div>
        <div className="info-contact-card">
          <h3>Địa chỉ</h3>
          <p>Quận 9, TP. Thủ Đức, TP. Hồ Chí Minh</p>
        </div>
        <div className="info-contact-card">
          <h3>Giờ làm việc</h3>
          <p>Thứ 2 – Thứ 7, 9:00 – 18:00</p>
        </div>
      </div>
      <h2>Câu hỏi thường gặp</h2>
      <p>
        Trước khi liên hệ, bạn có thể tham khảo <a href="/terms">Điều khoản dịch vụ</a> và
        {' '}<a href="/privacy">Chính sách bảo mật</a> để biết thông tin về đặt hàng,
        giao nhận và quyền riêng tư.
      </p>
    </InfoPage>
  );
}
