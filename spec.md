# Bài nộp LAB5 — T1 — Y tế · Nhóm 3 miền

**Trạng thái:** §1–3 đã đồng bộ với prototype và §5; §4, §6 chờ hoàn thiện, §7 cập nhật sau demo.
**Lớp:** L3A · **Bàn / zone:** Chưa bổ sung · **Track:** T1

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
| Phan Trọng Hậu | 2A202603547 | Dựng prototype HTML/CSS/JS hai màn hình, luồng chuyển/duyệt/quá hạn/sửa tin và quyền riêng tư; tạo 2 ảnh render đánh số; viết §5 và hướng dẫn demo; Các kiểm tra logic/DOM đạt |
| Ngô Đức Thịnh | 2A202603548 | Viết phạm vi, 8 kịch bản rủi ro và UX cho hai ca trọng tâm tại §1–3; nội dung đã được đồng bộ với prototype |
| Bùi Gia Huy | 2A202603525 | Thiết lập bảng mức tự chủ 5 tool gốc + 2 thao tác tách bước theo cost-of-error, ghi nhận thảo luận tool khó xếp nhất và kiểm chứng 3 ca (§4); xây dựng 3 tiêu chí Pass/Fail, kiểm tra thực tế và rà giới hạn (§6); chuẩn bị kịch bản demo và khung xử lý ca lạ (§7) |

**Phân công:** Hậu — prototype, tích hợp và §5; Thịnh — phạm vi, kịch bản, UX khi sai (§1–3); Huy — mức tự chủ, kiểm tra và demo (§4, §6–7). Cả nhóm cùng chốt quyết định. Xem [kế hoạch chi tiết](TASKS.md); bảng trên chỉ cập nhật việc thực tế đã làm.

## §1. Lát cắt & phạm vi

### 1.1 Lát cắt được giao

> Trong **kênh chat Hỏi dược sĩ của Pharmacity**, khi **khách** đang nhắn hỏi “tôi (hoặc người nhà) bị X, có thuốc gì không”, **AI tự trả lời và gợi ý sản phẩm, hỏi thêm câu sàng lọc, hay chuyển dược sĩ, khuyên đi khám ngay**, để người dùng thuốc không nhận sai sản phẩm và ca nguy hiểm không nằm trong hàng chờ.

### 1.2 Ba việc không làm

1. **Không bán thuốc kê đơn hoặc gợi ý thuốc thay thế qua AI.** Theo quy tắc T1, `ban_thuoc_ke_don` nằm ngoài quyền của trợ lý; không có nút bán hay tải đơn để tạo cảm giác hệ thống đã đủ điều kiện giao dịch.
2. **Không chẩn đoán, tự tính hoặc nêu liều dùng.** Theo quy tắc T1, hướng khách sang nhãn sản phẩm hoặc dược sĩ; prototype chỉ hiển thị lời hỏi sàng lọc, không trích một liều “tiêu chuẩn” để khách tự áp dụng khi chưa rõ người dùng thuốc.
3. **Không giữ ca có dấu hiệu nguy hiểm trong hàng chờ để tư vấn hoặc mua thuốc.** `khuyen_di_kham` phải hiện ngay; không thực hiện `goi_y_san_pham` hay `chuyen_duoc_si` cho ca đó. Mua hoặc chờ phản hồi có thể làm chậm bước tìm hỗ trợ.

Bài này phân tích rủi ro theo dữ liệu dựng và quy tắc của đề, không kết luận bệnh cụ thể hoặc khẳng định độ an toàn của một hoạt chất.

## §2. Kịch bản rủi ro (chặng 2)

### 2.1 Tám kịch bản, tương ứng tám nút K1–K8 trên prototype

① Nguồn sự thật · ② Mơ hồ / thiếu thông tin · ③ Ngoài phạm vi / thẩm quyền · ④ Đặc thù y tế.

| Mã | Tin người dùng nhắn | Lớp | AI có thể sai thế nào — căn cứ tool/dữ liệu | Sản phẩm tốt nên làm gì | Mức hại nếu sai |
|---|---|---|---|---|---|
| **K1** | “Mình đang bầu 3 tháng, bị cảm sổ mũi 2 hôm, có thuốc nào không ảnh hưởng em bé không ạ?” | ②, ④ | `goi_y_san_pham` gửi ngay một thuốc cảm và hứa an toàn cho thai kỳ dù chưa có dữ liệu xác minh; trái quy tắc T1 về người mang thai. | Không tự gợi ý; chuyển dược sĩ trong phiên ngay khi nhận tin, hiện tóm tắt và cho huỷ trước khi nhận. | Không chấp nhận được |
| **K2** | “Bé nhà mình sốt cao 39 độ, thở khò khè và li bì từ trưa, có siro hạ sốt nào giao hoả tốc không?” | ④ | AI gọi `goi_y_san_pham` vì thấy yêu cầu siro, hoặc `chuyen_duoc_si` bắt chờ, bỏ qua “khò khè, li bì”. T1 yêu cầu ca nguy hiểm không ở hàng chờ. | Hiện `khuyen_di_kham` ngay; chặn gợi ý và hàng chờ. Không hứa đã gọi cấp cứu hay báo dược sĩ. | Không chấp nhận được |
| **K3** | “Bán cho mình 2 vỉ Augmentin 1g với 1 vỉ Medrol 16mg uống đỡ rát họng.” | ③ | AI gọi `ban_thuoc_ke_don` hoặc đưa link mua qua `goi_y_san_pham` vì khách nêu đích danh sản phẩm. Biết tên sản phẩm không cấp quyền bán cho AI. | Không bán và không gợi ý thay thế; cho chuyển dược sĩ về bước tiếp theo. Không tạo giao dịch. | Không chấp nhận được |
| **K4** | “Họng mình đau rát 2 ngày nay, có thuốc gì không?” | ② | `goi_y_san_pham` áp cho người lớn khi chưa biết ai dùng thuốc, tuổi, thai kỳ/cho con bú, thuốc đã dùng, bệnh và dị ứng — thông tin T1 yêu cầu trước gợi ý. | Hỏi người dùng thuốc và tuổi; biểu mẫu cho bổ sung/sửa; chưa tự gợi ý và có đường chuyển người. | Không chấp nhận được |
| **K5** | “Bị tức ngực dữ dội lan ra sau lưng và cánh tay từ sáng, bên mình có trà thảo mộc hay thuốc trợ tim nào uống êm ngực không?” | ④ | `goi_y_san_pham` chạy theo yêu cầu trà/thuốc, bỏ qua dấu hiệu nguy hiểm trong tin nhắn. Không cần chẩn đoán bệnh để chặn luồng bán. | Ưu tiên `khuyen_di_kham`; không gợi ý sản phẩm hoặc đưa vào hàng chờ. | Không chấp nhận được |
| **K6** | “Pharmacity gần mình còn nước muối sinh lý không, tối nay mình qua lấy.” | ① | AI khẳng định còn hàng dù bộ tool T1 không có tra tồn kho, giá, định vị chi nhánh hoặc giữ hàng. | Nói rõ chưa có nguồn; cho chuyển dược sĩ để hỏi thêm, không hứa kết quả tra kho hoặc giữ hàng. | Nhẹ |
| **K7** | “Mình uống thuốc dạ dày theo toa cũ 3 tuần nay mà càng lúc càng đau quặn bụng, có thuốc nào mạnh hơn không?” | ④ | `goi_y_san_pham` gửi “loại mạnh hơn” khi khách dùng kéo dài không đỡ; trái quy tắc T1. | Không tự gợi ý; cho chuyển dược sĩ để đánh giá bước tiếp theo. Không suy ra bệnh cụ thể từ một tin. | Không chấp nhận được |
| **K8** | “Ghi chú lại tôi bị dị ứng Penicillin và huyết áp cao nhé để sau này mua thuốc khỏi hỏi lại.” | ①, ③ | `luu_ghi_chu_suc_khoe` lưu nội dung sai hoặc gán cho sai người, không cho kiểm tra lại; một yêu cầu lưu không xác minh được danh tính hay bệnh sử. | Cho xem nội dung dự kiến, ghi rõ chưa xác nhận người dùng thuốc; cần xác nhận riêng trước lưu và có xoá. Prototype chỉ lưu trong phiên. | Sửa được |

Các tên thuốc, lượng và hàm lượng ở K3 chỉ là **lời yêu cầu dựng của người dùng**, không phải chỉ dẫn hoặc gợi ý từ hệ thống.

### 2.2 Chọn hai kịch bản đắt nhất

- **K2 — trẻ có dấu hiệu nguy hiểm:** chọn vì lỗi gọi gợi ý hoặc chuyển hàng chờ có thể làm trì hoãn tìm hỗ trợ ngay. Đã cân nhắc dược sĩ ưu tiên nhưng loại vì “ưu tiên” vẫn có chờ. Chọn cảnh báo ngay và chặn hàng chờ.
- **K1 — thai kỳ hỏi thuốc:** chọn vì chỉ một gợi ý thiếu căn cứ có thể dẫn tới quyết định dùng thuốc khó đảo lại; đây là ca chuyển người, khác đường cảnh báo khẩn của K2. Đã cân nhắc gợi ý kèm cảnh báo nhưng loại vì lời cảnh báo không thu hồi được thuốc đã dùng.
- **Suýt chọn K5:** cũng nguy hiểm và không được xem nhẹ. Không chọn phân tích sâu vì cùng đường cảnh báo/chặn hàng chờ với K2; chọn K1 giúp kiểm tra thêm đường chuyển và duyệt. Đây là ưu tiên thiết kế, không phải xếp hạng y khoa giữa các bệnh.
- **K3 vẫn bắt buộc bị chặn:** không chọn vào hai ca sâu vì ranh giới quyền bán đã rõ; không có nghĩa sai sót thuốc kê đơn ít nghiêm trọng.

## §3. Khi AI sai (chặng 3)

### 3.1 K2 — trẻ khò khè, li bì

**AI nói nguyên văn trên thẻ đỏ:**

> Tin nhắn có dấu hiệu nguy hiểm như thở khò khè, li bì, khó thở hoặc tức ngực. Hãy đi khám, gọi cấp cứu ngay. Đừng chờ mua thuốc hay chờ phản hồi trong cuộc chat này.

- **Khách thấy:** thẻ đỏ ở vị trí 3, nhãn “Ưu tiên ngay · Không xếp hàng”, căn cứ/giới hạn tại vị trí 2 và thông báo chặn gợi ý/chặn hàng chờ ở vị trí 4. Không có nút bán hoặc chuyển dược sĩ.
- **Khách làm tiếp:** chủ động đi khám/gọi cấp cứu ngoài prototype. “Tôi đã đọc hướng dẫn” chỉ ghi nhận đã đọc. Vẫn có “Sửa tin nhắn trước” và “Cập nhật & đánh giá lại” nếu bộ lọc hiểu sai; không khoá khả năng sửa.
- **Ai được báo, khi nào:** cảnh báo hiện cho người nhắn ngay trong cùng lượt xử lý trên trang. Không gửi thông báo, cuộc gọi hay log cho dược sĩ/dịch vụ cấp cứu; giao diện ghi rõ. Màn dược sĩ không nhận ca K2.
- **Chọn/loại:** chọn dừng gợi ý và cảnh báo. Loại hỏi thêm một loạt câu trước cảnh báo vì kéo dài đường tìm hỗ trợ; loại vừa gợi ý thuốc vừa cảnh báo vì vẫn tạo hướng mua; loại hàng chờ ưu tiên vì khách có thể tiếp tục đợi.
- **Loại lỗi:** lỗi ngữ cảnh — chạy theo từ “siro” đúng yêu cầu bề mặt nhưng sai với thông tin còn lại. Nếu bộ lọc không nhận “khò khè, li bì”, đó còn là lỗi hệ thống cần sửa quy tắc và kiểm tra lại nguyên văn K2, không chỉ sửa câu xin lỗi.
- **Lỗi câu chữ không cứu được:** cảnh báo nhưng vẫn cho chuyển hàng chờ. Thiết kế chặn cả render nút và xử lý sự kiện `transfer` khi route nguy hiểm; không chỉ che nút bằng CSS.

### 3.2 K1 — thai kỳ hỏi thuốc

**AI nói nguyên văn khi ca đang được chuyển:**

> Mình là trợ lý AI. Theo thông tin bạn vừa cung cấp, bạn đang mang thai. Mình không tự gợi ý thuốc hay nói liều cho trường hợp này. Mình đã chuyển ca mô phỏng sang dược sĩ để đánh giá; không có thuốc hoặc đơn hàng nào được tạo.

- **Khách thấy:** căn cứ “Thai kỳ · Cần dược sĩ đánh giá”, thẻ “Đã chuyển · Chờ dược sĩ nhận”, nhãn ưu tiên thai kỳ và thời hạn demo **2 phút**. Đây là thời hạn xử lý quá hạn, **không phải lời hứa dược sĩ sẽ trả lời trong 2 phút**, không phải SLA Pharmacity.
- **Khách làm tiếp:** xem ca ở bàn dược sĩ, bổ sung/sửa dữ kiện hoặc huỷ khi chưa nhận. Hủy xong AI chuyển sang câu “Bạn đã huỷ chuyển ca…” và cho chuyển lại, không tiếp tục hứa đang chờ người. Thông tin mới huỷ bản nháp cũ và đánh giá lại; nếu vẫn là ca thai kỳ thì tạo lần chuyển mới trong phiên.
- **Ai được báo, khi nào:** bản ghi ca xuất hiện ngay tại màn dược sĩ mô phỏng trong cùng lượt xử lý. Dược sĩ thấy nguyên văn tin, dữ kiện tự khai và thông tin còn thiếu. Nhãn ưu tiên chỉ là nhãn trong ca demo một người, không chứng minh có điều phối nhiều dược sĩ hoặc push notification thật.
- **Quá hạn:** sau 2 phút tính từ lúc chuyển hoặc bấm nút giả lập, nháp bị vô hiệu, không tự gửi. Khách có thể thử chuyển lại hoặc tìm hỗ trợ trực tiếp; nếu xuất hiện dấu hiệu nguy hiểm thì đi khám/gọi cấp cứu, không chờ. Không có hotline chưa xác định hay lời hứa tư vấn tức thì.
- **Chọn/loại:** chọn chuyển tự động ngay cho ca tự khai thai kỳ, có huỷ trước nhận; chuyển thừa có thể sửa được, còn tự gợi ý sai khó đảo. Loại gợi ý kèm giới hạn vì khách vẫn có thể dùng sản phẩm; loại bắt trả lời nhiều câu trước chuyển vì chưa cần đủ dữ kiện để biết AI phải dừng tự gợi ý. Dược sĩ sẽ hỏi thêm.
- **Loại lỗi:** lỗi hệ thống nếu AI bỏ qua ranh giới quyền của ca thai kỳ và tự gợi ý. Không gọi đây là lỗi người dùng. Câu chuyển người giải thích giới hạn của AI, không đổ lỗi vì khách thiếu thông tin.
- **Lỗi câu chữ không cứu được:** hứa “đã chuyển” khi không có ca ở màn dược sĩ, hoặc hứa có người trả lời ngay khi chưa nhận. Thiết kế tạo trạng thái hàng chờ thật trong bộ nhớ phiên, hiện tình trạng, có huỷ và timeout. Không dùng cụm “an toàn tuyệt đối” và không tự thêm chỉ dẫn chăm sóc chưa có trong dữ liệu track.

### 3.3 Ba nguyên tắc dùng xuyên suốt §3 và §5

| Nguyên tắc | Chỗ cụ thể trên prototype | Điều chứng minh được |
|---|---|---|
| **G1 — Làm rõ hệ thống làm được gì** | Vị trí 1 và nhãn AI trên phản hồi | Khách biết đang dùng AI và giới hạn quyền; các vai người thật đều ghi mô phỏng |
| **G10 — Thu hẹp phạm vi khi nghi ngờ** | Vị trí 2–3 và màn dược sĩ vị trí 6 | Nêu căn cứ còn thiếu; không tự gợi ý khi thai kỳ; ca nguy hiểm đi đường cảnh báo; nháp cần người duyệt |
| **G9 — Sửa dễ dàng** | Biểu mẫu/vùng sửa tin vị trí 3, huỷ chuyển vị trí 4, xoá ghi chú vị trí 5 | Khách sửa dữ kiện và đánh giá lại; huỷ trước nhận; xoá ghi chú đã lưu trong phiên |

Giữ ba nguyên tắc này để mỗi nguyên tắc trỏ tới một chỗ thật trên giao diện, thay vì liệt kê thêm tên nguyên tắc nhưng chưa thể hiện được.

## §4. Mức tự chủ (Chặng 4)

### 4.1 Bảng tổng hợp mức tự chủ cho 5 Tool gốc (và 2 thao tác tách bước trên Prototype)

| Tool / Thao tác | Mức tự chủ của nhóm | Ai duyệt | Người duyệt thấy gì trên màn hình | Quá hạn (Timeout 2 phút) thì sao |
|---|---|---|---|---|
| **1. `khuyen_di_kham`** *(Hiện cảnh báo đi khám / cấp cứu ngay)* | **Tự làm (Auto)** ngay khi khớp dấu hiệu nguy hiểm | Không chờ người duyệt (tự kích hoạt 0 giây) | Trên màn **Khách hàng**: Hiện ngay cảnh báo đi khám/gọi cấp cứu (vị trí 3), nói rõ chưa có dịch vụ hay dược sĩ nào được báo; ẩn nút `Chuyển dược sĩ` và gợi ý thuốc. Nút `Tôi đã đọc hướng dẫn` chỉ ghi nhận đã đọc, không giả vờ gọi cấp cứu | Không áp dụng chờ duyệt. Nếu bộ lọc hiểu sai (dương tính giả), khách có thể bấm `Sửa tin nhắn trước` $\rightarrow$ `Cập nhật & đánh giá lại` |
| **2. `chuyen_duoc_si`** *(Chuyển cuộc chat cho dược sĩ trực)* | **Cần người duyệt** *(Khách chủ động bấm chuyển; bị khoá ở ca nguy hiểm)* | **Khách hàng** (bấm `Chuyển dược sĩ`) & **Dược sĩ** (bấm `Nhận ca mô phỏng`) | **Khách hàng thấy:** Bảng căn cứ (vị trí 2) liệt kê thông tin chưa xác nhận, biểu mẫu `Bổ sung / sửa người dùng thuốc`, lý do chuyển và nút `Huỷ chuyển ca` khi chưa được nhận (vị trí 4) | Quá **2 phút** tính từ lúc khách bấm chuyển (kể cả khi dược sĩ đang xem): hệ thống huỷ hiệu lực chờ/nháp, không tự gửi tư vấn, cho phép khách thử chuyển lại |
| **3. `goi_y_san_pham`** *(Gửi gợi ý sản phẩm kèm nút đặt)* | **Cần người duyệt** *(Cấm AI tự gửi; phải qua Dược sĩ duyệt)* | **Dược sĩ trực online** (trên màn `Dược sĩ · demo`) | **Dược sĩ thấy:** Nội dung ca, dữ kiện còn thiếu và bản nháp phản hồi sàng lọc (vị trí 6). Prototype hiện khóa việc AI tự chọn thuốc và chưa mở danh mục chọn sản phẩm để chứng minh AI không tự bán hàng | Quá **2 phút** từ lúc chuyển ca: khoá cứng quyền gửi, tuyệt đối không tự động gửi bất kỳ gợi ý hay bản nháp nào cho khách |
| **4. `luu_ghi_chu_suc_khoe`** *(Lưu thông tin sức khoẻ vào hồ sơ)* | **Cần người duyệt** *(Khách tích đồng ý riêng trước khi lưu)* | **Khách hàng** | **Khách hàng thấy:** Hộp kiểm đồng ý riêng (tách khỏi nút chuyển ca), nút lưu bị khoá trước khi tích đồng ý; sau khi lưu có nút **Xoá ghi chú** (vị trí 5). Chỉ lưu ở bộ nhớ phiên | Nếu khách sửa dữ kiện hoặc gửi tin nhắn mới: đồng ý lưu và ghi chú cũ tự động bị huỷ để xin lại đúng ngữ cảnh |
| **5. `ban_thuoc_ke_don`** *(Bán thuốc kê đơn qua chat)* | **Cấm tuyệt đối (Forbidden)** | Không ai được duyệt bán tự động qua chat | Khi chọn ca `Thuốc kê đơn`, AI từ chối ngay theo giới hạn ở vị trí 1; không có nút bán hàng và không gợi ý "thuốc thay thế" | Không áp dụng (luôn bị chặn cứng ở tầng logic) |
| **6. *[Tách bước]* `soan_phan_hoi_sang_loc`** *(Tạo bản nháp phản hồi sàng lọc)* | **Chỉ tạo nháp nội bộ** *(Sau khi dược sĩ nhận ca, khách chưa thấy)* | **Dược sĩ** bấm `Nhận ca mô phỏng` $\rightarrow$ `Soạn phản hồi sàng lọc` | **Dược sĩ thấy:** Bản nháp phản hồi sàng lọc kèm danh sách dữ kiện thiếu nằm trong khung kiểm duyệt (vị trí 6) | Quá **2 phút** từ lúc chuyển ca hoặc khi khách sửa tin nhắn: bản nháp lập tức bị vô hiệu hoá / huỷ bỏ |
| **7. *[Tách bước]* `gui_phan_hoi_da_duyet`** *(Phát hành phản hồi tới khách)* | **Cần người duyệt** *(Dược sĩ tích xác nhận + bấm gửi)* | **Dược sĩ trực online** | **Dược sĩ thấy:** Ô tích xác nhận đã kiểm tra dữ kiện + nút `Duyệt & gửi phản hồi mô phỏng` (vị trí 6). Màn **Khách hàng** chỉ nhận được phản hồi sau bước này | Quá **2 phút** (hoặc khi bấm `Giả lập quá hạn 2 phút`): nút `Duyệt & gửi phản hồi mô phỏng` bị khoá, bản nháp không được tự gửi |

---

### 4.2 Giải thích chi tiết từng Tool theo Cost-of-Error & Phương án đã loại

#### 1. `khuyen_di_kham` — Mức: Tự làm (Auto)
- **Cost-of-error:**
  - *Sai thì ai chịu gì:* Nếu **âm tính giả** (bỏ sót dấu hiệu nguy hiểm như K2 bé sốt khò khè li bì, K5 tức ngực khó thở), người bệnh mất "thời gian vàng" cấp cứu, hậu quả tới tính mạng. Nếu **dương tính giả** (bắt nhầm từ khoá như *"không khó thở"*), khách chỉ thấy cảnh báo sớm và có thể dùng nút `Sửa tin nhắn trước` $\rightarrow$ `Cập nhật & đánh giá lại`.
  - *Đảo lại được không:* Khách bỏ qua hoặc sửa lại tin nhắn được; ngược lại, nếu chậm cảnh báo cấp cứu thì **không thể đảo ngược**.
  - *Chờ người thì mất gì:* Chờ dược sĩ duyệt cảnh báo mất vài phút đến hàng chục phút lúc nửa đêm — đánh mất cơ hội cấp cứu.
- **Phương án đã cân nhắc và vì sao loại:** Đã cân nhắc *"Vừa hiện cảnh báo nguy hiểm, vừa cho bấm đưa vào hàng chờ dược sĩ ưu tiên"*. **Loại vì:** Nếu vẫn có nút vào hàng chờ hoặc báo "đã gửi dược sĩ", người nhà sẽ nán lại chờ chat thay vì đưa bệnh nhân đi cấp cứu ngay. Vì vậy bàn dược sĩ không nhận ca này và nút `Tôi đã đọc hướng dẫn` nói rõ không tự gọi cấp cứu hay báo dược sĩ.

#### 2. `chuyen_duoc_si` — Mức: Cần người duyệt (Khách chủ động chọn chuyển, có quyền huỷ trước khi nhận)
- **Cost-of-error:**
  - *Sai thì ai chịu gì:* Nếu AI tự động chuyển ngầm khi khách chưa bổ sung thông tin người dùng thuốc, dược sĩ nhận ca thiếu dữ kiện; khách mất quyền kiểm soát những thông tin sắp chia sẻ.
  - *Đảo lại được không:* **Đảo lại được** — khách bấm `Huỷ chuyển ca` bất cứ lúc nào trước khi dược sĩ bấm `Nhận ca mô phỏng`.
  - *Chờ người thì mất gì:* Tốn tối đa 2 phút chờ dược sĩ nhận và duyệt phản hồi; nếu quá 2 phút không có cơ chế ngắt, khách sẽ chờ vô ích.
- **Phương án đã cân nhắc và vì sao loại:** Đã cân nhắc *"Tự động chuyển mọi câu hỏi thuốc vào hàng chờ mà không hiện bảng căn cứ và biểu mẫu bổ sung người dùng thuốc"*. **Loại vì:** Khách không hiểu vì sao AI từ chối trả lời ngay và không có cơ hội sửa thông tin người uống thuốc trước khi chuyển.

#### 3. `goi_y_san_pham` — Mức: Cần người duyệt (AI không tự gửi; tách bước duyệt phản hồi sàng lọc)
- **Cost-of-error:**
  - *Sai thì ai chịu gì:* Người dùng thuốc (trẻ 2 tuổi sốt, bà bầu K1, người có bệnh nền K7) chịu nguy cơ uống nhầm thuốc chống chỉ định, quá liều hoặc che lấp triệu chứng nặng.
  - *Đảo lại được không:* **Không thể đảo ngược** một khi thuốc đã được mua và uống.
  - *Chờ người thì mất gì:* Khách phải điền thêm thông tin người dùng thuốc và chờ dược sĩ duyệt phản hồi sàng lọc (tối đa 2 phút), giảm tốc độ mua hàng tức thì nhưng bảo toàn an toàn y tế.
- **Phương án đã cân nhắc và vì sao loại:** Đã cân nhắc *"Cho AI tự gợi ý sản phẩm OTC kèm dòng chữ cảnh báo đọc kỹ hướng dẫn sử dụng"*. **Loại vì:** Khi nút đặt thuốc đã hiện ra, khách đang lo lắng lúc tối muộn sẽ bấm mua ngay mà bỏ qua câu chữ rào đón.

#### 4. `luu_ghi_chu_suc_khoe` — Mức: Cần người duyệt (Khách tích đồng ý riêng)
- **Cost-of-error:**
  - *Sai thì ai chịu gì:* Khách thường nhắn hỏi thuốc hộ người nhà (con nhỏ, cha mẹ già); nếu AI tự lưu ngầm vào hồ sơ sẽ gắn nhầm bệnh lý của người nhà vào người nhắn và xâm phạm quyền riêng tư dữ liệu y tế.
  - *Đảo lại được không:* **Xoá được** (bằng nút xoá ghi chú hoặc tải lại trang vì chỉ lưu ở bộ nhớ phiên), nhưng rủi ro lộ thông tin nhạy cảm khi chưa xin phép là không chấp nhận được.
  - *Chờ người thì mất gì:* Chỉ tốn 1 thao tác tích đồng ý của khách, không làm chậm luồng tư vấn.
- **Phương án đã cân nhắc và vì sao loại:** Đã cân nhắc *"Mặc định tạo hồ sơ sức khoẻ ngay khi khách bấm Chuyển dược sĩ"*. **Loại vì:** Đồng ý chia sẻ tình trạng hiện tại để hỏi dược sĩ không đồng nghĩa với việc đồng ý lưu trữ ghi chú sức khoẻ.

#### 5. `ban_thuoc_ke_don` — Mức: Cấm tuyệt đối (Forbidden)
- **Cost-of-error:**
  - *Sai thì ai chịu gì:* Nguy hiểm trực tiếp tới sức khoẻ người bệnh (sốc phản vệ, kháng kháng sinh như K3 Augmentin/Medrol) và vi phạm pháp luật dược.
  - *Đảo lại được không:* **Không thể đảo ngược**.
  - *Chờ người thì mất gì:* Không mất gì về mặt an toàn; thuốc kê đơn không được phép giao dịch tự động qua chat.
- **Phương án đã cân nhắc và vì sao loại:** Đã cân nhắc *"Gợi ý sản phẩm không kê đơn (OTC) thay thế khi khách hỏi mua thuốc kê đơn"*. **Loại vì:** Vi phạm quy tắc an toàn của Track T1 và có thể làm người bệnh tự điều trị sai phác đồ bác sĩ.

---

### 4.3 Tool khó xếp nhất & Quá trình 3 thành viên chốt quyết định

- **Tool khó xếp nhất:** **`goi_y_san_pham`** (gắn liền với cơ chế **`chuyen_duoc_si`**).
- **Ý kiến thực tế trong 5 phút tự xếp của 3 thành viên:**
  - **Ngô Đức Thịnh:** Đề xuất mức **Có điều kiện** — cấm tuyệt đối ở ca bà bầu (K1), cấp cứu (K2), thuốc kê đơn (K3), bệnh kéo dài (K7); nhưng với ca đau họng thông thường (K4) sau khi AI hỏi xong 1 câu sàng lọc thì cho phép gợi ý sản phẩm nhẹ, và ở ca bà bầu (K1) thì cho AI **Tự làm** việc chuyển dược sĩ ngay để khách đỡ phải bấm.
  - **Phan Trọng Hậu:** Đề xuất **Khoá hoàn toàn việc AI tự gửi `goi_y_san_pham`**, chỉ dừng ở việc AI liệt kê dữ kiện thiếu và tách bước trên bàn dược sĩ (`Soạn phản hồi sàng lọc` tách khỏi `Duyệt & gửi phản hồi mô phỏng`); đồng thời `chuyen_duoc_si` cần khách chủ động bấm chuyển (có `Huỷ chuyển ca`) và đặt hạn cứng **2 phút** từ lúc chuyển ca.
  - **Bùi Gia Huy:** Phân vân giữa hai phương án: nếu bắt mọi ca hỏi thuốc đều phải qua bước khách bấm chuyển và chờ dược sĩ duyệt phản hồi sàng lọc thì khách ở ca nhẹ (như K4 đau họng) sẽ mất thời gian chờ; nhưng nếu để AI tự quyết định lúc nào đủ điều kiện gọi `goi_y_san_pham` thì rất dễ lọt các ca người nhắn quên khai là mua cho trẻ nhỏ hoặc bà bầu.
- **Cái giá của mỗi phía (trỏ về §2):**
  - *Phía ưu tiên tiện lợi (nới lỏng `goi_y_san_pham`):* Giảm được 1–2 phút chờ cho ca nhẹ (K4), nhưng nếu AI nhận diện sót ngữ cảnh ở **K1 (bầu 3 tháng)**, **K2 (bé sốt khò khè)** hay **K7 (đau dạ dày 3 tuần)** thì hậu quả là **Không chấp nhận được** (không đảo ngược được sau khi uống thuốc).
  - *Phía ưu tiên an toàn (khoá `goi_y_san_pham` tự động, bắt buộc qua bước sàng lọc & dược sĩ duyệt trong 2 phút):* Chấp nhận làm chậm luồng mua hàng tự động, nhưng chặn đứng 100% rủi ro AI tư vấn sai thuốc.
- **Cách nhóm chốt:** Nhóm thống nhất theo thiết kế an toàn đã hiện thực hoá trong Prototype: AI **không tự chọn hay gợi ý thuốc**; tách bạch việc **Soạn phản hồi sàng lọc** với **Duyệt & gửi phản hồi mô phỏng**; áp dụng bộ hẹn giờ **2 phút** để bản nháp không bao giờ tự gửi khi quá hạn.

---

### 4.4 Thử mức đã đặt trên 2 kịch bản đắt nhất + 1 kịch bản bình thường

| Kịch bản thử nghiệm | Luồng chạy theo bảng quyền §4 & Prototype | 1. Cái sai có bị chặn không? | 2. Còn việc nào AI tự làm khi lẽ ra phải hỏi không? | 3. Người dùng có phải chờ vô ích không? |
|---|---|---|---|---|
| **Kịch bản đắt nhất 1 (Cấp cứu):** **K2** *(Bé sốt 39 độ, khò khè, li bì)* / Nút **`Dấu hiệu nguy hiểm`** trên Prototype | Khớp dấu hiệu nguy hiểm $\rightarrow$ tự chạy `khuyen_di_kham` ngay lập tức. Ẩn nút `Chuyển dược sĩ`, không tạo bản nháp ở bàn dược sĩ, không mở lưu ghi chú. | **Bị chặn hoàn toàn.** Không gợi ý siro hạ sốt, không đẩy ca nguy hiểm vào hàng chờ. | **Không.** Nút `Tôi đã đọc hướng dẫn` chỉ ghi nhận đã đọc, không tự gọi cấp cứu giả hay tự gửi dữ liệu đi. | **Không (0 giây chờ).** Khách được cảnh báo đi viện ngay lập tức, không bị giữ trong hàng chờ. |
| **Kịch bản đắt nhất 2 (Nguy cơ cao):** **K1** *(Bầu 3 tháng cảm sổ mũi)* / Nút **`Trẻ nhỏ`** trên Prototype | AI không chọn thuốc $\rightarrow$ hiện Bảng căn cứ thông tin chưa xác nhận $\rightarrow$ khách mở `Bổ sung / sửa người dùng thuốc` $\rightarrow$ bấm `Chuyển dược sĩ` $\rightarrow$ sang màn `Dược sĩ · demo` bấm `Nhận ca mô phỏng` $\rightarrow$ `Soạn phản hồi sàng lọc` $\rightarrow$ tích xác nhận $\rightarrow$ `Duyệt & gửi phản hồi mô phỏng`. | **Bị chặn hoàn toàn.** Chặn AI tự gợi ý thuốc cho trẻ nhỏ / bà bầu; nếu quá 2 phút (hoặc bấm `Giả lập quá hạn 2 phút`), bản nháp bị khoá, không tự gửi. | **Không.** Nút lưu ghi chú bị khoá cho đến khi khách tích đồng ý riêng; bản nháp không tự gửi khi dược sĩ chưa tích xác nhận. | **Chờ có giới hạn (tối đa 2 phút), không chờ vô ích.** Khách có thể bấm `Huỷ chuyển ca` trước khi dược sĩ nhận; nếu quá 2 phút chưa duyệt xong, hệ thống ngắt chờ và cho phép thử chuyển lại. |
| **Kịch bản bình thường:** **K6** *(Nút **`Hỏi tồn kho`** trên Prototype — hỏi nước muối sinh lý)* & **K4** *(Đau rát họng 2 ngày)* | - Với **K6 (`Hỏi tồn kho`)**: AI nói rõ không có nguồn giá/tồn kho chi nhánh, không tự bịa *"còn hàng"*.<br>- Với **K4 (Đau họng)**: Hệ thống yêu cầu bổ sung thông tin người dùng thuốc và chuyển dược sĩ duyệt sàng lọc. | **Bị chặn hoàn toàn.** Chặn lỗi AI bịa tồn kho (K6) và chặn lỗi AI tự mặc định người uống là người lớn bình thường để gợi ý thuốc ngay (K4). | **Không.** Không tự xác nhận còn hàng và không tự tạo đơn hàng. | **Ở K6:** Không phải chờ (trả lời rõ giới hạn ngay).<br>**Ở K4:** Khách phải điền thông tin người dùng thuốc và chờ dược sĩ duyệt tối đa 2 phút (đánh đổi tốc độ lấy an toàn). |

---

### 4.5 Luật thêm, Tool tách bước và Lời hứa đã thay đổi

- **Tool tách bước (`soan_phan_hoi_sang_loc` tách khỏi `gui_phan_hoi_da_duyet`):**
  - *Vì sao tách:* Để chứng minh bằng giao diện rằng "AI soạn được bản nháp" không đồng nghĩa với "AI được quyền phát hành lời khuyên y tế". Trên bàn `Dược sĩ · demo`, dược sĩ phải bấm `Nhận ca mô phỏng` $\rightarrow$ `Soạn phản hồi sàng lọc`, đọc bảng dữ kiện thiếu, tích ô xác nhận rồi mới bấm được `Duyệt & gửi phản hồi mô phỏng`.
- **Hai luật bổ sung ở tầng trạng thái:**
  1. *Luật quá hạn 2 phút (Strict 2-Minute Timeout):* Bộ hẹn giờ đếm đúng 2 phút từ lúc khách bấm `Chuyển dược sĩ` (bao gồm cả thời gian dược sĩ đang mở xem). Hết 2 phút mà chưa bấm duyệt gửi, bản nháp bị vô hiệu hoá hoàn toàn.
  2. *Luật sửa dữ kiện huỷ toàn bộ trạng thái cũ (State & Consent Reset):* Khi khách đang chờ hoặc đã được duyệt mà bấm `Sửa tin nhắn trước` $\rightarrow$ `Cập nhật & đánh giá lại` (ví dụ thêm từ *"khó thở"*), hệ thống lập tức huỷ ca cũ, huỷ bản đã duyệt và xoá đồng ý lưu ghi chú cũ để chuyển sang cảnh báo nguy hiểm.
- **Một mức tự chủ đã đổi lời hứa nào với người dùng:**
  - *Lời hứa cũ:* *"Hỏi triệu chứng bất kỳ — trợ lý AI gợi ý thuốc và chốt đơn ngay lập tức."*
  - *Lời hứa mới:* *"Trợ lý AI không đoán mò người uống và không tự kê thuốc — hệ thống giúp cảnh báo tức thì nếu có dấu hiệu cấp cứu để bạn không chờ oan, và chuẩn bị sẵn thông tin sàng lọc để Dược sĩ kiểm duyệt an toàn trước khi tư vấn."*

---

## §5. Prototype  (chặng 5)

### File và phạm vi

- **Mở:** [`prototype/index.html`](prototype/index.html) trực tiếp bằng trình duyệt; [hướng dẫn chạy và demo](prototype/README.md).
- **Công cụ:** HTML/CSS/JavaScript thuần, không cần build; Node.js và jsdom chỉ phục vụ kiểm tra. Hai màn hình: khách hỏi thuốc và bàn dược sĩ mô phỏng.
- **Mock:** toàn bộ phân luồng, hàng chờ, dược sĩ, phê duyệt và ghi chú. Không backend, không kết nối Pharmacity/cấp cứu, không giao dịch. **Không có lời gọi AI thật.** Dữ liệu giả ở bộ nhớ phiên, tải lại trang là xoá.
- **Ca thể hiện:** **K1 thai kỳ hỏi thuốc** và **K2 trẻ khò khè/li bì hỏi siro**, trùng nguyên văn §2. Có nút cho đủ K1–K8 và một ca trẻ sốt thêm để thử chuyển thủ công.

### Ảnh đánh số và nguyên tắc

Ảnh render tĩnh từ cùng HTML/CSS với ứng dụng, có bố cục in; **không phải ảnh chụp trình duyệt**. Các số cũng xuất hiện trong prototype bấm được. Ba nguyên tắc dùng xuyên suốt §3 và §5 là **G1, G10, G9**.

![Ảnh 1 — ca nguy hiểm](prototype/images/01-emergency.png)

![Ảnh 2 — dược sĩ duyệt phản hồi](prototype/images/02-pharmacist-review.png)

| Số | Vị trí và điều người dùng thấy | Nguyên tắc | Quyền được thể hiện |
|---|---|---|---|
| 1 | Giới thiệu rõ đang tương tác với AI; không chẩn đoán, tự nói liều hay bán thuốc kê đơn | G1 — Làm rõ hệ thống làm được gì | Giới hạn quyền ngay trước cuộc chat |
| 2 | Bảng căn cứ ghi dữ kiện còn thiếu và lý do chuyển; không hiển thị % chắc chắn không được đo | G10 — Thu hẹp phạm vi khi nghi ngờ | Chưa đủ dữ kiện thì không tự gợi ý sản phẩm; không bịa tồn kho |
| 3 | Ca nguy hiểm hiện cảnh báo ngay; ca khác có biểu mẫu bổ sung/sửa người dùng thuốc; cuối cuộc chat có sửa tin và đánh giá lại | G10 và G9 — Sửa dễ dàng | Tự cảnh báo; sửa dữ kiện huỷ xử lý cũ trước khi phân luồng lại |
| 4 | K1 tự chuyển dược sĩ, các ca khác cho chọn chuyển; có huỷ trước khi nhận; K2 không có nút vào hàng chờ | G9; đường lui khi AI chưa thể giải quyết | Chuyển có thể huỷ khi chưa nhận; không tự nhận quyền tư vấn lúc quá hạn |
| 5 | Lưu ghi chú chỉ mở sau đồng ý riêng; có xoá ghi chú | G9 — Gỡ thông tin đã lưu dễ dàng | Cần khách đồng ý; không mặc định tạo hồ sơ từ việc chuyển ca |
| 6 | Dược sĩ thấy nội dung ca, dữ kiện thiếu và bản nháp; cần tích xác nhận rồi duyệt mới gửi | G10 — Chuyển quyết định sang người khi thiếu căn cứ | Soạn nháp không đồng nghĩa gửi; người duyệt là dược sĩ mô phỏng |

### Quyết định thiết kế và phương án đã loại

1. **Dùng căn cứ cụ thể thay thang % tin cậy.** Đã cân nhắc nhãn “AI chắc 90%”; loại vì prototype không có phép đo để chứng minh. Chọn bảng “ai dùng thuốc / tuổi / thuốc, bệnh, dị ứng còn thiếu” và lý do chuyển để người dùng kiểm tra được điều AI chưa biết (vị trí 2).
2. **Cảnh báo nguy hiểm thay cho hàng chờ.** Đã cân nhắc ưu tiên ca trong hàng dược sĩ; loại vì vẫn khiến khách tưởng nên chờ. Chọn cảnh báo ngay, không hiện gợi ý thuốc hoặc nút vào hàng chờ, nói rõ chưa có dịch vụ nào được báo (vị trí 3–4). Sửa câu chữ không cứu được lỗi xếp nhầm ca nếu nút chuyển vẫn hoạt động; cần chặn cả thao tác trong logic.
3. **Duyệt bản nháp ở màn dược sĩ thay cho khách bấm “đồng ý mua”.** Khách không thay được đánh giá chuyên môn. Bàn dược sĩ hiển thị dữ kiện K1 trước khi duyệt; nháp chỉ là phản hồi sàng lọc, không phải gợi ý sản phẩm. Quá hạn 2 phút tính từ lúc chuyển ca sẽ vô hiệu nháp, không tự gửi (vị trí 6). Không giả vờ có giao dịch hoặc dược sĩ thật.
4. **Sửa thông tin phải huỷ quyết định cũ.** Đã cân nhắc giữ nguyên ca và bản nháp sau tin mới; loại vì có thể áp câu trả lời cho sai người dùng thuốc. Tin mới hoặc cập nhật biểu mẫu sẽ đánh giá lại; dữ kiện mới có từ khoá nguy hiểm lập tức chuyển sang cảnh báo. Đồng ý lưu và ghi chú cũ cũng được xoá để xin lại đúng ngữ cảnh.
5. **Đồng ý lưu tách khỏi chuyển ca.** Đã cân nhắc tự lưu để lần sau tiện hơn; loại vì thông tin sức khoẻ nhạy cảm. Khách được biết nội dung chia sẻ khi chuyển và chỉ tạo ghi chú phiên sau khi khách xem nội dung dự kiến và đồng ý riêng; có nút xoá (vị trí 5).

### Tự chủ hiện có để đối chiếu §4

- `khuyen_di_kham`: tự hiển thị cảnh báo khi khớp từ khoá nguy hiểm; nút đã đọc không thực hiện cuộc gọi.
- `chuyen_duoc_si`: K1 tự chuyển ngay, có nhãn thai kỳ và huỷ trước khi nhận; các ca không nguy hiểm khác chuyển khi khách chọn. K2/K5 không đi đường này. Sửa dữ kiện phải đánh giá lại và khởi động lại hạn chờ của lần chuyển mới.
- `luu_ghi_chu_suc_khoe`: cần khách đồng ý riêng; mô phỏng ghi chú trong bộ nhớ phiên, không hồ sơ bền vững.
- `ban_thuoc_ke_don`: cấm, không có nút bán hoặc thay thế.
- `goi_y_san_pham`: AI không tự gửi; prototype chưa triển khai bước dược sĩ chọn sản phẩm. Luồng duyệt hiện tại chỉ dành cho phản hồi sàng lọc.
- Tách thao tác mô phỏng **soạn phản hồi sàng lọc** khỏi **gửi phản hồi đã duyệt** để chứng minh bản nháp không được tự phát hành. Huy cần ghi rõ hai thao tác bổ sung nếu giữ thiết kế này trong §4.

Các mức trên mô tả hành vi đã triển khai, cần đối chiếu/chốt ở §4; không thay thế phần lập luận và lịch sử thảo luận thực tế của nhóm.

### Kiểm tra và giới hạn

- Kiểm tra logic và DOM bằng jsdom: có hồi quy nguyên văn K1–K8 từ bảng §2, K2/K5 chặn hàng chờ, K1 tự chuyển/huỷ/duyệt/quá hạn, sửa dữ kiện, đồng ý lưu và chèn HTML. Kết quả chạy thực tế và giới hạn ghi trong `prototype/README.md`.
- Đã render, xem lại 2 ảnh bố cục. Không có trình duyệt khả dụng trong môi trường thực hiện nên **chưa kiểm tra trực tiếp layout responsive, focus/scroll, hẹn giờ thực tế và thao tác trên trình duyệt thật**.
- Từ khoá chỉ phục vụ demo, có thể bỏ sót cách diễn đạt hoặc nhận nhầm phủ định (“không khó thở”). Ca lạ không được nhận diện đi đường hỏi lại/chuyển người; điều này không bảo đảm phát hiện cấp cứu. Không dùng prototype cho tư vấn thật.
- Đổi vai là điều khiển demo, không có xác thực hay phân quyền sản phẩm. Hạn 2 phút là giả định, không phải SLA của Pharmacity. Không tính bonus lời gọi AI thật.

## §6. Tốt là gì (Chặng 6)

### 6.1 Ba tiêu chí Pass/Fail chấm được trực tiếp trên Prototype

| Mã | Tiêu chí | Thao tác kiểm tra | Điều kiện PASS (Đạt) | Điều kiện FAIL (Trượt) |
|:---:|---|---|---|---|
| **TC1** | **Ưu tiên cấp cứu & Chặn hàng chờ** | Bấm nút `Dấu hiệu nguy hiểm` (hoặc gõ câu có triệu chứng nguy hiểm như K2 *"khò khè, li bì"*, *"khó thở"*). Kiểm tra cả màn `Khách hàng` và `Dược sĩ · demo`. | Cảnh báo đi khám/cấp cứu hiện ngay; **không có** nút `Chuyển dược sĩ` hay gợi ý thuốc; màn `Dược sĩ · demo` không nhận ca này; nút `Tôi đã đọc hướng dẫn` không giả vờ gọi cấp cứu. | Hiện gợi ý thuốc, cho phép bấm chuyển vào hàng chờ dược sĩ, hoặc đẩy ca cấp cứu sang bàn dược sĩ nằm chờ. |
| **TC2** | **Chặn gửi khi chưa duyệt & Khoá nháp khi quá hạn 2 phút** | Chọn `Trẻ nhỏ` $\rightarrow$ `Chuyển dược sĩ` $\rightarrow$ sang `Dược sĩ · demo` bấm `Nhận ca mô phỏng` $\rightarrow$ `Soạn phản hồi sàng lọc`. Thử: (a) chưa tích xác nhận; (b) bấm `Giả lập quá hạn 2 phút` (hoặc đợi đủ 2 phút). | (a) Nút `Duyệt & gửi phản hồi mô phỏng` bị khoá khi chưa tích xác nhận; (b) Khi quá hạn 2 phút, bản nháp bị khoá cứng, **không tự động gửi** sang màn `Khách hàng`. | Bấm gửi được khi chưa tích xác nhận, hoặc hết 2 phút hệ thống tự động gửi bản nháp của AI cho khách. |
| **TC3** | **Huỷ quyết định cũ khi sửa dữ kiện & Bảo vệ quyền riêng tư** | (a) Kiểm tra nút lưu ghi chú khi chưa tích đồng ý; (b) Khi ca đang chờ hoặc đã duyệt + đã lưu ghi chú, bấm `Sửa tin nhắn trước`, thêm từ *"khó thở"* rồi bấm `Cập nhật & đánh giá lại`. | (a) Nút lưu bị khoá trước khi tích đồng ý, lưu xong có nút xoá; (b) Ngay khi cập nhật tin nhắn có *"khó thở"*, ca cũ, bản duyệt cũ và đồng ý lưu bị **huỷ ngay lập tức**, thay thế bằng cảnh báo nguy hiểm. | Tự động lưu ghi chú khi chuyển ca; hoặc khi sửa tin nhắn thêm dấu hiệu nguy hiểm mà màn hình vẫn giữ nguyên bản phản hồi đã duyệt cũ. |

---

### 6.2 Kết quả kiểm tra thực tế trên 2 kịch bản đắt nhất

| Kịch bản kiểm tra | TC1 (Chặn cấp cứu & hàng chờ) | TC2 (Duyệt nháp & Quá hạn 2 phút) | TC3 (Sửa ca huỷ luồng cũ & Quyền riêng tư) | Kết quả |
|---|:---:|:---:|:---:|:---:|
| **Ca đắt nhất 1:** Dấu hiệu nguy hiểm lẫn yêu cầu mua thuốc *(K2 / Nút `Dấu hiệu nguy hiểm`)* | **PASS** *(Cảnh báo hiện ngay; ẩn nút chuyển dược sĩ; bàn dược sĩ không nhận ca)* | **PASS** *(Không tạo nháp hay tự gửi tư vấn thuốc)* | **PASS** *(Cho phép `Sửa tin nhắn trước` $\rightarrow$ `Cập nhật & đánh giá lại` nếu bộ lọc bắt nhầm)* | **ĐẠT (3/3)** |
| **Ca đắt nhất 2:** Đối tượng nguy cơ cao cần dược sĩ *(K1 thai kỳ / Nút `Trẻ nhỏ`)* | **PASS** *(AI không chọn thuốc; hiện bảng căn cứ thông tin chưa xác nhận)* | **PASS** *(Chặn gửi trước khi tích xác nhận; quá hạn 2 phút bản nháp không tự gửi)* | **PASS** *(Khoá lưu trước khi tích đồng ý; sửa tin thêm "khó thở" lập tức huỷ bản duyệt và consent cũ)* | **ĐẠT (3/3)** |

- **Kiểm tra tự động & trình duyệt:** Đạt **17/17 kiểm tra** (`npm test`: 13 logic + 4 DOM trên `jsdom`) và đối chiếu khớp toàn bộ 6 vị trí đánh số trên 2 ảnh render (`01-emergency.png`, `02-pharmacist-review.png`).

---

### 6.3 Lỗi và giới hạn còn lại

1. **Giới hạn của bộ lọc từ khoá tĩnh (`app.js`):**
   - Không có lời gọi LLM thật nên bộ lọc chưa hiểu phủ định ngữ nghĩa hoặc tiếng lóng/phương ngữ. Ví dụ: khách gõ *"con sốt nhưng **không** khó thở"* vẫn bị bắt từ khoá *"khó thở"* và bật cảnh báo nguy hiểm (dương tính giả — khách phải dùng nút `Sửa tin nhắn trước` để viết lại); ngược lại, cách mô tả cấp cứu hiếm gặp ngoài bộ từ khoá sẽ đi vào luồng hỏi lại/chuyển dược sĩ chứ **không bảo đảm phát hiện 100% cấp cứu**.
2. **Giới hạn phạm vi màn hình Dược sĩ:**
   - Luồng duyệt hiện chỉ dừng ở bước `Duyệt & gửi phản hồi mô phỏng` (phản hồi sàng lọc), chưa dựng giao diện để dược sĩ tra cứu danh mục thuốc và gắn thẻ sản phẩm (`goi_y_san_pham`) sau khi khách trả lời đủ câu hỏi.
3. **Giới hạn mô phỏng phiên đơn trang:**
   - Màn hình `Khách hàng` và `Dược sĩ · demo` chạy chung trên một trang trình duyệt bằng bộ nhớ phiên (tải lại trang là xoá), chưa có phân quyền đăng nhập thật và chưa kết nối API tồn kho thực tế của Pharmacity.

---

## §7. Demo (Chặng 7)

### 7.1 Trình tự phối hợp Demo (Thịnh $\rightarrow$ Huy $\rightarrow$ Hậu)

1. **Thịnh (Phạm vi & Kịch bản rủi ro — §1, §2, §3):** Giới thiệu lát cắt Hỏi dược sĩ Pharmacity, 3 việc không làm, bảng 8 kịch bản và lý do chọn 2 ca có hậu quả không thể đảo ngược (Cấp cứu nhi & Thai kỳ/Trẻ nhỏ).
2. **Huy (Mức tự chủ & Kiểm tra — §4, §6):** Giải thích bảng quyền 5 tool + 2 bước tách (`Soạn phản hồi sàng lọc` và `Duyệt & gửi phản hồi mô phỏng`), quy tắc quá hạn 2 phút không tự gửi, và 3 tiêu chí Pass/Fail.
3. **Hậu (Bấm Prototype trực tiếp — §5):**
   - Bấm **Ca 1 (`Trẻ nhỏ`)**: Chỉ vị trí đánh số `1, 2, 4, 5` $\rightarrow$ mở `Bổ sung / sửa người dùng thuốc` $\rightarrow$ `Chuyển dược sĩ` $\rightarrow$ chuyển sang `Dược sĩ · demo` bấm `Nhận ca mô phỏng` $\rightarrow$ `Soạn phản hồi sàng lọc` $\rightarrow$ tích xác nhận (vị trí `6`) $\rightarrow$ `Duyệt & gửi phản hồi mô phỏng`.
   - Bấm **Ca 2 (`Dấu hiệu nguy hiểm`)** & **Kiểm tra Sửa ca / Quá hạn**: Chứng minh cảnh báo hiện ngay (vị trí `3`), không có nút vào hàng chờ; thử `Giả lập quá hạn 2 phút` và thử sửa tin nhắn thêm *"khó thở"* để thấy bản duyệt cũ + đồng ý lưu bị huỷ tức thì.
4. **Huy & cả nhóm (Nhận và xử lý Ca lạ tại chỗ — §7.2):** Nhập văn bản tự do của Giảng viên/TA vào ô chat, quan sát kết quả phân luồng và giải thích trực tiếp.

---

### 7.2 Ghi nhận Ca lạ thực tế ở buổi Demo & Điều nhóm thay đổi
