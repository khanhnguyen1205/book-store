import React from 'react';
import InfoPage from './InfoPage';

export default function Privacy() {
  return (
    <InfoPage
      title="Chính sách bảo mật"
      subtitle="Cập nhật lần cuối: tháng 6, 2026"
    >
      <p>
        The Literary Gallery tôn trọng quyền riêng tư của bạn. Trang này mô tả cách chúng
        tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng website.
      </p>
      <h2>Thông tin chúng tôi thu thập</h2>
      <ul>
        <li>Thông tin tài khoản: họ tên, email khi bạn đăng ký.</li>
        <li>Email đăng ký nhận bản tin (nếu bạn chủ động đăng ký).</li>
        <li>Dữ liệu giỏ hàng được lưu cục bộ trên trình duyệt của bạn.</li>
      </ul>
      <h2>Cách chúng tôi sử dụng thông tin</h2>
      <ul>
        <li>Xử lý đơn hàng và quản lý tài khoản.</li>
        <li>Gửi bản tin và thông báo nếu bạn đồng ý.</li>
        <li>Cải thiện trải nghiệm và chất lượng dịch vụ.</li>
      </ul>
      <h2>Quyền của bạn</h2>
      <p>
        Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xoá dữ liệu cá nhân của mình bất kỳ
        lúc nào bằng cách liên hệ qua <a href="/contact">trang Liên hệ</a>.
      </p>
      <p className="info-muted">
        Đây là dự án học tập; chính sách chỉ mang tính minh hoạ, không có giá trị pháp lý.
      </p>
    </InfoPage>
  );
}
