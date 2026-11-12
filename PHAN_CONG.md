# Phân công LAB5 — Nhóm 3 miền · L3A · T1 Y tế

**Trạng thái:** Kế hoạch phân công; chưa phải xác nhận công việc đã hoàn thành.

## Phụ trách chính

| Thành viên | Mã học viên | Phần phụ trách | Đầu ra cần bàn giao | Phần demo |
|---|---|---|---|---|
| Phan Trọng Hậu | 2A202603547 | Prototype và tích hợp bài | `prototype/` bấm được qua ca khó; 1–2 ảnh đánh số; `spec.md` §5; kiểm tra repo và link cuối | Bấm prototype, chỉ vị trí nguyên tắc và quyền tự chủ trên màn hình |
| Ngô Đức Thịnh | 2A202603548 | Phạm vi, kịch bản rủi ro và UX khi AI sai | `spec.md` §1–3: phạm vi, ≥8 kịch bản, 2 ca đắt nhất, lời AI nguyên văn và 2–3 nguyên tắc HAX/PAIR | Giới thiệu lát cắt, giải thích chọn ca khó và cách AI phản hồi |
| Bùi Gia Huy | 2A202603525 | Mức tự chủ, kiểm tra và kịch bản demo | `spec.md` §4, §6–7: bảng quyền 5 tool, thử 3 ca, 3 tiêu chí Pass/Fail, kết quả kiểm tra và ghi nhận ca lạ sau demo | Giải thích quyền tool và hậu quả khi sai; nhận và xử lý ca lạ |

Người phụ trách chính tổng hợp và sửa phần mình. Cả ba cùng phản biện các quyết định ở §1–4 và đều phải hiểu luồng prototype.

## Việc cụ thể

### Hậu — prototype và tích hợp

- Nhận 2 ca khó, câu chữ và nguyên tắc từ Thịnh; nhận bảng quyền, bước duyệt và quy tắc quá hạn từ Huy.
- Dựng 1–2 màn hình bằng công cụ nhóm chọn. Thể hiện ít nhất 2 mức tự chủ, căn cứ/giới hạn của AI và đường chuyển dược sĩ.
- Cho bấm hết một ca trẻ nhỏ hoặc có dấu hiệu nguy hiểm, không sửa tay giữa luồng. Ghi rõ phần mock, có hay không AI thật.
- Chụp 1–2 ảnh đánh số; viết §5 để nối từng số với nguyên tắc HAX/PAIR và mức tự chủ.
- Tích hợp bài, kiểm tra mở prototype, link và ảnh; chuẩn bị link repo để nộp đúng kênh.

### Thịnh — kịch bản và UX khi sai

- Viết §1 theo đúng lát cắt T1, nêu 3 việc không làm và lý do.
- Viết ≥8 kịch bản phủ đủ 4 lớp; mỗi lỗi phải trỏ về tool hoặc dữ liệu có/thiếu trong track. Phủ các hard test: người dùng thuốc khác người nhắn, dấu hiệu nguy hiểm, thuốc kê đơn, khách gắt, dùng thuốc nhiều ngày không đỡ và hai yêu cầu trong một tin.
- Đề xuất 2 ca đắt nhất, kèm ca suýt chọn và lý do loại; cả nhóm chốt.
- Với mỗi ca, viết nguyên văn lời AI, nội dung màn hình, bước tiếp theo, ai được báo và khi nào; phân loại lỗi và giải thích phương án chọn/loại.
- Chọn 2–3 nguyên tắc HAX/PAIR, cùng Hậu xác định vị trí thể hiện cụ thể trên prototype.

### Huy — quyền tool và kiểm tra

- Tổng hợp mức tự chủ cho đủ 5 tool, nêu ai duyệt, thấy gì và quá hạn thì sao; giải thích hậu quả khi sai, khả năng đảo lại và cái giá của chờ người.
- Trước khi thảo luận, mỗi thành viên tự xếp mức trong 5 phút. Ghi đúng ý kiến thực tế của từng người, tool khó xếp nhất và cách nhóm chốt; không tự dựng lịch sử thảo luận.
- Thử bảng quyền trên 2 ca đắt nhất + 1 ca thường: lỗi có bị chặn, có làm khi phải hỏi, có bắt chờ vô ích không.
- Viết 3 tiêu chí Pass/Fail quan sát được; cùng Thịnh kiểm tra prototype và ghi kết quả thật, lỗi còn lại ở §6.
- Chuẩn bị trình tự demo; sau demo mới điền ca lạ thực tế và điều nhóm thay đổi vào §7.

## Mốc bàn giao theo buổi lab

| Mốc | Cần có | Người tổng hợp |
|---|---|---|
| Phút 10 | Hiểu đúng lát cắt, phạm vi và hậu quả khi sai | Thịnh, cả nhóm chốt |
| Phút 45 — M1 | ≥8 kịch bản phủ 4 lớp, chọn 2 ca đắt nhất và lý do | Thịnh |
| Phút 90 | Câu chữ và luồng UX cho 2 ca, nguyên tắc HAX/PAIR | Thịnh, Hậu phản biện khả năng thể hiện |
| Phút 125 — M2 | Quyền cho mọi tool, tool khó xếp nhất, thử 3 ca | Huy, cả nhóm chốt |
| Phút 140–200 — M3 | Hậu dựng prototype; Thịnh kiểm tra câu chữ và nguyên tắc; Huy bấm thử quyền và luồng lỗi | Hậu tích hợp |
| Phút 200–210 | 3 tiêu chí, kết quả thử 2 ca; ảnh và spec khớp prototype | Huy tổng hợp; Hậu hoàn thiện ảnh |
| Phút 210–240 | Mỗi người demo một phần; ghi ca lạ và kết quả thực tế | Cả ba |

## Hoàn tất trước khi nộp

- [ ] Thịnh: §1–3 đủ bằng chứng và lập luận chọn/loại.
- [ ] Huy: §4 đủ 5 tool và thử 3 ca; §6 có kết quả thật; §7 được cập nhật sau demo.
- [ ] Hậu: prototype mở và bấm được; ảnh có đánh số, §5 khớp giao diện.
- [ ] Cả nhóm: đối chiếu spec với prototype, rà quy tắc T1 và không dùng dữ liệu sức khoẻ thật/API key trong repo.
- [ ] Mỗi người cập nhật cột “Việc đã làm” ở đầu `spec.md` bằng đóng góp thực tế.
- [ ] Hậu chuẩn bị link repo công khai để nộp trước **23:59 ngày 12/11/2026** theo kênh giảng viên thông báo.
