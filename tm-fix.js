const fs = require('fs');
const path = require('path');

const file = 'components/time-machine.tsx';
const fullPath = path.join('d:\\codesprint hackathon', file);

let content = fs.readFileSync(fullPath, 'utf8');

content = content.replace(/text-emerald-400/g, 'text-emerald-700');
content = content.replace(/bg-emerald-600\/20 hover:bg-emerald-600\/30/g, 'bg-emerald-100 hover:bg-emerald-200');
content = content.replace(/hover:text-rose-400 hover:bg-rose-400\/10/g, 'hover:text-rose-600 hover:bg-rose-100');


fs.writeFileSync(fullPath, content, 'utf8');
console.log('Fixed time-machine.tsx');
