const fs = require('fs');
const path = require('path');

const files = [
    'app/globals.css',
    'app/layout.tsx',
    'app/dashboard/page.tsx',
    'app/page.tsx',
    'components/metric-card.tsx',
    'components/time-machine.tsx',
    'components/invoice-table.tsx',
    'components/event-log.tsx',
    'components/status-badge.tsx'
];

const workspace = 'd:\\codesprint hackathon';

const replacements = [
    [/bg-gray-950/g, 'bg-gray-50'],
    [/bg-gray-900/g, 'bg-white'],
    [/bg-gray-800/g, 'bg-gray-50'],
    [/bg-gray-700/g, 'bg-gray-100'],
    [/text-gray-100/g, 'text-gray-900'],
    [/text-gray-200/g, 'text-gray-900'],
    [/text-gray-300/g, 'text-gray-800'],
    [/text-gray-400/g, 'text-gray-600'],
    [/text-gray-500/g, 'text-gray-500'],
    [/border-gray-800/g, 'border-gray-200'],
    [/border-gray-700/g, 'border-gray-300'],
    [/hover:bg-gray-800/g, 'hover:bg-gray-100'],
    [/hover:bg-gray-700/g, 'hover:bg-gray-200'],
    [/ring-gray-800/g, 'ring-gray-200'],
    [/divide-gray-800/g, 'divide-gray-200'],
    // Globals.css specific overrides
    [/background: #030712;/g, 'background: #f9fafb;'],
    [/color: #f3f4f6;/g, 'color: #111827;'],
    // status badges
    [/bg-green-900\/50/g, 'bg-green-100'],
    [/text-green-400/g, 'text-green-700'],
    [/bg-green-900/g, 'bg-green-100'],
    
    [/bg-red-900\/50/g, 'bg-red-100'],
    [/text-red-400/g, 'text-red-700'],
    [/bg-red-900/g, 'bg-red-100'],

    [/bg-amber-900\/50/g, 'bg-amber-100'],
    [/text-amber-400/g, 'text-amber-700'],
    [/bg-amber-900/g, 'bg-amber-100'],

    [/bg-blue-900\/50/g, 'bg-blue-100'],
    [/text-blue-400/g, 'text-blue-700'],
    [/bg-blue-900/g, 'bg-blue-100'],
];

files.forEach(file => {
    const fullPath = path.join(workspace, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content;
        replacements.forEach(([regex, replacement]) => {
            newContent = newContent.replace(regex, replacement);
        });
        if (content !== newContent) {
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`No changes needed for ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
