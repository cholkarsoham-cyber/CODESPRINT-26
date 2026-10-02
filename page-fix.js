const fs = require('fs');
const path = require('path');

const file = 'app/page.tsx';
const fullPath = path.join('d:\\codesprint hackathon', file);

let content = fs.readFileSync(fullPath, 'utf8');

content = content.replace(/from-emerald-400 to-blue-500/g, 'from-emerald-600 to-blue-600');
content = content.replace(/bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200/g, 'bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800');
content = content.replace(/bg-gray-50 text-white font-semibold rounded-lg hover:bg-gray-100 transition border border-gray-300/g, 'bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition border border-gray-200 shadow-sm');
content = content.replace(/text-emerald-400/g, 'text-emerald-600');
content = content.replace(/bg-emerald-500\/10 text-emerald-600 border-emerald-500\/20/g, 'bg-emerald-50 text-emerald-700 border-emerald-200'); // Note: it might be 400 earlier, but we just replaced it with 600 above!
// So let's adjust regex for the second pass:
content = content.replace(/bg-emerald-500\/10 text-emerald-600/g, 'bg-emerald-50 text-emerald-700');
content = content.replace(/border-emerald-500\/20/g, 'border-emerald-200');

content = content.replace(/bg-rose-500\/10 text-rose-400/g, 'bg-rose-50 text-rose-700');
content = content.replace(/border-rose-500\/20/g, 'border-rose-200');

content = content.replace(/bg-emerald-600\/20 text-emerald-600 hover:bg-emerald-600\/30/g, 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200');


fs.writeFileSync(fullPath, content, 'utf8');
console.log('Fixed page.tsx');
