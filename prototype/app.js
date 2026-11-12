/* Prototype dữ liệu giả. Không gọi AI, không backend, không lưu bền vững. */
(function (root) {
  'use strict';
  const presets = {
    child: 'Con mình 2 tuổi sốt từ tối qua, có thuốc gì không?',
    danger: 'Cho mình mua thuốc ho, ba mình đang khó thở và lơ mơ.',
    pregnancy: 'Mình đang bầu 3 tháng, cảm sổ mũi 2 hôm, có thuốc nào không?',
    normal: 'Pharmacity gần mình còn nước muối sinh lý không, tối nay mình qua lấy.',
    rx: 'Mình muốn mua kháng sinh, không có đơn, bán giúp mình nhé.'
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d').toLowerCase();
  function classify(text) {
    const t = normalize(text);
    // Bắt từ khoá theo hướng thận trọng. Không suy luận chẩn đoán hay độ an toàn.
    if (/kho tho|lo mo|dau nguc|bat tinh|co giat|tim tai/.test(t)) return 'danger';
    if (/khang sinh|ke don|khong co don|amoxicillin|thuoc huyet ap/.test(t)) return 'rx';
    if (/\b(be|tre)\b|\bcon\s+(minh|toi|em|\d+)\b|\b(ba|me|bo|ong|cu)\b|mang thai|dang bau|cho con bu|di ung|benh man|nhieu ngay|khong do/.test(t)) return 'vulnerable';
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
        return {...initial(),text,route:classify(text),event:s.text?'Thông tin đã đổi: huỷ bản duyệt và yêu cầu chuyển cũ. Hãy kiểm tra lại.':''};
      }
      case 'view': return {...s,view:event.view};
      case 'profile': return {...s,profile:event.profile,route:classify([s.text,event.profile.patient,event.profile.age,event.profile.history].join(' ')),draft:false,reply:'',note:false,consent:false,stage:'new',event:'Đã cập nhật và đánh giá lại thông tin trong phiên. Chưa gửi cho dược sĩ.'};
      case 'transfer':
        if (s.route==='danger' || !s.text || s.stage!=='new') return s;
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
    const reason = {
      start:['Chưa có tin nhắn','Hãy bắt đầu bằng một tình huống giả.'],
      danger:['Có từ khoá nguy hiểm', 'Tin nhắn có dấu hiệu cần ưu tiên. Bộ lọc từ khoá không xác minh được tình trạng thực tế.'],
      vulnerable:['Cần dược sĩ đánh giá','Có thể liên quan người dùng thuốc cần thận trọng. AI không tự chọn sản phẩm.'],
      rx:['Ngoài quyền bán tự động','Yêu cầu liên quan thuốc kê đơn. Không bán hay gợi ý thuốc thay thế qua AI.'],
      info:['Thiếu nguồn tồn kho','Prototype không có công cụ tra giá hoặc tồn kho. Không xác nhận còn hàng.'],
      unknown:['Chưa đủ thông tin','Chưa biết đủ về người dùng thuốc và triệu chứng. Không đoán sản phẩm.']
    }[s.route];
    return `<aside class="side"><section class="card"><h2><span class="num">2</span>Căn cứ & giới hạn</h2><span class="label ${s.route==='danger'?'red':'amber'}">${reason[0]}</span><p class="readonly">${reason[1]}</p><ul class="facts"><li><b>Người dùng thuốc</b>${escape(s.profile.patient||'Chưa xác nhận — không suy từ người nhắn')}</li><li><b>Tuổi</b>${escape(s.profile.age||'Chưa xác nhận')}</li><li><b>Thuốc đang dùng / bệnh / dị ứng</b>${escape(s.profile.history||'Chưa xác nhận')}</li></ul><p class="source">Căn cứ thiết kế: đề T1 · Hard tests và quy tắc chuyển dược sĩ. Không phải kết luận y khoa; không có % tin cậy giả định.</p></section><section class="card"><h2><span class="num">5</span>Quyền riêng tư</h2><p class="small">Thông tin nhập chỉ ở bộ nhớ trang. Đóng hoặc tải lại trang sẽ xoá. Chuyển ca chia sẻ nội dung phiên với dược sĩ mô phỏng, không tạo hồ sơ sức khoẻ.</p>${s.note?`<div class="success">Ghi chú đã lưu trong phiên.</div><button data-action="deleteNote">Xoá ghi chú</button>`:`<label class="check"><input id="consent" type="checkbox" ${s.consent?'checked':''} ${!s.text?'disabled':''}>Tôi đồng ý lưu ghi chú sức khoẻ trong phiên mô phỏng.</label><button data-action="save" ${!s.consent||!s.text?'disabled':''}>Lưu ghi chú</button>`}</section></aside>`;
  }
  function screening(s) {
    return `<details ${s.route==='unknown'?'open':''}><summary><span class="num">3</span>Bổ sung / sửa người dùng thuốc</summary><p>Chỉ nhập dữ liệu giả. Dược sĩ sẽ hỏi thêm về mang thai/cho con bú, thời gian triệu chứng và thuốc đã dùng; biểu mẫu này không thay thế sàng lọc chuyên môn.</p><form id="profile-form"><div class="form-row"><div><label class="field" for="patient">Ai sẽ dùng thuốc?</label><input id="patient" name="patient" type="text" maxlength="80" value="${escape(s.profile.patient)}" placeholder="Ví dụ: con của tôi"></div><div><label class="field" for="age">Tuổi</label><input id="age" name="age" type="text" maxlength="30" value="${escape(s.profile.age)}" placeholder="Ví dụ: 2 tuổi"></div></div><label class="field" for="history">Thuốc đang dùng, bệnh, dị ứng (nếu biết)</label><input id="history" name="history" type="text" maxlength="250" value="${escape(s.profile.history)}" placeholder="Chưa rõ thì ghi chưa rõ"><div class="actions"><button type="submit">Cập nhật thông tin</button></div></form></details>`;
  }
  function customer(s) {
    const messages = {
      vulnerable:'Mình là trợ lý AI. Trường hợp này cần dược sĩ đánh giá trước khi gợi ý sản phẩm. Mình chưa xác nhận đủ thông tin người dùng thuốc và sẽ không tự chọn thuốc hay nói liều. Bạn có thể bổ sung thông tin hoặc chuyển dược sĩ.',
      rx:'Mình không thể bán thuốc kê đơn hoặc gợi ý thuốc thay thế qua chat tự động. Bạn có thể chuyển dược sĩ để được hướng dẫn bước tiếp theo. Không có giao dịch nào được tạo.',
      info:'Mình chưa có dữ liệu giá và tồn kho để xác nhận sản phẩm còn ở cửa hàng gần bạn. Bạn có thể chuyển dược sĩ để kiểm tra thông tin; mình không tạo đơn hay hứa giữ hàng.',
      unknown:'Mình chưa đủ thông tin để gợi ý sản phẩm. Người sẽ dùng thuốc là ai và bao nhiêu tuổi? Nếu có dấu hiệu nguy hiểm, hãy nêu ngay; bạn có thể chuyển dược sĩ bất cứ lúc nào.'
    };
    let body='';
    if(s.route==='start') body=`<div class="empty"><span class="brand-icon">+</span><h2 class="stack">Bạn muốn hỏi cho ai?</h2><p class="small">Một tin nhắn có thể cần hỏi lại hoặc cần người đánh giá.<br>Hãy chọn ca mẫu bên dưới để thử.</p></div>`;
    else if(s.route==='danger') body=`<div class="alert" role="alert"><span class="label red">Ưu tiên ngay · Không xếp hàng</span><h2><span class="num">3</span>Cần hỗ trợ y tế ngay</h2><p>Tin nhắn có dấu hiệu nguy hiểm như khó thở hoặc lơ mơ. Hãy đi khám, gọi cấp cứu ngay. Đừng chờ phản hồi trong cuộc chat này.</p><p class="small">AI không xác minh được tình trạng và không gợi ý thuốc. Nếu bộ lọc hiểu sai tin nhắn, bạn có thể sửa thông tin bên dưới.</p><button class="danger-btn" data-action="ack">Tôi đã đọc hướng dẫn</button></div><div class="notice"><span class="num">4</span><b>Đã chặn gợi ý thuốc và chuyển vào hàng chờ.</b><p class="small stack">Chưa gửi thông báo cho dược sĩ hay dịch vụ cấp cứu. Prototype không thực hiện cuộc gọi. Người nhắn cần chủ động tìm hỗ trợ.</p></div>`;
    else body=`<div class="message ai"><strong>TRỢ LÝ AI · CHƯA PHẢI TƯ VẤN CỦA DƯỢC SĨ</strong>${messages[s.route]}</div>${s.stage==='new'?screening(s):''}${queue(s)}`;
    return `<section class="card"><div class="view-title"><h2>Cuộc trò chuyện</h2><span class="label">Khách · dữ liệu giả</span></div>${s.text?`<div class="message user"><strong>BẠN</strong>${escape(s.text)}</div>`:''}${body}${s.reply?`<div class="message ai"><strong>PHẢN HỒI ĐÃ ĐƯỢC DƯỢC SĨ MÔ PHỎNG DUYỆT</strong>${escape(s.reply)}</div>`:''}<hr class="divider"><form id="chat-form"><label class="field" for="message">${s.text?'Gửi thông tin mới / sửa tin trước':'Tin nhắn của bạn'}</label><textarea id="message" name="message" maxlength="1500" required placeholder="Chỉ nhập tình huống giả, không dùng thông tin sức khoẻ thật."></textarea><div class="actions"><button type="submit" class="primary">${s.text?'Cập nhật & đánh giá lại':'Gửi tin nhắn'}</button>${s.text?'<button type="button" class="link" data-action="edit">Sửa tin nhắn trước</button>':''}</div></form><p class="small stack">Thông tin mới sẽ huỷ bản duyệt, yêu cầu chuyển và ghi chú cũ để tránh xử lý sai người.</p><div class="preset" aria-label="Ca mẫu"><button data-preset="child">Trẻ nhỏ</button><button data-preset="danger">Dấu hiệu nguy hiểm</button><button data-preset="pregnancy">Mang thai</button><button data-preset="normal">Hỏi tồn kho</button><button data-preset="rx">Thuốc kê đơn</button></div></section>`;
  }
  function queue(s) {
    if(s.stage==='new')return `<div class="stack"><h3><span class="num">4</span>Chuyển người hỗ trợ</h3><p class="small">Khi chuyển, dược sĩ mô phỏng sẽ thấy tin nhắn và phần thông tin bạn đã bổ sung. Không tự tạo hồ sơ sức khoẻ.</p><button class="primary" data-action="transfer">Chuyển dược sĩ</button></div>`;
    if(s.stage==='queued')return `<div class="success stack"><h3><span class="num">4</span>Đã chuyển · Chờ dược sĩ nhận</h3><p class="small">Ca M-001 · Thời hạn demo: 2 phút. Không có gợi ý sản phẩm nào được tự gửi trong lúc chờ.</p><div class="actions"><button data-action="undo">Huỷ chuyển ca</button><button data-view="pharmacist">Xem bàn dược sĩ mô phỏng</button></div></div>`;
    if(s.stage==='review')return `<div class="notice"><span class="num">4</span><b>Dược sĩ đang xem ca mô phỏng.</b><p class="small stack">Chưa có phản hồi được duyệt. Nếu xuất hiện khó thở, lơ mơ hoặc dấu hiệu nguy hiểm, hãy đi khám / gọi cấp cứu ngay; đừng chờ chat.</p><button data-view="pharmacist">Xem bàn dược sĩ mô phỏng</button></div>`;
    if(s.stage==='timeout')return `<div class="notice"><h3><span class="num">4</span>Chưa có dược sĩ phản hồi</h3><p>Đã quá thời hạn demo 2 phút. AI không tự nhận quyền tư vấn hay tự gửi gợi ý. Bạn có thể thử chuyển lại hoặc tìm hỗ trợ y tế trực tiếp.</p><p class="small">Nếu có dấu hiệu nguy hiểm, đi khám / gọi cấp cứu ngay; không tiếp tục chờ chat.</p><button data-action="retry">Thử chuyển lại</button></div>`;
    return `<div class="success"><span class="num">4</span>Phản hồi đã duyệt · Không có đơn hàng được tạo.</div>`;
  }
  function pharmacist(s) {
    if(!s.text||s.route==='danger'||s.stage==='new')return `<section class="card empty"><h2>Bàn dược sĩ</h2><p>Chưa có ca trong hàng chờ.</p><p class="small">Ca có dấu hiệu nguy hiểm không được xếp hàng. Chỉ khi khách chọn chuyển, thông tin mới xuất hiện ở đây.</p><button data-view="customer">Quay lại cuộc chat</button></section>`;
    const draft = s.route==='rx'?'Đây là phản hồi mô phỏng: không bán thuốc kê đơn qua AI. Vui lòng trao đổi trực tiếp với dược sĩ về yêu cầu và giấy tờ cần thiết.':s.route==='info'?'Đây là phản hồi mô phỏng: chưa có kết quả kiểm tra tồn kho. Không xác nhận còn hàng và không tạo đơn.':'Đây là phản hồi mô phỏng: cần hỏi thêm trước khi đưa ra gợi ý. Vui lòng xác nhận tuổi, thời gian triệu chứng, thuốc đã dùng, dị ứng và tình trạng liên quan. Chưa có chỉ định thuốc.';
    return `<section class="card"><div class="view-title"><h2><span class="num">6</span>Bàn dược sĩ · Ca M-001</h2><span class="label amber">Mô phỏng vai trò</span></div><p class="small">Màn hình demo, không có dược sĩ thật, không có xác thực tài khoản.</p><div class="review"><h3>Thông tin khách đã chia sẻ</h3><p>${escape(s.text)}</p><ul class="facts"><li><b>Người dùng thuốc / tuổi</b>${escape(s.profile.patient||'Chưa xác nhận')} / ${escape(s.profile.age||'Chưa xác nhận')}</li><li><b>Thuốc, bệnh, dị ứng</b>${escape(s.profile.history||'Chưa xác nhận')}</li><li><b>Lý do chuyển</b>${s.route==='rx'?'Yêu cầu ngoài quyền bán tự động':s.route==='info'?'Thiếu nguồn tồn kho':'Chưa đủ thông tin để AI tự gợi ý'}</li></ul></div>${s.stage==='queued'?'<div class="actions"><button class="primary" data-action="accept">Nhận ca mô phỏng</button></div>':''}${s.stage==='review'?`<div class="notice stack"><b>AI chỉ soạn nháp, không tự gửi.</b><p class="small stack">Người duyệt phải kiểm tra đúng người dùng thuốc, dữ kiện còn thiếu và quyền hạn. Xác nhận của khách không thay thế phê duyệt chuyên môn.</p></div>${!s.draft?'<button data-action="draft">Soạn phản hồi sàng lọc</button>':`<form id="approve-form"><label class="field" for="reply">Bản nháp — chưa gửi</label><textarea id="reply" name="reply" maxlength="1000" required>${escape(draft)}</textarea><label class="check"><input id="review-confirm" name="confirm" type="checkbox" required>Tôi đã kiểm tra dữ kiện và duyệt phản hồi mô phỏng này.</label><button class="primary" type="submit">Duyệt & gửi phản hồi mô phỏng</button></form>`}`:''}${s.stage==='timeout'?'<div class="notice stack">Ca đã quá hạn. Không thể gửi bản nháp cũ. Khách có thể thử chuyển lại.</div>':''}${s.stage==='answered'?`<div class="success stack"><b>Đã duyệt và gửi</b><p class="stack">${escape(s.reply)}</p></div>`:''}<div class="actions"><button data-view="customer">Quay lại cuộc chat</button></div><p class="source">Không có nút bán thuốc kê đơn, đặt hàng hay gửi gợi ý sản phẩm tự động.</p></section>`;
  }
  function render(s) {
    return `<header class="topbar"><div class="brand"><span class="brand-icon" aria-hidden="true">+</span>Hỏi dược sĩ <span class="small">/ 3 miền</span></div><p class="app-note">Prototype học tập · Dữ liệu giả<br>Không kết nối Pharmacity hay dịch vụ y tế</p></header><main class="shell"><div class="intro"><div><span class="eyebrow">Hỗ trợ đúng lúc · Giữ quyền quyết định</span><h1>Hỏi rõ trước khi gợi ý.</h1><p><span class="num">1</span>Bạn đang tương tác với AI. AI hỗ trợ sàng lọc, không chẩn đoán, không tự nói liều hay bán thuốc kê đơn.</p></div><nav class="tabs" aria-label="Màn hình"><button data-view="customer" class="${s.view==='customer'?'active':''}" aria-pressed="${s.view==='customer'}">Khách hàng</button><button data-view="pharmacist" class="${s.view==='pharmacist'?'active':''}" aria-pressed="${s.view==='pharmacist'}">Dược sĩ · demo</button></nav></div><div class="toolbar"><span>Điều khiển demo · Không phải chức năng của khách</span><button data-action="timeout" ${!['queued','review'].includes(s.stage)?'disabled':''}>Giả lập quá hạn 2 phút</button><button data-action="reset">Bắt đầu lại / xoá phiên</button></div><div class="status-line" role="status" aria-live="polite" aria-atomic="true">${escape(s.event||'Không lưu dữ liệu sau khi tải lại trang. Chọn một ca mẫu để bắt đầu.')}</div><div class="layout"><div class="main">${s.view==='customer'?customer(s):pharmacist(s)}</div>${sidebar(s)}</div><footer class="footer">LAB5 · L3A · Track 1 · Nhóm 3 miền · Luồng mô phỏng, không gửi dữ liệu ra ngoài.</footer></main>`;
  }
  const api = {presets,initial,reduce,classify,render,escape};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  if(root.document){
    let state=initial(); const app=document.getElementById('app'); let timer;
    function dispatch(event){
      const previous=state; state=reduce(state,event); app.innerHTML=render(state);
      if(state.stage==='queued'&&previous.stage!=='queued') {clearTimeout(timer);timer=setTimeout(()=>dispatch({type:'timeout'}),120000);}
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
