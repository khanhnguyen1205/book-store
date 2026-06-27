# TODO: Vấn đề ảnh bìa sách chưa giải quyết xong

> File bàn giao giữa các phiên làm việc với Claude Code.
> Tạo ngày 2026-06-27. Dùng để tiếp tục ở phiên sau.

## Tình trạng hiện tại

Ảnh bìa trong `db.json` đã được chuyển từ Open Library (bị timeout từ mạng VN)
sang 2 nguồn truy cập được:

- **Google Books** (`books.google.com/books/content?id=<VOLUME_ID>&printsec=frontcover&img=1&fife=w800-h1200&source=gbs_api`) — chất lượng cao, dùng tham số `fife=w800-h1200` để lấy ảnh lớn ~64KB–640KB.
- **Amazon CDN** (`images-na.ssl-images-amazon.com/images/P/<ISBN10>.01.LZZZZZZZ.jpg`) — dùng cho các cuốn Google Books không có ảnh bìa.

Phân bổ hiện tại (commit `ebc59f0`):

| ID | Sách | Nguồn ảnh | ID/ISBN dùng |
|----|------|-----------|--------------|
| 1  | Clean Code | Google Books | `hjEFCAAAQBAJ` |
| 2  | The Pragmatic Programmer | Google Books | `LhOlDwAAQBAJ` |
| 3  | JavaScript: The Good Parts | Google Books | `PXa2bby0oQ0C` |
| 4  | Atomic Habits | Google Books | `XfFvDwAAQBAJ` |
| 5  | Thinking, Fast and Slow | Amazon | `0374533555` |
| 6  | The 7 Habits... | Google Books | `upUxDwAAQBAJ` |
| 7  | To Kill a Mockingbird | Google Books | `PGR2AwAAQBAJ` |
| 8  | 1984 | Google Books | `kotPYEqx7kMC` |
| 9  | The Great Gatsby | Amazon | `0743273567` |
| 10 | Design Patterns | Amazon | `0201633612` |
| 11 | Deep Work | Amazon | `1455586692` |
| 12 | Pride and Prejudice | Google Books | `1AIQAQAAMAAJ` |
| 13 | You Don't Know JS | Amazon | `1491924462` |
| 14 | The Alchemist | Google Books | `FzVjBgAAQBAJ` |

## Vấn đề còn lại (CẦN GIẢI QUYẾT)

Người dùng phản hồi **vẫn còn ảnh bị lỗi / sai sách** sau commit `ebc59f0`,
nhưng CHƯA xác định chính xác cuốn nào. Việc khảo sát bằng subagent bị gián đoạn
nên chưa có kết luận. Cần làm ở phiên sau:

1. **Xác định chính xác cuốn nào còn vấn đề** — 3 loại:
   - Ảnh hỏng / không tải được.
   - Ảnh placeholder rỗng của Google Books (~1269 bytes, ảnh xám trống) — phải kiểm tra **kích thước thực tế** chứ không chỉ mã HTTP 200.
   - Ảnh tải được nhưng **sai sách** (cần đối chiếu volume ID / ISBN với đúng tên + tác giả; phần này khó vì agent text không "nhìn" được ảnh — cần tra cứu chéo nguồn).
2. Tìm URL thay thế đã xác minh cho các cuốn lỗi.
3. Áp dụng, review, test lại.

## Ghi chú kỹ thuật quan trọng (đã học được)

- **Open Library** (`covers.openlibrary.org`) **timeout** từ mạng này → KHÔNG dùng.
- **Google Books API** (`googleapis.com/books/v1/volumes?q=isbn:...`) **rate-limit (429)** rất nhanh khi gọi nhiều lần liên tiếp → tránh gọi loop; thay vào đó verify trực tiếp URL ảnh bằng HEAD request.
- **Phát hiện placeholder Google Books:** ảnh trống trả về **~1269 bytes** (thường `image/png`). Ảnh thật lớn hơn nhiều (vài KB → vài trăm KB). Luôn kiểm tra `Content-Length` thực tế.
- **Amazon cover format:** `.../images/P/<ISBN10>.01.LZZZZZZZ.jpg` cho ảnh lớn; `_SL1500_` cho ảnh nhỏ hơn. `LZZZZZZZ` nét hơn.
- **Fallback hiện tại:** `BookCard.jsx` và `Hero.jsx` có `onError` → ẩn ảnh (`display:none`) khi lỗi. Có thể cân nhắc đổi thành ảnh placeholder đẹp hơn thay vì ẩn hẳn.

## Quy trình đề xuất (dùng subagent — có hiệu lực từ phiên mới)

Đã tạo 3 subagent ở `.claude/agents/`:
- **researcher** — khảo sát URL ảnh, tra cứu ISBN/volume ID đúng (chỉ đọc).
- **reviewer** — review độc lập thay đổi `db.json` (chỉ đọc).
- **tester** — chạy thật (JSON Server + curl ảnh) kiểm chứng PASS/FAIL.

Luồng: **researcher** khảo sát → Claude sửa `db.json` → **reviewer** soi lại → **tester** kiểm chứng từng URL.

## Cách chạy dự án

```
npx json-server --watch db.json --port 9999   # backend, terminal riêng
npm start                                      # React dev server :3000
```
