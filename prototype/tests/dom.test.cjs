const {test}=require('node:test');const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');const {JSDOM}=require('jsdom');
function mount(){
 const dom=new JSDOM('<div id="app"></div>',{runScripts:'outside-only',url:'http://localhost/'});
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 dom.window.eval(readFileSync(require.resolve('../app.js'),'utf8'));
 return dom;
}
function click(d,sel){const el=d.window.document.querySelector(sel);assert.ok(el,sel);el.click();}
function submit(d,sel){d.window.document.querySelector(sel).dispatchEvent(new d.window.Event('submit',{bubbles:true,cancelable:true}));}
function text(d){return d.window.document.body.textContent;}

test('DOM: ca trẻ nhỏ chuyển, nhận, soạn nháp, duyệt rồi khách thấy phản hồi',()=>{
 const d=mount();try{
  click(d,'[data-preset="child"]');click(d,'[data-action="transfer"]');
  assert.match(text(d),/Đã chuyển · Chờ dược sĩ nhận/);
  click(d,'[data-view="pharmacist"]');click(d,'[data-action="accept"]');click(d,'[data-action="draft"]');
  const doc=d.window.document;
  doc.querySelector('#reply').value='Phản hồi giả do dược sĩ duyệt.';
  submit(d,'#approve-form');assert.ok(doc.querySelector('#approve-form'),'Thiếu xác nhận phải giữ bản nháp');
  // Form được render lại nên lấy lại phần tử hiện tại.
  doc.querySelector('#reply').value='Phản hồi giả do dược sĩ duyệt.';
  doc.querySelector('#review-confirm').checked=true;submit(d,'#approve-form');
  click(d,'[data-view="customer"]');assert.match(text(d),/Phản hồi giả do dược sĩ duyệt/);
 }finally{d.window.close();}
});
test('DOM: sửa tin sau khi chuyển thành dấu hiệu nguy hiểm loại khỏi bàn dược sĩ',()=>{
 const d=mount();try{
  click(d,'[data-preset="child"]');click(d,'[data-action="transfer"]');
  click(d,'[data-action="edit"]');
  assert.match(d.window.document.querySelector('#message').value,/Con mình/);
  d.window.document.querySelector('#message').value='Bé đang khó thở';submit(d,'#chat-form');
  assert.ok(d.window.document.querySelector('[role="alert"]'));
  assert.equal(d.window.document.querySelector('[data-action="transfer"]'),null);
  click(d,'[data-view="pharmacist"]');assert.match(text(d),/Chưa có ca trong hàng chờ/);
 }finally{d.window.close();}
});
test('DOM: checkbox đồng ý lưu có hiệu lực và không làm mất tin đang soạn',()=>{
 const d=mount();try{
  click(d,'[data-preset="child"]');const doc=d.window.document;
  assert.equal(doc.querySelector('[data-action="save"]').disabled,true);
  doc.querySelector('#message').value='Tin đang soạn';
  const input=doc.querySelector('#consent');input.checked=true;
  input.dispatchEvent(new d.window.Event('change',{bubbles:true}));
  assert.equal(doc.querySelector('[data-action="save"]').disabled,false);
  assert.equal(doc.querySelector('#message').value,'Tin đang soạn');
  click(d,'[data-action="save"]');assert.match(text(d),/Ghi chú đã lưu/);
  click(d,'[data-action="deleteNote"]');assert.equal(doc.querySelector('#consent').checked,false);
 }finally{d.window.close();}
});
test('DOM: bổ sung dấu hiệu nguy hiểm trong biểu mẫu phải dừng chuyển ca',()=>{
 const d=mount();try{
  click(d,'[data-preset="child"]');
  d.window.document.querySelector('#history').value='Khó thở, lơ mơ';
  submit(d,'#profile-form');assert.ok(d.window.document.querySelector('[role="alert"]'));
  assert.equal(d.window.document.querySelector('[data-action="transfer"]'),null);
 }finally{d.window.close();}
});


test('DOM: K1 tự chuyển, K2 thay thế ca và hiển thị đúng cảnh báo',()=>{
 const d=mount();try{
  click(d,'[data-preset="pregnancy"]');assert.match(text(d),/Đã chuyển · Chờ dược sĩ nhận/);
  click(d,'[data-view="pharmacist"]');assert.match(text(d),/Thai kỳ · Chuyển tự động/);
  click(d,'[data-view="customer"]');click(d,'[data-preset="danger"]');
  assert.ok(d.window.document.querySelector('[role="alert"]'));
  assert.match(text(d),/khò khè/);assert.match(text(d),/li bì/);
  assert.equal(d.window.document.querySelector('[data-action="transfer"]'),null);
  click(d,'[data-view="pharmacist"]');assert.match(text(d),/Chưa có ca trong hàng chờ/);
 }finally{d.window.close();}
});
test('DOM: hạn chờ được đặt lại khi ca K1 thay đổi, nhưng không khi gửi tin trống',()=>{
 const d=mount();try{
  const jobs=new Map();let seq=0;
  d.window.setTimeout=(fn,ms)=>{assert.equal(ms,120000);jobs.set(++seq,fn);return seq;};
  d.window.clearTimeout=id=>jobs.delete(id);
  click(d,'[data-preset="pregnancy"]');assert.equal(jobs.size,1);const oldId=seq;
  click(d,'[data-preset="pregnancy"]');assert.equal(jobs.size,1);assert.equal(jobs.has(oldId),false);
  const newId=seq;
  d.window.document.querySelector('#message').value='   ';submit(d,'#chat-form');
  assert.equal(seq,newId);assert.equal(jobs.size,1);
  jobs.get(newId)();assert.match(text(d),/Chưa có dược sĩ phản hồi/);
  click(d,'[data-action="retry"]');assert.equal(jobs.size,1);assert.ok(seq>newId);
  click(d,'[data-preset="danger"]');assert.equal(jobs.size,0);
 }finally{d.window.close();}
});
test('DOM: K8 chỉ lưu sau đồng ý riêng và cho xoá ghi chú',()=>{
 const d=mount();try{
  click(d,'[data-preset="privacy"]');const doc=d.window.document;
  assert.match(text(d),/Xem nội dung ghi chú/);
  assert.equal(doc.querySelector('[data-action="save"]').disabled,true);
  const consent=doc.querySelector('#consent');consent.checked=true;
  consent.dispatchEvent(new d.window.Event('change',{bubbles:true}));
  click(d,'[data-action="save"]');assert.match(text(d),/Ghi chú đã lưu/);
  click(d,'[data-action="deleteNote"]');assert.equal(doc.querySelector('#consent').checked,false);
 }finally{d.window.close();}
});


test('DOM: vai dược sĩ không thể đồng ý lưu thay khách',()=>{
 const d=mount();try{
  click(d,'[data-preset="pregnancy"]');click(d,'[data-view="pharmacist"]');
  assert.equal(d.window.document.querySelector('#consent'),null);
  assert.equal(d.window.document.querySelector('[data-action="save"]'),null);
  assert.match(text(d),/Khách chưa lưu ghi chú/);
 }finally{d.window.close();}
});
