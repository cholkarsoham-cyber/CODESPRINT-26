const fs = require('fs');
const path = require('path');

const file = 'components/event-log.tsx';
const fullPath = path.join('d:\\codesprint hackathon', file);

let content = fs.readFileSync(fullPath, 'utf8');

content = content.replace(/text-emerald-400/g, 'text-emerald-500');
content = content.replace(/text-blue-700/g, 'text-blue-500');
content = content.replace(/text-purple-400/g, 'text-purple-500');
content = content.replace(/bg-white\/40 border border-gray-200\/60 rounded-lg p-3 hover:bg-gray-50\/30/g, 'bg-white border border-gray-100 shadow-sm rounded-lg p-3 hover:bg-gray-50');


fs.writeFileSync(fullPath, content, 'utf8');
console.log('Fixed event-log.tsx');
