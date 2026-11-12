# Bài nộp LAB5 — T1 — Y tế · Nhóm 3 miền

**Trạng thái:** §1–3 đã đồng bộ với prototype và §5; §4, §6 chờ hoàn thiện, §7 cập nhật sau demo.
**Lớp:** L3A · **Bàn / zone:** Chưa bổ sung · **Track:** T1

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
| Phan Trọng Hậu | 2A202603547 | Dựng prototype HTML/CSS/JS hai màn hình, luồng chuyển/duyệt/quá hạn/sửa tin và quyền riêng tư; tạo 2 ảnh render đánh số; viết §5 và hướng dẫn demo; Các kiểm tra logic/DOM đạt |
| Ngô Đức Thịnh | 2A202603548 | Viết phạm vi, 8 kịch bản rủi ro và UX cho hai ca trọng tâm tại §1–3; nội dung đã được đồng bộ với prototype |
| Bùi Gia Huy | 2A202603525 | Chưa ghi nhận |

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

## §4. Mức tự chủ  (chặng 4)
Với mỗi tool:
- Mức của nhóm (tự làm / cần người duyệt / cấm). Nếu cần người duyệt: ai duyệt · người duyệt thấy gì · quá hạn thì sao.
- Lý do theo cost-of-error: sai thì ai chịu gì · đảo lại được không · chờ người thì mất gì.
- Phương án đã cân nhắc và vì sao loại.
Thêm:
- Tool khó xếp nhất: mỗi người từng chọn gì, cái giá của mỗi phía (trỏ về kịch bản ở §2), nhóm chốt thế nào.
- Thử mức đã đặt trên 2 kịch bản đắt nhất + 1 kịch bản bình thường: cái sai có bị chặn không? còn việc nào làm khi lẽ ra phải hỏi? người dùng bình thường có phải chờ vô ích không?
- Luật thêm hoặc tool tách bước (nếu có), và vì sao.
- Một mức tự chủ đã đổi lời hứa nào với người dùng.

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

## §6. Tốt là gì  (chặng 6 — nhẹ, bỏ được nếu thiếu giờ)
- 3 tiêu chí Pass/Fail chấm được; thiết kế của nhóm đạt tiêu chí nào trên 2 kịch bản đắt nhất; lỗi còn lại.

## §7. Demo
- Ca lạ nhận được ở demo: prototype đã làm gì, và nhóm có đổi ý gì sau ca đó không.
