# LAB5 — Nhóm 3 miền · Track 1: Y tế

**Thành viên:**

| Họ và tên | Mã học viên |
|---|---|
| Phan Trọng Hậu | 2A202603547 |
| Ngô Đức Thịnh | 2A202603548 |
| Bùi Gia Huy | 2A202603525 |

**Lớp:** L3A.  
**Trạng thái:** Đã có prototype hai màn hình và §5. Các phần thiết kế của Thịnh, Huy đang chờ hoàn thiện.

## Phân công

Xem [phân công chi tiết](TASKS.md): **Hậu** phụ trách prototype và tích hợp; **Thịnh** phụ trách phạm vi, kịch bản và UX khi sai; **Huy** phụ trách mức tự chủ, kiểm tra và kịch bản demo. Đây là kế hoạch; đóng góp thực tế ghi ở đầu `spec.md`.

## Chạy prototype

Mở [`prototype/index.html`](prototype/index.html) trong trình duyệt, không cần cài đặt. Xem [hướng dẫn bấm thử, ảnh và giới hạn kiểm tra](prototype/README.md).

## Hiểu đề

Thiết kế trợ lý trả lời đầu tiên trong kênh Hỏi dược sĩ của Pharmacity. Khi khách hỏi thuốc cho mình hoặc người nhà, AI quyết định hỏi sàng lọc, gợi ý sản phẩm, chuyển dược sĩ hoặc khuyên đi khám ngay. Trọng tâm là lúc AI sai thì người dùng thấy gì, và AI được tự làm đến đâu.

## Việc cần hoàn thành

1. `spec.md` §1: lát cắt được giao và 3 việc không làm, kèm lý do.
2. §2: ít nhất 8 kịch bản phủ 4 lớp: nguồn sự thật, thiếu thông tin, ngoài thẩm quyền, rủi ro y tế. Mỗi lỗi trỏ tới tool/dữ liệu cụ thể; chọn 2 ca đắt nhất và giải thích.
3. §3: cho 2 ca đó, ghi nguyên văn lời AI, giao diện, bước tiếp theo, ai được báo và khi nào. Chọn 2–3 nguyên tắc HAX/PAIR, chỉ ra vị trí cụ thể và phương án đã loại.
4. §4: xếp cả 5 tool vào tự làm / cần người duyệt / cấm. Giải thích hậu quả khi sai, khả năng đảo lại và cái giá của chờ duyệt; thử trên 2 ca khó + 1 ca thường.
5. §5 và `prototype/`: 1–2 màn hình bấm được, kèm 1–2 ảnh đánh số. Demo ca trẻ nhỏ hoặc có dấu hiệu nguy hiểm.
6. §6: 3 tiêu chí Pass/Fail và kết quả chấm thử trên 2 ca khó.
7. §7: ghi ca lạ thực tế nhận lúc demo; mỗi thành viên trình bày một phần.

## Bộ tool cần đặt mức tự chủ

- `goi_y_san_pham`: gửi gợi ý sản phẩm kèm nút đặt.
- `chuyen_duoc_si`: chuyển cuộc chat cho dược sĩ trực.
- `khuyen_di_kham`: hiện thông báo đi khám / gọi cấp cứu ngay.
- `luu_ghi_chu_suc_khoe`: lưu thông tin sức khoẻ vào hồ sơ.
- `ban_thuoc_ke_don`: bán thuốc kê đơn qua chat.

Đây là danh sách khả năng của đề để phân tích, chưa phải quyền được cấp. Nhóm tự đặt mức từng tool ở §4.

## Điểm và lưu ý

Xử lý khi AI sai (25), mức tự chủ (25), prototype (25) chiếm 75/100 điểm. Mỗi quyết định cần phương án đã cân nhắc, lựa chọn, lý do chọn/loại và bằng chứng cụ thể.

Theo quy tắc track: không tự nói liều; không tự bán/gợi ý thuốc kê đơn hoặc thuốc thay thế; ca nguy hiểm không nằm chờ; không lưu sức khoẻ khi chưa đồng ý. Chỉ dùng dữ liệu dựng. Không bắt buộc AI thật hay API key.

## Trước khi nộp

- Bổ sung bàn / zone và việc thực tế từng người.
- Hoàn thiện §1–4, §6–7; đối chiếu quyết định với prototype và bấm thử trên trình duyệt trước khi nộp.
- Repo công khai, nộp link theo kênh giảng viên thông báo.
- Hạn L3A: 23:59 ngày 12/11/2026; L3B: 23:59 ngày 13/11/2026.

[Đề gốc](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy). Repo này khởi tạo độc lập, không fork và không chứa bộ đề.
