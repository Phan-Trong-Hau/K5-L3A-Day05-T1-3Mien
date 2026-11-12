# Bài nộp LAB5 — T1 — Y tế · Nhóm 3 miền

**Trạng thái:** Khung bài, chưa hoàn thành.
**Lớp:** L3A · **Bàn / zone:** Chưa bổ sung · **Track:** T1

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
| Phan Trọng Hậu | 2A202603547 | Dựng prototype HTML/CSS/JS hai màn hình, luồng chuyển/duyệt/quá hạn/sửa tin và quyền riêng tư; tạo 2 ảnh render đánh số; viết §5 và hướng dẫn demo; 17 kiểm tra logic/DOM đạt |
| Ngô Đức Thịnh | 2A202603548 | Chưa ghi nhận |
| Bùi Gia Huy | 2A202603525 | Chưa ghi nhận |

**Phân công dự kiến:** Hậu — prototype, tích hợp và §5; Thịnh — phạm vi, kịch bản, UX khi sai (§1–3); Huy — mức tự chủ, kiểm tra và demo (§4, §6–7). Cả nhóm cùng chốt quyết định. Xem [kế hoạch chi tiết](TASKS.md); bảng trên chỉ cập nhật việc thực tế đã làm.

## §1. Lát cắt & phạm vi
### 1.1 Lát cắt (Một câu chuẩn từ Track T1)
> Trong **kênh chat Hỏi dược sĩ của Pharmacity**, khi **khách** đang nhắn hỏi *"tôi (hoặc người nhà) bị X, có thuốc gì không"*, **AI tự trả lời và gợi ý sản phẩm, hỏi thêm câu sàng lọc, hay chuyển dược sĩ, khuyên đi khám ngay**, để người dùng thuốc không nhận sai sản phẩm và ca nguy hiểm không nằm trong hàng chờ.

### 1.2 Ba việc tính năng KHÔNG làm (Out-of-Scope) & Lý do
1. **Không kê đơn hoặc bán thuốc kê đơn (`ban_thuoc_ke_don`):**
   - *Vì sao:* Vi phạm nghiêm trọng Luật Dược Việt Nam. Thuốc kê đơn (kháng sinh, thuốc điều trị tim mạch, huyết áp, tiểu đường, thần kinh) bắt buộc phải qua thăm khám của bác sĩ và có đơn thuốc hợp lệ; việc AI tự bán qua chat là bất hợp pháp và đe dọa trực tiếp tính mạng người dùng.
2. **Không tự tính toán, chẩn đoán bệnh hoặc kê phác đồ liều lượng cụ thể:**
   - *Vì sao:* Liều dùng phụ thuộc chính xác vào tuổi, cân nặng thực tế, chỉ số men gan, độ lọc cầu thận và tiền sử dị ứng. Sai sót liều lượng có thể gây ngộ độc hoặc sốc phản vệ; AI chỉ được trích dẫn liều tiêu chuẩn từ bao bì nhà sản xuất hoặc hướng dẫn khách chờ dược sĩ/bác sĩ.
3. **Không giữ bệnh nhân cấp cứu trong luồng chat để tư vấn:**
   - *Vì sao:* Các ca có dấu hiệu đe dọa tính mạng (đau ngực dữ dội, khó thở, co giật, lơ mơ...) cần can thiệp y tế khẩn cấp tại bệnh viện. Mọi hành vi kéo dài thời gian hỏi han của AI sẽ đánh mất "thời gian vàng" cấp cứu của bệnh nhân.

---

## §2. Kịch bản rủi ro  (chặng 2)
### 2.1 Bảng ≥8 kịch bản rủi ro phủ đủ 4 lớp

*Bốn lớp chỗ khó:*  
① Nguồn sự thật (Bịa đặt / Thiếu căn cứ) · ② Mơ hồ / Thiếu thông tin · ③ Ngoài phạm vi / Thẩm quyền · ④ Đặc thù Y tế (Đe dọa tính mạng / Dùng kéo dài)

| Mã | Tin người dùng nhắn | Lớp | AI có thể sai thế nào (Bằng chứng cụ thể) | Một sản phẩm tốt nên làm gì | Nhãn mức hại |
|:---:|---|:---:|---|---|:---:|
| **K1** | *"Mình đang bầu 3 tháng, bị cảm sổ mũi 2 hôm, có thuốc nào không ảnh hưởng em bé không ạ?"* | ② Mơ hồ / Thiếu | AI gọi ngay tool `goi_y_san_pham` đưa thuốc cảm chứa hoạt chất co mạch *Phenylephrine/Pseudoephedrine* (chống chỉ định 3 tháng đầu thai kỳ vì nguy cơ dị tật thai và co thắt mạch tử cung). | Nhận diện đối tượng mang thai $\to$ Chặn tool `goi_y_san_pham`, kích hoạt `chuyen_duoc_si` ưu tiên, hướng dẫn biện pháp vật lý an toàn (xịt nước muối sinh lý). | **Không chấp nhận được** |
| **K2** | *"Bé nhà mình sốt cao 39 độ, thở khò khè và li bì từ trưa, có siro hạ sốt nào giao hoả tốc không?"* | ④ Đặc thù Y tế | AI nhận diện từ khoá "siro hạ sốt" $\to$ gọi ngay `goi_y_san_pham` và tạo đơn giao nhanh $\to$ bỏ qua cờ đỏ cấp cứu "thở khò khè, li bì ở trẻ nhỏ". | Nhận diện cờ đỏ cấp cứu nhi $\to$ Kích hoạt ngay `khuyen_di_kham`, đưa hotline 115 / danh sách viện gần nhất, từ chối bán thuốc trực tuyến, không đưa vào hàng chờ chat. | **Không chấp nhận được** |
| **K3** | *"Bán cho mình 2 vỉ Augmentin 1g với 1 vỉ Medrol 16mg uống đỡ rát họng."* | ③ Ngoài thẩm quyền | AI thấy trong kho có hàng $\to$ gọi `ban_thuoc_ke_don` hoặc `goi_y_san_pham` tạo link giỏ hàng vì khách ghi đích danh sản phẩm. | Nhận diện đây là kháng sinh & corticoid kê đơn $\to$ Từ chối bán tự động, giải thích quy định y tế, hiển thị nút tải ảnh toa thuốc của bác sĩ để dược sĩ duyệt. | **Không chấp nhận được** |
| **K4** | *"Họng mình đau rát 2 ngày nay, có thuốc gì không?"* | ② Mơ hồ / Thiếu | AI tự mặc định khách là người lớn bình thường $\to$ gọi ngay `goi_y_san_pham` kẹo ngậm hoặc NSAID giảm đau mà không hỏi đối tượng sử dụng thực tế. | Hỏi 1 câu sàng lọc cốt lõi: *"Thuốc dùng cho ai (người lớn hay trẻ em), người dùng có đang mang thai, cho con bú hay dị ứng thuốc nào không?"* trước khi gợi ý. | **Sửa được** |
| **K5** | *"Bị tức ngực dữ dội lan ra sau lưng và cánh tay từ sáng, bên mình có trà thảo mộc hay thuốc trợ tim nào uống êm ngực không?"* | ④ Đặc thù Y tế | AI hiểu máy móc theo yêu cầu tìm kiếm sản phẩm thảo mộc $\to$ gọi `goi_y_san_pham` trà thảo dược $\to$ khiến bệnh nhân nhồi máu cơ tim bỏ lỡ giờ vàng cấp cứu. | Nhận diện triệu chứng nhồi máu cơ tim $\to$ Lập tức gọi `khuyen_di_kham`, cảnh báo nguy hiểm đến tính mạng, hướng dẫn người nhà gọi cấp cứu 115 ngay lập tức. | **Không chấp nhận được** |
| **K6** | *"Pharmacity gần mình còn nước muối sinh lý không, tối nay mình qua lấy."* | ① Nguồn sự thật | AI suy diễn logic thông thường: "Nhà thuốc lớn chắc chắn luôn có nước muối" $\to$ khẳng định *"Còn hàng bạn nhé"* trong khi chi nhánh cụ thể của khách đã hết hàng. | Tra cứu dữ liệu tồn kho theo định vị chi nhánh; nếu không có kết nối tồn kho thời gian thực thì thông báo: *"Chưa thể kiểm tra kho chi nhánh X, bạn nên gọi hotline hoặc đặt giao tận nơi"*. | **Nhẹ** |
| **K7** | *"Mình uống thuốc dạ dày theo toa cũ 3 tuần nay mà càng lúc càng đau quặn bụng, có thuốc nào mạnh hơn không?"* | ④ Đặc thù Y tế | AI tìm kiếm các loại thuốc ức chế bơm proton (PPI) hoặc kháng acid thế hệ mới để gợi ý theo yêu cầu "thuốc mạnh hơn". | Nhận diện: Bệnh nhân dùng thuốc kéo dài không khỏi kèm triệu chứng trở nặng $\to$ Nguy cơ loét/thủng dạ dày $\to$ Chặn gợi ý, gọi `chuyen_duoc_si` và khuyến nghị tái khám chuyên khoa. | **Không chấp nhận được** |
| **K8** | *"Ghi chú lại tôi bị dị ứng Penicillin và huyết áp cao nhé để sau này mua thuốc khỏi hỏi lại."* | ① Nguồn sự thật & Bảo mật | AI tự động âm thầm gọi tool `luu_ghi_chu_suc_khoe` lưu thông tin nhạy cảm vào hồ sơ khi người dùng chưa xác thực danh tính và chưa đồng ý điều khoản bảo mật y tế. | Hiển thị thông báo xin đồng ý (Consent dialog) kèm tóm tắt nội dung sẽ lưu để người dùng chủ động bấm xác nhận lưu hồ sơ sức khoẻ cá nhân. | **Sửa được** |

### 2.2 Quyết định: 2 Kịch bản đắt nhất (Cost-of-Error cao nhất)

#### 1. Kịch bản K2 (Bé sốt cao kèm thở khò khè, li bì — Cấp cứu nhi):
- **Vì sao đắt nhất:** "Thở khò khè, li bì" ở trẻ nhỏ là dấu hiệu suy hô hấp cấp hoặc biến chứng thần kinh do sốt cao co giật. Nếu AI hành xử như bot bán hàng (lo gợi ý siro và hẹn giao hoả tốc 1-2 tiếng), trẻ có thể ngưng thở hoặc tổn thương não vĩnh viễn trước khi thuốc đến. Hậu quả là sinh mạng con người, **hoàn toàn không thể đảo ngược**.
- **Loại phương án đã cân nhắc:** Đã cân nhắc chuyển cho dược sĩ trực online chat tiếp, nhưng bị **loại bỏ** vì: Dược sĩ trực chat cũng không thể can thiệp cấp cứu từ xa; việc bắt phụ huynh chờ xếp hàng chat trực tuyến chỉ làm lãng phí thêm thời gian vàng cứu chữa.

#### 2. Kịch bản K1 (Phụ nữ mang thai 3 tháng đầu hỏi thuốc cảm cúm):
- **Vì sao đắt thứ hai:** Ba tháng đầu thai kỳ (tam cá nguyệt thứ nhất) là giai đoạn phôi thai phân chia tế bào và hình thành các cơ quan nội tạng. Các hoạt chất thông thường trị cảm sốt (như kháng viêm NSAID, Phenylephrine, Pseudoephedrine) có thể gây sảy thai, dị tật bẩm sinh hoặc quái thai suốt đời. Một nút bấm đặt thuốc vô tư từ AI mang lại hậu quả y khoa và pháp lý không thể khắc phục.
- **Loại phương án đã cân nhắc:** Đã cân nhắc việc AI tự gợi ý thuốc paracetamol đơn chất kèm cảnh báo; nhưng bị **loại bỏ** vì AI không thể kiểm chứng tình trạng thai nghén, chức năng gan hoặc bệnh lý đi kèm của thai phụ; chỉ có dược sĩ người thật mới đủ thẩm quyền tư vấn cho thai kỳ.

#### Kịch bản suýt được chọn & Vì sao không chọn:
- **K3 (Khách đòi mua kháng sinh Augmentin và Medrol không đơn):**
  - *Vì sao suýt chọn:* Việc bán kháng sinh bừa bãi là vi phạm pháp luật y tế nghiêm trọng và dẫn tới kháng kháng sinh diện rộng.
  - *Vì sao không chọn vào top 2:* Hậu quả của việc uống 1 liều kháng sinh sai thường không gây tử vong ngay lập tức hay dị tật vĩnh viễn trong vài giờ như tình trạng cấp cứu nhi (K2) hoặc thai kỳ 3 tháng đầu (K1).

---

## §3. Khi AI sai (Chặng 3)

### 3.1 Chi tiết kịch bản đắt nhất 1: K2 (Trẻ sốt cao, khò khè, li bì)

#### 1. Lời nói nguyên văn của AI & Giao diện hiển thị:
- **AI nói gì (nguyên văn):**
  > *"DẤU HIỆU CẦN ĐI VIỆN NGAY: Bé có biểu hiện 'thở khò khè và li bì' là dấu hiệu cảnh báo nguy hiểm ở trẻ nhỏ, KHÔNG NÊN tiếp tục tự theo dõi hay chờ mua thuốc giao tận nơi. Gia đình vui lòng đưa bé đến bệnh viện/phòng cấp cứu gần nhất hoặc gọi 115 ngay lập tức. Pharmacity xin phép từ chối đơn hàng này để đảm bảo an toàn cho bé."*
- **Người dùng thấy gì trên giao diện:**
  - Một **Banner cảnh báo đỏ (Red Alert Banner)** nổi bật trên đầu màn hình chat, kèm icon còi cứu thương.
  - **Nút hành động khẩn cấp:** Nút gọi nhanh `Gọi Cấp Cứu 115` và nút `Tìm Bệnh viện Nhi gần nhất` (mở bản đồ định vị).
  - Khung nhập tin nhắn và nút đặt giỏ hàng bị tạm khóa/ẩn đi để tránh đánh lạc hướng người dùng.
- **Người dùng làm gì tiếp theo:** Bấm gọi 115 hoặc bấm mở bản đồ bệnh viện gần nhất để đưa bé đi cấp cứu ngay.
- **Ai được báo, sau bao lâu:** Hệ thống kích hoạt log cờ đỏ cấp cứu gửi ngay lập tức (dưới 5 giây) về dashboard của Dược sĩ trưởng ca trực; lưu log hội thoại để phục vụ đối soát y tế.

#### 2. Quyết định hướng xử lý:
- **Chọn phương án:** **Dừng và Khuyên đi khám/Cấp cứu ngay (`khuyen_di_kham`)**.
- **Đã loại bỏ các phương án:**
  - *Loại bỏ phương án "Hỏi lại thêm thông tin (tuổi bé, cân nặng)":* Bị loại vì bé đang li bì, mỗi phút hỏi han qua lại đều làm trễ cơ hội cấp cứu.
  - *Loại bỏ phương án "Trả lời kèm giới hạn (vừa gợi ý siro vừa khuyên đi khám)":* Bị loại vì phụ huynh sẽ bấu víu vào hy vọng có siro giao đến mà chần chừ không đưa con đi viện.

#### 3. Loại lỗi & Cách thiết kế:
- **Loại lỗi:** **Lỗi ngữ cảnh (Context Error)** kết hợp đặc thù y tế. Về mặt kỹ thuật thông thường, người dùng hỏi mua "siro hạ sốt" thì bot tìm "siro" là đúng từ khoá, nhưng lại hoàn toàn sai và nguy hiểm trong ngữ cảnh lâm sàng của người bệnh.
- **Cách thiết kế:** Không dùng lời xin lỗi đơn thuần ("Xin lỗi tôi không thể bán thuốc..."). Giao diện phải chuyển hẳn sang chế độ bảo vệ tính mạng khẩn cấp: giải thích lý do từ chối dựa trên triệu chứng lâm sàng và cung cấp lối thoát an toàn (gọi 115).

#### 4. Nguyên tắc HAX/PAIR áp dụng (trỏ vào vị trí cụ thể):
- **HAX G10 (Thu hẹp phạm vi khi nghi ngờ / ngắt hành động nguy hiểm):** Thể hiện ở việc hệ thống tự động khóa nút mua siro hạ sốt hoả tốc, từ chối thực hiện giao dịch khi phát hiện triệu chứng nguy hiểm.
- **PAIR (Graceful Failure & Safety Critical Path):** Khi hệ thống AI không thể hỗ trợ bán hàng, nó không được "bỏ rơi" người dùng bằng thông báo lỗi vô dụng, mà chuyển hướng sang giải pháp cứu sinh: cung cấp nút gọi 115 và chỉ đường đến viện gần nhất.

#### 5. Lỗi sửa câu chữ không cứu được & Thiết kế cứu nó thế nào:
- *Lỗi:* Khách hàng hoảng loạn vẫn cố tình gõ tiếp đòi mua thuốc nhanh. Nếu AI chỉ trả lời bằng câu chữ lịch sự ("Rất tiếc chúng tôi khuyên bạn đi khám..."), phụ huynh có thể bỏ qua và tiếp tục nài nỉ mua thuốc.
- *Thiết kế cứu nó:* Khóa luồng mua hàng thông thường, ghim cố định Card khẩn cấp màu đỏ chiếm 50% khung nhìn chat và đẩy số hotline cấp cứu ra nút bấm vật lý 1 chạm.

---

### 3.2 Chi tiết kịch bản đắt nhất 2: K1 (Bầu 3 tháng cảm sổ mũi)

#### 1. Lời nói nguyên văn của AI & Giao diện hiển thị:
- **AI nói gì (nguyên văn):**
  > *"Em nhận thấy chị đang mang thai 3 tháng đầu — giai đoạn này dùng thuốc cần hết sức cẩn trọng để bảo đảm an toàn cho thai nhi. Để an toàn tuyệt đối cho mẹ và bé, hệ thống AI của Pharmacity không được phép tự gợi ý thuốc. Em đã chuyển phiên chat này sang cho Dược sĩ chuyên môn trực tiếp tư vấn cho chị ngay sau đây."*
- **Người dùng thấy gì trên giao diện:**
  - Một thẻ thông tin màu vàng cam: **"Đang kết nối Dược sĩ chuyên môn (Ưu tiên thai kỳ) - Dự kiến: 1-2 phút"**.
  - Hiển thị thông tin tóm tắt gửi cho Dược sĩ để khách yên tâm: *"Tình trạng: Mang thai 3 tháng, cảm sổ mũi 2 ngày"*.
  - Khuyến cáo an toàn tạm thời: *"Trong lúc chờ, chị có thể rửa mũi bằng nước muối sinh lý ấm và uống nhiều nước ấm. Tuyệt đối không tự ý dùng các loại thuốc cảm chứa hoạt chất thông mũi."*
- **Người dùng làm gì tiếp theo:** Nhìn thấy thời gian chờ ước tính, xem khuyến cáo tạm thời an toàn và chờ Dược sĩ người thật vào tiếp quản phiên chat.
- **Ai được báo, sau bao lâu:** Dược sĩ trực nhận thông báo đẩy "Ca ưu tiên thai phụ" ngay trong 30 giây, kèm tóm tắt thông tin đã sàng lọc.

#### 2. Quyết định hướng xử lý:
- **Chọn phương án:** **Dừng tự động gợi ý và Chuyển Dược sĩ (`chuyen_duoc_si`) có độ ưu tiên cao**.
- **Đã loại bỏ các phương án:**
  - *Loại bỏ phương án "Tự trả lời kèm giới hạn":* Bị loại vì không có bất kỳ thuật toán AI nào có thể đảm bảo 100% không tư vấn nhầm biệt dược có chống chỉ định trong thai kỳ.
  - *Loại bỏ phương án "Hỏi lại thêm 5-6 câu chuyên sâu":* Khách hàng là bà bầu đang mệt mỏi, hỏi vặn vẹo quá nhiều câu y khoa khiến họ nản lòng và dễ tự ra tiệm thuốc ngoài mua bừa.

#### 3. Loại lỗi & Cách thiết kế:
- **Loại lỗi:** **Lỗi ngoài phạm vi thẩm quyền của AI (Policy / Ethical Boundary Error)**.
- **Cách thiết kế:** Minh bạch tuyệt đối về năng lực của AI theo Điều 11 Luật AI Việt Nam. Nói rõ AI không được phép tư vấn ca này vì an toàn của khách hàng, chuyển tiếp mượt mà sang con người (Human-in-the-loop).

#### 4. Nguyên tắc HAX/PAIR áp dụng (trỏ vào vị trí cụ thể):
- **HAX G1 (Làm rõ hệ thống làm được gì và không làm được gì):** Thể hiện trực tiếp trong câu AI nói: *"Hệ thống AI không được phép tự gợi ý thuốc cho phụ nữ mang thai 3 tháng đầu"*.
- **HAX G2 (Làm rõ mức độ tự tin và giới hạn):** AI không cố đoán mò hay ra vẻ am hiểu, thừa nhận giới hạn y khoa và chuyển đúng người có chuyên môn.
- **PAIR (Explainability & Trust Building):** Thẻ thông tin hiển thị tóm tắt tình trạng gửi cho dược sĩ giúp khách hàng thấy dữ liệu của mình đã được hiểu đúng, tăng niềm tin vào hệ thống nhà thuốc.

#### 5. Lỗi sửa câu chữ không cứu được & Thiết kế cứu nó thế nào:
- *Lỗi:* Nếu dược sĩ trực quá tải hoặc khách phải đợi lâu (vài chục phút), khách sẽ thoát app và tự ra hiệu thuốc mua nhầm thuốc chống chỉ định.
- *Thiết kế cứu nó:* Thiết lập cơ chế **Auto-escalation & SLA**: Nếu sau 3 phút Dược sĩ chat chưa tiếp quản, hệ thống tự động cung cấp nút `Gọi hotline Dược sĩ miễn phí 1800...` để kết nối thoại ngay lập tức, kèm hướng dẫn chăm sóc không dùng thuốc được phê duyệt sẵn bởi hội đồng y khoa.

---


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
- **Ca thể hiện:** trẻ 2 tuổi sốt cần người đánh giá; người nhà khó thở/lơ mơ lẫn trong câu mua thuốc. Đây là hai ca dựng để triển khai; Thịnh và Huy cần đối chiếu với hai ca được nhóm chốt ở §2–4.

### Ảnh đánh số và nguyên tắc

Ảnh render tĩnh từ cùng HTML/CSS với ứng dụng, có bố cục in; **không phải ảnh chụp trình duyệt**. Các số cũng xuất hiện trong prototype bấm được. Ba nguyên tắc đang dùng để dựng là **G1, G10, G9**; Thịnh đối chiếu khi hoàn thiện §3.

![Ảnh 1 — ca nguy hiểm](prototype/images/01-emergency.png)

![Ảnh 2 — dược sĩ duyệt phản hồi](prototype/images/02-pharmacist-review.png)

| Số | Vị trí và điều người dùng thấy | Nguyên tắc | Quyền được thể hiện |
|---|---|---|---|
| 1 | Giới thiệu rõ đang tương tác với AI; không chẩn đoán, tự nói liều hay bán thuốc kê đơn | G1 — Làm rõ hệ thống làm được gì | Giới hạn quyền ngay trước cuộc chat |
| 2 | Bảng căn cứ ghi dữ kiện còn thiếu và lý do chuyển; không hiển thị % chắc chắn không được đo | G10 — Thu hẹp phạm vi khi nghi ngờ | Chưa đủ dữ kiện thì không tự gợi ý sản phẩm; không bịa tồn kho |
| 3 | Ca nguy hiểm hiện cảnh báo ngay; ca khác có biểu mẫu bổ sung/sửa người dùng thuốc; cuối cuộc chat có sửa tin và đánh giá lại | G10 và G9 — Sửa dễ dàng | Tự cảnh báo; sửa dữ kiện huỷ xử lý cũ trước khi phân luồng lại |
| 4 | Ca thường chuyển dược sĩ, có huỷ trước khi nhận; ca nguy hiểm không có nút vào hàng chờ | G9; đường lui khi AI chưa thể giải quyết | Chuyển có thể huỷ khi chưa nhận; không tự nhận quyền tư vấn lúc quá hạn |
| 5 | Lưu ghi chú chỉ mở sau đồng ý riêng; có xoá ghi chú | G9 — Gỡ thông tin đã lưu dễ dàng | Cần khách đồng ý; không mặc định tạo hồ sơ từ việc chuyển ca |
| 6 | Dược sĩ thấy nội dung ca, dữ kiện thiếu và bản nháp; cần tích xác nhận rồi duyệt mới gửi | G10 — Chuyển quyết định sang người khi thiếu căn cứ | Soạn nháp không đồng nghĩa gửi; người duyệt là dược sĩ mô phỏng |

### Quyết định thiết kế và phương án đã loại

1. **Dùng căn cứ cụ thể thay thang % tin cậy.** Đã cân nhắc nhãn “AI chắc 90%”; loại vì prototype không có phép đo để chứng minh. Chọn bảng “ai dùng thuốc / tuổi / thuốc, bệnh, dị ứng còn thiếu” và lý do chuyển để người dùng kiểm tra được điều AI chưa biết (vị trí 2).
2. **Cảnh báo nguy hiểm thay cho hàng chờ.** Đã cân nhắc ưu tiên ca trong hàng dược sĩ; loại vì vẫn khiến khách tưởng nên chờ. Chọn cảnh báo ngay, không hiện gợi ý thuốc hoặc nút vào hàng chờ, nói rõ chưa có dịch vụ nào được báo (vị trí 3–4). Sửa câu chữ không cứu được lỗi xếp nhầm ca nếu nút chuyển vẫn hoạt động; cần chặn cả thao tác trong logic.
3. **Duyệt bản nháp ở màn dược sĩ thay cho khách bấm “đồng ý mua”.** Khách không thay được đánh giá chuyên môn. Bàn dược sĩ hiển thị dữ kiện trước khi duyệt; nháp chỉ là phản hồi sàng lọc, không phải gợi ý sản phẩm. Quá hạn 2 phút tính từ lúc chuyển ca sẽ vô hiệu nháp, không tự gửi (vị trí 6). Không giả vờ có giao dịch hoặc dược sĩ thật.
4. **Sửa thông tin phải huỷ quyết định cũ.** Đã cân nhắc giữ nguyên ca và bản nháp sau tin mới; loại vì có thể áp câu trả lời cho sai người dùng thuốc. Tin mới hoặc cập nhật biểu mẫu sẽ đánh giá lại; dữ kiện mới có từ khoá nguy hiểm lập tức chuyển sang cảnh báo. Đồng ý lưu và ghi chú cũ cũng được xoá để xin lại đúng ngữ cảnh.
5. **Đồng ý lưu tách khỏi chuyển ca.** Đã cân nhắc tự lưu để lần sau tiện hơn; loại vì thông tin sức khoẻ nhạy cảm. Khách được biết nội dung chia sẻ khi chuyển và chỉ tạo ghi chú phiên sau đồng ý riêng; có nút xoá (vị trí 5).

### Tự chủ hiện có để đối chiếu §4

- `khuyen_di_kham`: tự hiển thị cảnh báo khi khớp từ khoá nguy hiểm; nút đã đọc không thực hiện cuộc gọi.
- `chuyen_duoc_si`: xử lý tự động sau khi khách chủ động chọn chuyển, có huỷ trước khi nhận. Ca nguy hiểm không đi đường này.
- `luu_ghi_chu_suc_khoe`: cần khách đồng ý riêng; mô phỏng ghi chú trong bộ nhớ phiên, không hồ sơ bền vững.
- `ban_thuoc_ke_don`: cấm, không có nút bán hoặc thay thế.
- `goi_y_san_pham`: AI không tự gửi; prototype chưa triển khai bước dược sĩ chọn sản phẩm. Luồng duyệt hiện tại chỉ dành cho phản hồi sàng lọc.
- Tách thao tác mô phỏng **soạn phản hồi sàng lọc** khỏi **gửi phản hồi đã duyệt** để chứng minh bản nháp không được tự phát hành. Huy cần ghi rõ hai thao tác bổ sung nếu giữ thiết kế này trong §4.

Các mức trên là giả định triển khai cần Huy đối chiếu/chốt ở §4, không phải lịch sử thảo luận đã diễn ra.

### Kiểm tra và giới hạn

- **17/17 kiểm tra đạt:** 13 logic + 4 DOM bằng jsdom. Có kiểm tra ưu tiên dấu hiệu nguy hiểm, chuyển/huỷ, chặn gửi trước xác nhận, quá hạn, sửa dữ kiện, đồng ý lưu và chèn HTML.
- Đã render, xem lại 2 ảnh bố cục. Không có trình duyệt khả dụng trong môi trường thực hiện nên **chưa kiểm tra trực tiếp layout responsive, focus/scroll, hẹn giờ thực tế và thao tác trên trình duyệt thật**.
- Từ khoá chỉ phục vụ demo, có thể bỏ sót cách diễn đạt hoặc nhận nhầm phủ định (“không khó thở”). Ca lạ không được nhận diện đi đường hỏi lại/chuyển người; điều này không bảo đảm phát hiện cấp cứu. Không dùng prototype cho tư vấn thật.
- Đổi vai là điều khiển demo, không có xác thực hay phân quyền sản phẩm. Hạn 2 phút là giả định, không phải SLA của Pharmacity. Không tính bonus lời gọi AI thật.

## §6. Tốt là gì  (chặng 6 — nhẹ, bỏ được nếu thiếu giờ)
- 3 tiêu chí Pass/Fail chấm được; thiết kế của nhóm đạt tiêu chí nào trên 2 kịch bản đắt nhất; lỗi còn lại.

## §7. Demo
- Ca lạ nhận được ở demo: prototype đã làm gì, và nhóm có đổi ý gì sau ca đó không.
