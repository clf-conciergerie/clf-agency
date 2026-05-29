const fs = require('fs');
const path = require('path');
const file = 'CLF_Agency_Mobile2.html';
let html = fs.readFileSync(file, 'utf8');
const regex = /<img([^>]*?)src="(\.\/)?([^\"]+)"/g;
html = html.replace(regex, (m, attrs, dot, src) => {
  const localPath = path.join('.', src);
  if (!fs.existsSync(localPath)) return m;
  const ext = path.extname(src).toLowerCase();
  const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : ext === '.avif' ? 'image/avif' : '';
  if (!mime) return m;
  const data = fs.readFileSync(localPath);
  const base64 = data.toString('base64');
  return `<img${attrs}src="data:${mime};base64,${base64}"`;
});
fs.writeFileSync(file, html, 'utf8');
console.log('embedded');
