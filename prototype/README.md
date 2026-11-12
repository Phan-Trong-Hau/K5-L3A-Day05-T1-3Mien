# Prototype — Hỏi dược sĩ · Nhóm 3 miền

## Mở và thử

Mở `index.html` bằng Chrome, Edge hoặc Firefox. Không cần cài đặt, backend hay API key. Hoặc chạy từ thư mục repo:

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080/prototype/`.

Có đúng hai màn hình: **Khách hàng** và **Dược sĩ · demo**. Thanh điều khiển demo tách khỏi cuộc chat; cho phép giả lập quá hạn và xoá phiên.

## Luồng demo khớp report

### K1 — Thai kỳ, chuyển dược sĩ và duyệt

1. Chọn **K1 · Thai kỳ**. Tin nhắn trùng nguyên văn K1 trong `spec.md` §2.
2. Ca tự chuyển sang dược sĩ mô phỏng; thẻ hiện nhãn thai kỳ và hạn demo 2 phút. Không có gợi ý thuốc. Có thể **Huỷ chuyển ca** trước khi nhận rồi bấm chuyển lại.
3. Có thể bổ sung/sửa dữ kiện. Hệ thống đánh giá lại, huỷ bản duyệt cũ và khởi động lại hạn chờ của ca mới; nếu thêm dấu hiệu nguy hiểm thì chuyển hẳn sang cảnh báo.
4. Mở **Dược sĩ · demo** → **Nhận ca mô phỏng** → **Soạn phản hồi sàng lọc**.
5. Nút gửi vẫn hiện nhưng biểu mẫu và logic chặn gửi khi chưa xác nhận. Kiểm tra bản nháp, tích xác nhận → **Duyệt & gửi phản hồi mô phỏng**.
6. Quay lại **Khách hàng**, thấy phản hồi đã duyệt. Không có đơn hàng hoặc gợi ý thuốc được tạo.

### K2 — Trẻ khò khè, li bì hỏi siro

1. Chọn **K2 · Trẻ li bì, khò khè**. Tin nhắn trùng nguyên văn K2 trong report.
2. Cảnh báo đi khám / gọi cấp cứu hiện ngay. Không có nút chuyển hàng chờ hay gợi ý thuốc; bàn dược sĩ không nhận ca này.
3. **Tôi đã đọc hướng dẫn** chỉ ghi nhận đã đọc, không thực hiện cuộc gọi hoặc báo dược sĩ.
4. Có thể **Sửa tin nhắn trước** rồi **Cập nhật & đánh giá lại** nếu bộ lọc hiểu sai. Không khoá khả năng sửa của khách.

Tám nút K1–K8 tương ứng tám dòng report. Nút **Ca thêm · Trẻ sốt** vẫn có để thử chuyển thủ công khi chưa có từ khoá nguy hiểm.

### Kiểm tra thêm

- **Quá hạn:** chọn K1 hoặc chuyển ca thủ công rồi bấm **Giả lập quá hạn 2 phút**. Bản nháp không được tự gửi. Có thể thử chuyển lại. Nếu không giả lập, bộ hẹn giờ thực sự chạy 2 phút từ lúc chuyển ca, gồm cả thời gian dược sĩ đang xem.
- **Sửa ca:** đang chờ hoặc đã duyệt, gửi thông tin mới có “khó thở”. Ca cũ, bản duyệt và đồng ý lưu bị huỷ; cảnh báo nguy hiểm thay thế luồng cũ.
- **Quyền riêng tư:** chọn K8, xem nội dung dự kiến; nút lưu bị khoá trước khi tích đồng ý; lưu xong có nút xoá. Màn dược sĩ không có nút đồng ý thay khách. Mọi dữ liệu chỉ ở bộ nhớ phiên, không dùng localStorage/cookie và không gửi ra mạng.
- **Ca thường:** chọn **K6 · Tồn kho**. AI nói rõ không có nguồn giá/tồn kho; không tự xác nhận còn hàng.
- **K3 · Thuốc kê đơn:** không có nút bán hoặc gợi ý thay thế.
- **Ca lạ:** nhập văn bản tự do. Nếu không nhận diện được, hệ thống hỏi lại và cho chuyển dược sĩ; không sinh câu trả lời y khoa.

## Ảnh đánh số

Đây là **ảnh render tĩnh từ cùng hàm HTML và CSS của prototype**, có điều chỉnh bố cục in; không phải ảnh chụp trình duyệt và không xác minh tương tác trên trình duyệt.

![K2 cảnh báo nguy hiểm — các vị trí 1 đến 5](images/01-emergency.png)

![K1 dược sĩ duyệt phản hồi — vị trí 6](images/02-pharmacist-review.png)

Ánh xạ từng số và lý do thiết kế ở [`spec.md` §5](../spec.md#5-prototype--chặng-5).

## Những gì là mô phỏng

- Phân luồng bằng quy tắc từ khoá trong `app.js`, **không có lời gọi AI thật**.
- Dược sĩ, hàng chờ, hạn 2 phút, chuyển ca, duyệt và lưu ghi chú đều là mô phỏng trên một trang. Hạn 2 phút là lựa chọn demo, không phải cam kết của Pharmacity.
- Không có phân quyền thật; nút đổi vai chỉ phục vụ demo. Không dùng mô hình này để triển khai hồ sơ sức khoẻ thật.
- Không kết nối Pharmacity, tồn kho, đơn hàng hay dịch vụ cấp cứu. Không có thuốc thật, liều dùng hoặc chức năng mua hàng.
- Luồng duyệt minh hoạ **phản hồi sàng lọc**, chưa có màn hình dược sĩ chọn sản phẩm. Chính sách §4 yêu cầu dược sĩ duyệt `goi_y_san_pham`; chức năng chọn/gửi sản phẩm chưa được triển khai, không tính như đã thử thành công.

## Giới hạn và bàn giao

Bộ lọc không hiểu đầy đủ phủ định, tiếng lóng hoặc mọi dấu hiệu y tế. Ví dụ “không khó thở” vẫn có thể kích hoạt cảnh báo; câu diễn đạt khác có thể bị bỏ sót. Ca không nhận diện được luôn đi đường hỏi lại/chuyển người, nhưng điều đó **không bảo đảm phát hiện cấp cứu**. Đây là giới hạn demo, không phải hệ thống phân loại y tế dùng thật.

Câu chữ, K1–K8, quyền tool, ba nguyên tắc G1/G10/G9 và hạn demo hai phút khớp §1–6. Trình tự demo chung ở §7.1: Thịnh → Huy → Hậu → cả nhóm nhận ca lạ. Ý kiến cá nhân §4.3 cần từng người xác nhận; §7.2 chỉ ghi sau demo.

## Kiểm tra kỹ thuật

```bash
npm ci
npm test
```

27/27 kiểm tra đạt: 17 logic và 10 DOM bằng jsdom. Có hồi quy nguyên văn K1–K8 và hai lời AI trong report; chuyển/huỷ/duyệt; K2/K5 chặn hàng chờ; sửa dữ kiện; đồng ý lưu và chèn HTML. Kiểm tra hẹn giờ dùng đồng hồ giả để xác nhận đặt/huỷ/reset hạn và xử lý quá hạn, không chờ thực tế 2 phút. jsdom không phải trình duyệt thật và không xác minh layout responsive hoặc focus/scroll thực tế.

Hai ảnh đã được render và xem lại để kiểm tra bố cục. Môi trường thực hiện không có trình duyệt khả dụng; cần bấm thử một vòng trên trình duyệt trước khi demo trước lớp.

Tái tạo HTML cho ảnh (không cần jsdom):

```bash
node prototype/scripts/render-snapshots.cjs /tmp/lab5-snapshots
```

Dùng WeasyPrint 70.0 để render hai file HTML thành PDF tạm, rồi Poppler `pdftoppm -scale-to 1800 -singlefile -png` để xuất PNG. Script dùng cùng `render()` với ứng dụng; PDF tạm không đưa vào bài nộp.
