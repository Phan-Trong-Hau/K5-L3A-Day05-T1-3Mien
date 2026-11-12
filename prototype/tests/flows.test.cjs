const {test} = require('node:test');
const assert = require('node:assert/strict');
const {initial,reduce,classify,presets,render} = require('../app.js');
const act=(s,type,extra={})=>reduce(s,{type,...extra});
const submit=text=>act(initial(),'submit',{text});
const queued=()=>act(submit(presets.child),'transfer');
const reviewing=()=>act(queued(),'accept');

test('Dấu hiệu nguy hiểm ưu tiên hơn yêu cầu mua thuốc, trẻ nhỏ và thuốc kê đơn',()=>{
 for(const text of [presets.danger,'Bé khó thở, mua kháng sinh được không?','ĐAU NGỰC, có thuốc gì?']){
  let s=submit(text);assert.equal(s.route,'danger');
  for(const type of ['transfer','accept','draft','approve'])s=act(s,type,{confirm:true,reply:'Không được gửi'});
  assert.equal(s.stage,'new');assert.equal(s.reply,'');assert.equal(s.draft,false);
  const ui=render(s);assert.match(ui,/Không xếp hàng/);assert.doesNotMatch(ui,/data-action="transfer"|id="approve-form"/);
 }
});
test('Trẻ nhỏ và thiếu dữ kiện không nhận gợi ý tự động',()=>{
 for(const text of [presets.child,'Đau họng 2 ngày, uống gì?']){
  const s=submit(text);assert.ok(['vulnerable','unknown'].includes(s.route));assert.equal(s.reply,'');
  assert.match(render(s),/Chuyển dược sĩ/);
 }
});
test('Thuốc kê đơn bị chặn, tồn kho không được bịa',()=>{
 assert.equal(classify(presets.rx),'rx');assert.match(render(submit(presets.rx)),/không thể bán thuốc kê đơn/);
 assert.equal(classify(presets.normal),'info');assert.match(render(submit(presets.normal)),/chưa có dữ liệu giá và tồn kho/);
});
test('Ca lạ và đầu vào bị phủ định vẫn chọn hướng thận trọng',()=>{
 assert.equal(classify('abc xyz'), 'unknown');
 assert.equal(classify('Tôi không khó thở'), 'danger'); // Giới hạn đã công bố: cần sửa tin / người đánh giá.
});
test('Chuyển có thể huỷ trước khi dược sĩ nhận, không huỷ giả sau khi đã nhận',()=>{
 assert.equal(act(queued(),'undo').stage,'new');
 assert.equal(act(reviewing(),'undo').stage,'review');
});
test('Dược sĩ phải nhận ca, tạo nháp và xác nhận mới gửi được',()=>{
 let s=queued();s=act(s,'approve',{confirm:true,reply:'A'});assert.equal(s.reply,'');
 s=act(s,'accept');s=act(s,'draft');
 assert.equal(s.reply,'');assert.equal(s.draft,true);
 assert.equal(act(s,'approve',{confirm:false,reply:'A'}).reply,'');
 assert.equal(act(s,'approve',{confirm:true,reply:'  '}).reply,'');
 s=act(s,'approve',{confirm:true,reply:'Phản hồi giả đã duyệt'});
 assert.equal(s.stage,'answered');assert.equal(s.reply,'Phản hồi giả đã duyệt');
 assert.match(render({...s,view:'customer'}),/Phản hồi giả đã duyệt/);
});
test('Quá hạn chặn gửi nháp, chỉ chuyển lại khi khách yêu cầu',()=>{
 let s=act(reviewing(),'draft');s=act(s,'timeout');
 assert.equal(s.stage,'timeout');assert.equal(s.draft,false);
 assert.equal(act(s,'approve',{confirm:true,reply:'Nháp cũ'}).reply,'');
 assert.equal(act(s,'retry').stage,'queued');
});
test('Sửa tin đổi sang cấp cứu huỷ ca, phê duyệt và đồng ý lưu cũ',()=>{
 let s=act(reviewing(),'draft');s=act(s,'consent',{checked:true});s=act(s,'save');
 s=act(s,'submit',{text:presets.danger});
 assert.equal(s.route,'danger');assert.equal(s.stage,'new');assert.equal(s.draft,false);
 assert.equal(s.reply,'');assert.equal(s.note,false);assert.equal(s.consent,false);
});
test('Không lưu ghi chú thiếu đồng ý, xoá và reset xoá trạng thái',()=>{
 let s=submit(presets.child);assert.equal(act(s,'save').note,false);
 s=act(s,'consent',{checked:true});s=act(s,'save');assert.equal(s.note,true);
 s=act(s,'deleteNote');assert.equal(s.note,false);assert.equal(s.consent,false);
 assert.deepEqual(act(s,'reset'),initial());
});
test('Thông tin người dùng hiển thị dưới dạng chữ, không chèn HTML',()=>{
 const s=submit('<img src=x onerror=alert(1)>');
 const html=render(s);assert.doesNotMatch(html,/<img src=x/);assert.match(html,/&lt;img/);
});
test('Tin trống không đổi ca đang xử lý; đầu vào có giới hạn',()=>{
 const s=queued();assert.equal(act(s,'submit',{text:'  '}).stage,'queued');
 assert.equal(submit('x'.repeat(2000)).text.length,1500);
});
test('Bàn dược sĩ không hiện nội dung chưa được khách chuyển',()=>{
 const s={...submit(presets.child),view:'pharmacist'};
 assert.match(render(s),/Chưa có ca trong hàng chờ/);
 assert.doesNotMatch(render(s),/Con mình 2 tuổi sốt/);
});

test('Thông tin bổ sung có dấu hiệu nguy hiểm phải đổi luồng ngay',()=>{
 let s=submit(presets.child);
 s=act(s,'profile',{profile:{patient:'Con',age:'2 tuổi',history:'Đang khó thở'}});
 assert.equal(s.route,'danger');assert.equal(act(s,'transfer').stage,'new');
 assert.doesNotMatch(render(s),/data-action="transfer"/);
});


test('K1 thai kỳ tự chuyển, có thể huỷ và chuyển lại; không hứa tiếp tục chờ sau huỷ',()=>{
 let s=submit(presets.pregnancy);assert.equal(s.route,'pregnancy');assert.equal(s.stage,'queued');
 assert.match(render({...s,view:'pharmacist'}),/Thai kỳ · Chuyển tự động/);
 s=act(s,'undo');assert.equal(s.stage,'new');assert.match(render(s),/Bạn đã huỷ chuyển ca/);
 assert.doesNotMatch(render(s),/Mình đã chuyển ca mô phỏng sang dược sĩ/);
 assert.equal(act(s,'transfer').stage,'queued');
});
test('Cập nhật K1 có nguy hiểm phải bỏ hàng chờ và bản duyệt',()=>{
 let s=act(submit(presets.pregnancy),'accept');s=act(s,'draft');
 s=act(s,'profile',{profile:{patient:'Người nhắn',age:'Chưa rõ',history:'Khó thở'}});
 assert.equal(s.route,'danger');assert.equal(s.stage,'new');assert.equal(s.draft,false);
});
test('Report và prototype dùng đúng tám tin nhắn và hai lời AI trọng tâm',()=>{
 const {readFileSync}=require('node:fs');const {copy}=require('../app.js');
 const spec=readFileSync(require('node:path').join(__dirname,'../../spec.md'),'utf8');
 for(const [key,route] of Object.entries({pregnancy:'pregnancy',danger:'danger',rx:'rx',throat:'unknown',chest:'danger',normal:'info',prolonged:'vulnerable',privacy:'privacy'})){
  assert.ok(spec.includes('“'+presets[key]+'”'),key+' phải trùng nguyên văn report');
  assert.equal(classify(presets[key]),route,key);
 }
 assert.ok(spec.includes(copy.emergency));assert.ok(spec.includes(copy.pregnancyQueued));
});
test('K8 không vào hàng chờ, cho xem nội dung ghi chú trước khi đồng ý',()=>{
 let s=submit(presets.privacy);assert.equal(s.route,'privacy');
 assert.match(render(s),/Xem nội dung ghi chú/);assert.doesNotMatch(render(s),/data-action="transfer"/);
 assert.equal(act(s,'transfer').stage,'new');assert.equal(act(s,'save').note,false);
});
