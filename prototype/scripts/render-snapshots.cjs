// Xuất HTML cùng hàm render dùng trên trang. Ảnh render tĩnh không thay thế browser QA.
const fs=require('node:fs');const path=require('node:path');
const {initial,reduce,render,presets}=require('../app.js');
const out=process.argv[2];if(!out)throw new Error('Usage: node render-snapshots.cjs <output-directory>');
fs.mkdirSync(out,{recursive:true});
const dispatch=(s,type,rest={})=>reduce(s,{type,...rest});
const danger=dispatch(initial(),'submit',{text:presets.danger});
let review=dispatch(initial(),'submit',{text:presets.pregnancy});
review=dispatch(review,'profile',{profile:{patient:'Người nhắn tự khai mang thai 3 tháng',age:'Chưa xác nhận',history:'Chưa rõ thuốc đã dùng và dị ứng'}});
review=dispatch(review,'accept');review=dispatch(review,'draft');review=dispatch(review,'view',{view:'pharmacist'});
const css=fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
for(const [name,state] of [['01-emergency',danger],['02-pharmacist-review',review]]){
 const html=`<!doctype html><html lang="vi"><meta charset="utf-8"><title>${name}</title><style>${css}</style><body>${render(state)}<p style="position:fixed;bottom:4px;left:30px;font-size:11px;color:#526d68">Ảnh render tĩnh từ HTML/CSS của prototype · Các số 1–6 trỏ tới spec.md §5 · Không phải ảnh chụp trình duyệt.</p></body></html>`;
 fs.writeFileSync(path.join(out,name+'.html'),html);
}
