/* Prototype dữ liệu giả. Không gọi AI, không backend, không lưu bền vững. */
(function (root) {
  'use strict';
  const presets = {
    pregnancy: 'Mình đang bầu 3 tháng, bị cảm sổ mũi 2 hôm, có thuốc nào không ảnh hưởng em bé không ạ?',
    danger: 'Bé nhà mình sốt cao 39 độ, thở khò khè và li bì từ trưa, có siro hạ sốt nào giao hoả tốc không?',
    rx: 'Bán cho mình 2 vỉ Augmentin 1g với 1 vỉ Medrol 16mg uống đỡ rát họng.',
    throat: 'Họng mình đau rát 2 ngày nay, có thuốc gì không?',
    chest: 'Bị tức ngực dữ dội lan ra sau lưng và cánh tay từ sáng, bên mình có trà thảo mộc hay thuốc trợ tim nào uống êm ngực không?',
    normal: 'Pharmacity gần mình còn nước muối sinh lý không, tối nay mình qua lấy.',
    prolonged: 'Mình uống thuốc dạ dày theo toa cũ 3 tuần nay mà càng lúc càng đau quặn bụng, có thuốc nào mạnh hơn không?',
    privacy: 'Ghi chú lại tôi bị dị ứng Penicillin và huyết áp cao nhé để sau này mua thuốc khỏi hỏi lại.',
    child: 'Con mình 2 tuổi sốt từ tối qua, có thuốc gì không?'
  };
  const copy = {
    emergency: 'Tin nhắn có dấu hiệu nguy hiểm như thở khò khè, li bì, khó thở hoặc tức ngực. Hãy đi khám, gọi cấp cứu ngay. Đừng chờ mua thuốc hay chờ phản hồi trong cuộc chat này.',
    pregnancyQueued: 'Mình là trợ lý AI. Theo thông tin bạn vừa cung cấp, bạn đang mang thai. Mình không tự gợi ý thuốc hay nói liều cho trường hợp này. Mình đã chuyển ca mô phỏng sang dược sĩ để đánh giá; không có thuốc hoặc đơn hàng nào được tạo.',
    pregnancyPaused: 'Mình là trợ lý AI. Trường hợp mang thai cần dược sĩ đánh giá; mình không tự gợi ý thuốc hay nói liều. Bạn đã huỷ chuyển ca và có thể chuyển lại khi muốn.',
    vulnerable: 'Mình là trợ lý AI. Trường hợp này cần dược sĩ đánh giá trước khi gợi ý sản phẩm. Mình chưa xác nhận đủ thông tin người dùng thuốc và sẽ không tự chọn thuốc hay nói liều. Bạn có thể bổ sung thông tin hoặc chuyển dược sĩ.',
    rx: 'Mình không thể bán thuốc kê đơn hoặc gợi ý thuốc thay thế qua chat tự động. Bạn có thể chuyển dược sĩ để được hướng dẫn bước tiếp theo. Không có giao dịch nào được tạo.',
    info: 'Mình chưa có dữ liệu giá và tồn kho để xác nhận sản phẩm còn ở cửa hàng gần bạn. Bạn có thể chuyển dược sĩ để kiểm tra thông tin; mình không tạo đơn hay hứa giữ hàng.',
    privacy: 'Bạn có thể kiểm tra nội dung ghi chú ở mục Quyền riêng tư. Chỉ khi bạn tích đồng ý riêng và bấm Lưu ghi chú, ghi chú mô phỏng mới được tạo trong phiên này. Chưa có hồ sơ sức khoẻ nào được lưu bền vững.',
    unknown: 'Mình chưa đủ thông tin để gợi ý sản phẩm. Người sẽ dùng thuốc là ai và bao nhiêu tuổi? Nếu có dấu hiệu nguy hiểm, hãy nêu ngay; bạn có thể chuyển dược sĩ bất cứ lúc nào.'
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d').toLowerCase();
  function classify(text) {
    const t = normalize(text);
    // Bắt từ khoá theo hướng thận trọng. Không suy luận chẩn đoán hay độ an toàn.
    if (/kho tho|kho khe|li bi|lo mo|dau nguc|tuc nguc|bat tinh|co giat|tim tai/.test(t)) return 'danger';
    if (/mang thai|dang bau|thai phu/.test(t)) return 'pregnancy';
    if (/khang sinh|ke don|khong co don|amoxicillin|augmentin|medrol|thuoc huyet ap/.test(t)) return 'rx';
    if (/ghi chu|luu.*(di ung|suc khoe|benh)/.test(t)) return 'privacy';
    if (/\b(be|tre)\b|\bcon\s+(minh|toi|em|\d+)\b|\b(ba|me|bo|ong|cu)\b|cho con bu|di ung|benh man|nhieu ngay|khong do|khong khoi|tuan nay|manh hon/.test(t)) return 'vulnerable';
    if (/nuoc muoi|gia|con hang|ton kho/.test(t)) return 'info';
    return 'unknown';
  }
  const initial = () => ({view:'customer', text:'',route:'start',stage:'new',note:false,consent:false,reply:'',event:'',draft:false,profile:{patient:'',age:'',history:''}});
  function reduce(s, event) {
    let next = {...s};
    switch (event.type) {
      case 'submit': {
        const text = String(event.text || '').trim().slice(0,1500);
        if (!text) return {...s,event:'Hãy nhập tin nhắn hoặc chọn một ca mẫu.'};
        const route=classify(text);
        return {...initial(),text,route,stage:route==='pregnancy'?'queued':'new',event:route==='pregnancy'?'Đã chuyển ca thai kỳ mô phỏng ngay trong phiên. Có thể huỷ trước khi dược sĩ nhận.':s.text?'Thông tin đã đổi: huỷ bản duyệt và yêu cầu chuyển cũ. Hãy kiểm tra lại.':''};
      }
      case 'view': return {...s,view:event.view};
      case 'profile': {
        const route=classify([s.text,event.profile.patient,event.profile.age,event.profile.history].join(' '));
        return {...s,profile:event.profile,route,draft:false,reply:'',note:false,consent:false,stage:route==='pregnancy'?'queued':'new',event:route==='pregnancy'?'Đã cập nhật và chuyển lại ca thai kỳ mô phỏng. Bản duyệt cũ đã huỷ.':'Đã cập nhật và đánh giá lại thông tin trong phiên. Chưa gửi cho dược sĩ.'};
      }
      case 'transfer':
        if (['danger','privacy'].includes(s.route) || !s.text || s.stage!=='new') return s;
        return {...s,stage:'queued',draft:false,event:'Đã chuyển ca mô phỏng. Có thể huỷ khi dược sĩ chưa nhận.'};
      case 'undo':
        if(s.stage!=='queued')return s;
        return {...s,stage:'new',draft:false,event:'Đã huỷ chuyển ca mô phỏng.'};
      case 'accept':
        if(s.stage!=='queued'||s.route==='danger')return s;
        return {...s,stage:'review',event:'Dược sĩ mô phỏng đã nhận ca.'};
      case 'timeout':
        if(!['queued','review'].includes(s.stage))return s;
        return {...s,stage:'timeout',draft:false,reply:'',event:'Hết thời gian chờ mô phỏng. Không có gợi ý nào được tự gửi.'};
      case 'retry':
        if(s.stage!=='timeout')return s;
        return {...s,stage:'queued',event:'Đã thử chuyển lại trong mô phỏng.'};
      case 'draft':
        if(s.stage!=='review'||s.route==='danger')return s;
        return {...s,draft:true,event:'Đã tạo bản nháp. Chưa gửi cho khách.'};
      case 'approve':
        if(s.stage!=='review'||!s.draft||!event.confirm||s.route==='danger'||!event.reply?.trim())return s;
        return {...s,stage:'answered',reply:event.reply.trim().slice(0,1000),draft:false,event:'Dược sĩ mô phỏng đã duyệt và gửi phản hồi.'};
      case 'consent': return {...s,consent:!!event.checked};
      case 'save':
        if(!s.consent||!s.text)return {...s,event:'Cần đồng ý riêng trước khi lưu ghi chú.'};
        return {...s,note:true,event:'Đã lưu ghi chú mô phỏng trong bộ nhớ phiên.'};
      case 'deleteNote': return {...s,note:false,consent:false,event:'Đã xoá ghi chú mô phỏng.'};
      case 'ack': return {...s,event:'Đã ghi nhận bạn đọc cảnh báo. Bạn không được đưa vào hàng chờ.'};
      case 'reset': return initial();
      default: return next;
    }
  }
  function sidebar(s) {
    if(s.view==='pharmacist'&&(s.stage==='new'||s.route==='danger'))return '<aside class="side"><section class="card"><h2>Chưa có nội dung được chuyển</h2><p class="small">Ca chưa chuyển hoặc đã huỷ không hiển thị dữ kiện ở bàn dược sĩ. Ca nguy hiểm không vào hàng chờ.</p></section></aside>';
    const reason = {
      start:['Chưa có tin nhắn','Hãy bắt đầu bằng một tình huống giả.'],
      pregnancy:['Thai kỳ · Cần dược sĩ đánh giá','Tin nhắn tự khai đang mang thai. Ca được chuyển tự động trong mô phỏng; chưa phải xác minh y tế.'],
      privacy:['Cần đồng ý lưu riêng','Kiểm tra nội dung ghi chú trước khi xác nhận. Không tự tạo hồ sơ sức khoẻ.'],
      danger:['Có từ khoá nguy hiểm', 'Tin nhắn có dấu hiệu cần ưu tiên. Bộ lọc từ khoá không xác minh được tình trạng thực tế.'],
      vulnerable:['Cần dược sĩ đánh giá','Có thể liên quan người dùng thuốc cần thận trọng. AI không tự chọn sản phẩm.'],
      rx:['Ngoài quyền bán tự động','Yêu cầu liên quan thuốc kê đơn. Không bán hay gợi ý thuốc thay thế qua AI.'],
      info:['Thiếu nguồn tồn kho','Prototype không có công cụ tra giá hoặc tồn kho. Không xác nhận còn hàng.'],
      unknown:['Chưa đủ thông tin','Chưa biết đủ về người dùng thuốc và triệu chứng. Không đoán sản phẩm.']
    }[s.route];
    return `<aside class="side"><section class="card"><h2><span class="num">2</span>Căn cứ & giới hạn</h2><span class="label ${s.route==='danger'?'red':'amber'}">${reason[0]}</span><p class="readonly">${reason[1]}</p><ul class="facts"><li><b>Người dùng thuốc</b>${escape(s.profile.patient||'Chưa xác nhận — không suy từ người nhắn')}</li><li><b>Tuổi</b>${escape(s.profile.age||'Chưa xác nhận')}</li><li><b>Thuốc đang dùng / bệnh / dị ứng</b>${escape(s.profile.history||'Chưa xác nhận')}</li></ul><p class="source">Căn cứ thiết kế: đề T1 · Hard tests và quy tắc chuyển dược sĩ. Không phải kết luận y khoa; không có % tin cậy giả định.</p></section><section class="card"><h2><span class="num">5</span>Quyền riêng tư</h2><p class="small">Thông tin nhập chỉ ở bộ nhớ trang. Đóng hoặc tải lại trang sẽ xoá. Chuyển ca chia sẻ nội dung phiên với dược sĩ mô phỏng, không tạo hồ sơ sức khoẻ.</p>${s.text&&s.view==='customer'?`<details><summary>Xem nội dung ghi chú</summary><p>${escape(s.text)}</p><p>Người dùng thuốc: ${escape(s.profile.patient||'Chưa xác nhận')} · Tuổi: ${escape(s.profile.age||'Chưa xác nhận')} · Thuốc/bệnh/dị ứng: ${escape(s.profile.history||'Chưa xác nhận')}</p></details>`:''}${s.view==='pharmacist'?`<p class="small">${s.note?'Khách đã đồng ý lưu ghi chú trong phiên.':'Khách chưa lưu ghi chú trong phiên.'} Việc đồng ý lưu và xoá do khách thực hiện ở màn Khách hàng.</p>`:s.note?`<div class="success">Ghi chú đã lưu trong phiên.</div><button data-action="deleteNote">Xoá ghi chú</button>`:`<label class="check"><input id="consent" type="checkbox" ${s.consent?'checked':''} ${!s.text?'disabled':''}>Tôi đồng ý lưu ghi chú sức khoẻ trong phiên mô phỏng.</label><button data-action="save" ${!s.consent||!s.text?'disabled':''}>Lưu ghi chú</button>`}</section></aside>`;
  }
  function screening(s) {
    return `<details ${s.route==='unknown'?'open':''}><summary><span class="num">3</span>Bổ sung / sửa người dùng thuốc</summary><p>Chỉ nhập dữ liệu giả. Dược sĩ sẽ hỏi thêm về mang thai/cho con bú, thời gian triệu chứng và thuốc đã dùng; biểu mẫu này không thay thế sàng lọc chuyên môn.</p><form id="profile-form"><div class="form-row"><div><label class="field" for="patient">Ai sẽ dùng thuốc?</label><input id="patient" name="patient" type="text" maxlength="80" value="${escape(s.profile.patient)}" placeholder="Ví dụ: con của tôi"></div><div><label class="field" for="age">Tuổi</label><input id="age" name="age" type="text" maxlength="30" value="${escape(s.profile.age)}" placeholder="Ví dụ: 2 tuổi"></div></div><label class="field" for="history">Thuốc đang dùng, bệnh, dị ứng (nếu biết)</label><input id="history" name="history" type="text" maxlength="250" value="${escape(s.profile.history)}" placeholder="Chưa rõ thì ghi chưa rõ"><div class="actions"><button type="submit">Cập nhật thông tin</button></div></form></details>`;
  }
  function customer(s) {
    const message = s.route==='pregnancy' ? (s.stage==='new'?copy.pregnancyPaused:copy.pregnancyQueued) : copy[s.route];
    let body='';
    if(s.route==='start') body=`<div class="empty"><span class="brand-icon">+</span><h2 class="stack">Bạn muốn hỏi cho ai?</h2><p class="small">Một tin nhắn có thể cần hỏi lại hoặc cần người đánh giá.<br>Hãy chọn ca mẫu bên dưới để thử.</p></div>`;
    else if(s.route==='danger') body=`<div class="alert" role="alert"><span class="label red">Ưu tiên ngay · Không xếp hàng</span><h2><span class="num">3</span>Cần hỗ trợ y tế ngay</h2><p>${copy.emergency}</p><p class="small">AI không xác minh được tình trạng và không gợi ý thuốc. Nếu bộ lọc hiểu sai tin nhắn, bạn có thể sửa thông tin bên dưới.</p><button class="danger-btn" data-action="ack">Tôi đã đọc hướng dẫn</button></div><div class="notice"><span class="num">4</span><b>Đã chặn gợi ý thuốc và chặn đưa vào hàng chờ.</b><p class="small stack">Chưa gửi thông báo cho dược sĩ hay dịch vụ cấp cứu. Prototype không thực hiện cuộc gọi. Người nhắn cần chủ động tìm hỗ trợ.</p></div>`;
    else body=`<div class="message ai"><strong>TRỢ LÝ AI · CHƯA PHẢI TƯ VẤN CỦA DƯỢC SĨ</strong>${message}</div>${s.route==='privacy'?'':`${s.stage==='new'||s.route==='pregnancy'?screening(s):''}${queue(s)}`}`;
    return `<section class="card"><div class="view-title"><h2>Cuộc trò chuyện</h2><span class="label">Khách · dữ liệu giả</span></div>${s.text?`<div class="message user"><strong>BẠN</strong>${escape(s.text)}</div>`:''}${body}${s.reply?`<div class="message ai"><strong>PHẢN HỒI ĐÃ ĐƯỢC DƯỢC SĨ MÔ PHỎNG DUYỆT</strong>${escape(s.reply)}</div>`:''}<hr class="divider"><form id="chat-form"><label class="field" for="message">${s.text?'Gửi thông tin mới / sửa tin trước':'Tin nhắn của bạn'}</label><textarea id="message" name="message" maxlength="1500" required placeholder="Chỉ nhập tình huống giả. Ca thai kỳ sẽ tự chuyển dược sĩ mô phỏng trong phiên."></textarea><div class="actions"><button type="submit" class="primary">${s.text?'Cập nhật & đánh giá lại':'Gửi tin nhắn'}</button>${s.text?'<button type="button" class="link" data-action="edit">Sửa tin nhắn trước</button>':''}</div></form><p class="small stack">Tin mới thay thế tin cũ: hãy nêu đủ tình huống. Hệ thống huỷ bản duyệt, yêu cầu chuyển và ghi chú cũ rồi đánh giá lại.</p><div class="preset" aria-label="Ca mẫu"><button data-preset="pregnancy">K1 · Thai kỳ</button><button data-preset="danger">K2 · Trẻ li bì, khò khè</button><button data-preset="rx">K3 · Thuốc kê đơn</button><button data-preset="throat">K4 · Đau họng</button><button data-preset="chest">K5 · Tức ngực</button><button data-preset="normal">K6 · Tồn kho</button><button data-preset="prolonged">K7 · Dùng kéo dài</button><button data-preset="privacy">K8 · Ghi chú</button><button data-preset="child">Ca thêm · Trẻ sốt</button></div></section>`;
  }
  function queue(s) {
    if(s.stage==='new')return `<div class="stack"><h3><span class="num">4</span>Chuyển người hỗ trợ</h3><p class="small">Khi chuyển, dược sĩ mô phỏng sẽ thấy tin nhắn và phần thông tin bạn đã bổ sung. Không tự tạo hồ sơ sức khoẻ.</p><button class="primary" data-action="transfer">Chuyển dược sĩ</button></div>`;
    if(s.stage==='queued')return `<div class="success stack"><h3><span class="num">4</span>Đã chuyển · Chờ dược sĩ nhận</h3><p class="small">Ca M-001${s.route==='pregnancy'?' · Nhãn ưu tiên thai kỳ':''} · Thời hạn demo: 2 phút. Không có gợi ý sản phẩm nào được tự gửi trong lúc chờ.</p><div class="actions"><button data-action="undo">Huỷ chuyển ca</button><button data-view="pharmacist">Xem bàn dược sĩ mô phỏng</button></div></div>`;
    if(s.stage==='review')return `<div class="notice"><span class="num">4</span><b>Dược sĩ đang xem ca mô phỏng.</b><p class="small stack">Chưa có phản hồi được duyệt. Nếu xuất hiện khó thở, lơ mơ hoặc dấu hiệu nguy hiểm, hãy đi khám / gọi cấp cứu ngay; đừng chờ chat.</p><button data-view="pharmacist">Xem bàn dược sĩ mô phỏng</button></div>`;
    if(s.stage==='timeout')return `<div class="notice"><h3><span class="num">4</span>Chưa có dược sĩ phản hồi</h3><p>Đã quá thời hạn demo 2 phút. AI không tự nhận quyền tư vấn hay tự gửi gợi ý. Bạn có thể thử chuyển lại hoặc tìm hỗ trợ y tế trực tiếp.</p><p class="small">Nếu có dấu hiệu nguy hiểm, đi khám / gọi cấp cứu ngay; không tiếp tục chờ chat.</p><button data-action="retry">Thử chuyển lại</button></div>`;
    return `<div class="success"><span class="num">4</span>Phản hồi đã duyệt · Không có đơn hàng được tạo.</div>`;
  }
  function pharmacist(s) {
    if(!s.text||s.route==='danger'||s.stage==='new')return `<section class="card empty"><h2>Bàn dược sĩ</h2><p>Chưa có ca trong hàng chờ.</p><p class="small">Ca có dấu hiệu nguy hiểm không được xếp hàng. Ca thai kỳ được chuyển tự động; các ca khác xuất hiện khi khách chọn chuyển. Đây là hàng chờ trong phiên, không phải dược sĩ thật.</p><button data-view="customer">Quay lại cuộc chat</button></section>`;
    const draft = s.route==='rx'?'Đây là phản hồi mô phỏng: không bán thuốc kê đơn qua AI. Vui lòng trao đổi trực tiếp với dược sĩ về yêu cầu và giấy tờ cần thiết.':s.route==='info'?'Đây là phản hồi mô phỏng: chưa có kết quả kiểm tra tồn kho. Không xác nhận còn hàng và không tạo đơn.':'Đây là phản hồi mô phỏng: cần hỏi thêm trước khi đưa ra gợi ý. Vui lòng xác nhận tuổi, thời gian triệu chứng, thuốc đã dùng, dị ứng và tình trạng liên quan. Chưa có chỉ định thuốc.';
    return `<section class="card"><div class="view-title"><h2><span class="num">6</span>Bàn dược sĩ · Ca M-001</h2><span class="label amber">Mô phỏng vai trò</span></div><p class="small">Màn hình demo, không có dược sĩ thật, không có xác thực tài khoản.</p><div class="review"><h3>Thông tin khách đã chia sẻ</h3><p>${escape(s.text)}</p><ul class="facts"><li><b>Người dùng thuốc / tuổi</b>${escape(s.profile.patient||'Chưa xác nhận')} / ${escape(s.profile.age||'Chưa xác nhận')}</li><li><b>Thuốc, bệnh, dị ứng</b>${escape(s.profile.history||'Chưa xác nhận')}</li><li><b>Lý do chuyển</b>${s.route==='pregnancy'?'Thai kỳ · Chuyển tự động, không tự gợi ý thuốc':s.route==='rx'?'Yêu cầu ngoài quyền bán tự động':s.route==='info'?'Thiếu nguồn tồn kho':'Chưa đủ thông tin để AI tự gợi ý'}</li></ul></div>${s.stage==='queued'?'<div class="actions"><button class="primary" data-action="accept">Nhận ca mô phỏng</button></div>':''}${s.stage==='review'?`<div class="notice stack"><b>AI chỉ soạn nháp, không tự gửi.</b><p class="small stack">Người duyệt phải kiểm tra đúng người dùng thuốc, dữ kiện còn thiếu và quyền hạn. Xác nhận của khách không thay thế phê duyệt chuyên môn.</p></div>${!s.draft?'<button data-action="draft">Soạn phản hồi sàng lọc</button>':`<form id="approve-form"><label class="field" for="reply">Bản nháp — chưa gửi</label><textarea id="reply" name="reply" maxlength="1000" required>${escape(draft)}</textarea><label class="check"><input id="review-confirm" name="confirm" type="checkbox" required>Tôi đã kiểm tra dữ kiện và duyệt phản hồi mô phỏng này.</label><button class="primary" type="submit">Duyệt & gửi phản hồi mô phỏng</button></form>`}`:''}${s.stage==='timeout'?'<div class="notice stack">Ca đã quá hạn. Không thể gửi bản nháp cũ. Khách có thể thử chuyển lại.</div>':''}${s.stage==='answered'?`<div class="success stack"><b>Đã duyệt và gửi</b><p class="stack">${escape(s.reply)}</p></div>`:''}<div class="actions"><button data-view="customer">Quay lại cuộc chat</button></div><p class="source">Không có nút bán thuốc kê đơn, đặt hàng hay gửi gợi ý sản phẩm tự động.</p></section>`;
  }
  function render(s) {
    return `<header class="topbar"><div class="brand"><span class="brand-icon" aria-hidden="true">+</span>Hỏi dược sĩ <span class="small">/ 3 miền</span></div><p class="app-note">Prototype học tập · Dữ liệu giả<br>Không kết nối Pharmacity hay dịch vụ y tế</p></header><main class="shell"><div class="intro"><div><span class="eyebrow">Hỗ trợ đúng lúc · Giữ quyền quyết định</span><h1>Hỏi rõ trước khi gợi ý.</h1><p><span class="num">1</span>Bạn đang tương tác với AI. AI hỗ trợ sàng lọc, không chẩn đoán, không tự nói liều hay bán thuốc kê đơn.</p></div><nav class="tabs" aria-label="Màn hình"><button data-view="customer" class="${s.view==='customer'?'active':''}" aria-pressed="${s.view==='customer'}">Khách hàng</button><button data-view="pharmacist" class="${s.view==='pharmacist'?'active':''}" aria-pressed="${s.view==='pharmacist'}">Dược sĩ · demo</button></nav></div><div class="toolbar"><span>Điều khiển demo · Không phải chức năng của khách</span><button data-action="timeout" ${!['queued','review'].includes(s.stage)?'disabled':''}>Giả lập quá hạn 2 phút</button><button data-action="reset">Bắt đầu lại / xoá phiên</button></div><div class="status-line" role="status" aria-live="polite" aria-atomic="true">${escape(s.event||'Không lưu dữ liệu sau khi tải lại trang. Chọn một ca mẫu để bắt đầu.')}</div><div class="layout"><div class="main">${s.view==='customer'?customer(s):pharmacist(s)}</div>${sidebar(s)}</div><footer class="footer">LAB5 · L3A · Track 1 · Nhóm 3 miền · Luồng mô phỏng, không gửi dữ liệu ra ngoài.</footer></main>`;
  }
  const api = {presets,copy,initial,reduce,classify,render,escape};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  if(root.document){
    let state=initial(); const app=document.getElementById('app'); let timer;
    function dispatch(event){
      const previous=state; state=reduce(state,event); app.innerHTML=render(state);
      if(state.stage==='queued'&&(previous.stage!=='queued'||event.type==='profile'||(event.type==='submit'&&String(event.text||'').trim()))) {clearTimeout(timer);timer=setTimeout(()=>dispatch({type:'timeout'}),120000);}
      if(!['queued','review'].includes(state.stage))clearTimeout(timer);
      if(event.type==='submit')app.querySelector('.alert, .message.ai, .empty')?.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
    app.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b||b.disabled)return;
      if(b.dataset.preset){dispatch({type:'submit',text:presets[b.dataset.preset]});return;}
      if(b.dataset.view){dispatch({type:'view',view:b.dataset.view});return;}
      if(b.dataset.action==='edit'){const field=document.getElementById('message');field.value=state.text;field.focus();return;}
      if(b.dataset.action)dispatch({type:b.dataset.action});
    });
    app.addEventListener('change',e=>{if(e.target.id==='consent'){
      // Không render lại toàn bộ để giữ nội dung tin đang soạn và focus.
      state=reduce(state,{type:'consent',checked:e.target.checked});
      const save=app.querySelector('[data-action="save"]');if(save)save.disabled=!state.consent||!state.text;
    }});
    app.addEventListener('submit',e=>{
      e.preventDefault();const data=new FormData(e.target);
      if(e.target.id==='chat-form')dispatch({type:'submit',text:data.get('message')});
      if(e.target.id==='profile-form')dispatch({type:'profile',profile:{patient:String(data.get('patient')).trim(),age:String(data.get('age')).trim(),history:String(data.get('history')).trim()}});
      if(e.target.id==='approve-form')dispatch({type:'approve',confirm:data.get('confirm')==='on',reply:String(data.get('reply'))});
    });
    app.innerHTML=render(state);
  }
})(typeof window==='undefined'?globalThis:window);
