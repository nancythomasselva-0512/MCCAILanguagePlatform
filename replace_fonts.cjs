const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace tiny text classes with text-sm
    content = content.replace(/text-\[8px\]/g, 'text-sm');
    content = content.replace(/text-\[9px\]/g, 'text-sm');
    content = content.replace(/text-\[10px\]/g, 'text-sm');
    content = content.replace(/text-\[11px\]/g, 'text-sm');
    
    // Replace text-xs with text-base
    content = content.replace(/\btext-xs\b/g, 'text-base');

    // Remove complex semi-transparent backgrounds that ruin the clean card look in light mode
    content = content.replace(/\bbg-white\/40\b/g, 'bg-white');
    content = content.replace(/\bbg-slate-100\/50\b/g, 'bg-white');
    content = content.replace(/\bbg-slate-100\b/g, 'bg-white');
    
    // Also change glass-card to app-card to match index.css better if needed, but glass-card is ok.
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${filePath}`);
}

const basePath = 'c:/Users/nancy/Downloads/mcc-ai-language-platform-praveen/mcc-ai-language-platform-praveen/src/components';
processFile(path.join(basePath, 'admin/SuperAdminDashboard.tsx'));
processFile(path.join(basePath, 'workspace/TenantDashboard.tsx'));
processFile(path.join(basePath, 'workspace/TenantBilling.tsx'));
