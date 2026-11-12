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
