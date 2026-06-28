import React from 'react';
import InfoPage from './InfoPage';

export default function About() {
  return (
    <InfoPage
      title="Về chúng tôi"
      subtitle="The Literary Gallery — nơi mỗi kệ sách kể một câu chuyện."
    >
      <p>
        The Literary Gallery là hiệu sách trực tuyến tuyển chọn những tác phẩm văn học và
        tự sự thị giác giàu cảm xúc nhất thế giới. Chúng tôi tin rằng một cuốn sách hay
        không chỉ để đọc, mà còn là một trải nghiệm thẩm mỹ.
      </p>
      <h2>Sứ mệnh</h2>
      <p>
        Mang đến cho độc giả những đầu sách được tuyển chọn kỹ lưỡng — từ lập trình,
        phát triển bản thân đến tiểu thuyết kinh điển — cùng trải nghiệm mua sắm tinh tế,
        nhanh chóng và đáng tin cậy.
      </p>
      <h2>Giá trị cốt lõi</h2>
      <ul>
        <li>Tuyển chọn có gu thay vì chạy theo số lượng.</li>
        <li>Tôn trọng quyền riêng tư và dữ liệu của khách hàng.</li>
        <li>Hỗ trợ tận tâm trước và sau khi mua.</li>
      </ul>
      <p className="info-muted">
        Đây là dự án học tập (FPT University — FER202). Nội dung chỉ mang tính minh hoạ.
      </p>
    </InfoPage>
  );
}
