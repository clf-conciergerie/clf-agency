const fs = require('fs');
const path = 'CLF_Agency_Mobile2.html';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/<img([^>]*?)src="(?!https?:|data:|\/)([^"]+)"/g, '<img$1src="./$2"');
fs.writeFileSync(path, content, 'utf8');
console.log('updated');
