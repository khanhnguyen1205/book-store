import React from 'react';
import InfoPage from './InfoPage';

export default function Terms() {
  return (
    <InfoPage
      title="Điều khoản dịch vụ"
      subtitle="Cập nhật lần cuối: tháng 6, 2026"
    >
      <p>
        Khi sử dụng website The Literary Gallery, bạn đồng ý với các điều khoản dưới đây.
        Vui lòng đọc kỹ trước khi đặt hàng.
      </p>
      <h2>Tài khoản</h2>
      <p>
        Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình và mọi hoạt động diễn ra
        dưới tài khoản đó. Vui lòng thông báo cho chúng tôi nếu phát hiện truy cập trái phép.
      </p>
      <h2>Đặt hàng &amp; thanh toán</h2>
      <ul>
        <li>Giá và tình trạng còn hàng có thể thay đổi mà không báo trước.</li>
        <li>Chúng tôi có quyền từ chối hoặc huỷ đơn hàng trong trường hợp bất thường.</li>
      </ul>
      <h2>Giao nhận &amp; đổi trả</h2>
      <p>
        Thời gian giao hàng có thể thay đổi theo khu vực. Sản phẩm lỗi do nhà sản xuất được
        đổi trả trong vòng 7 ngày kể từ ngày nhận.
      </p>
      <p className="info-muted">
        Đây là dự án học tập; điều khoản chỉ mang tính minh hoạ, không có giá trị pháp lý.
      </p>
    </InfoPage>
  );
}
