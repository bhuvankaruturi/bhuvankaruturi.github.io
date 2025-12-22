const fs = require('fs');
const path = require('path');

// Paths
const packagePath = path.join(__dirname, '../package.json');
const swPath = path.join(__dirname, '../sw_cache_site.js');

// 1. Read package.json version
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const currentVersion = packageJson.version;

// 2. Generate new cache name (e.g., bpkc-1.0.1)
const newCacheName = `bpkc-${currentVersion}`;

// 3. Update sw_cache_site.js
let swContent = fs.readFileSync(swPath, 'utf8');
const cacheNameRegex = /const cachename = "[^"]+"/;

if (cacheNameRegex.test(swContent)) {
    swContent = swContent.replace(cacheNameRegex, `const cachename = "${newCacheName}"`);
    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Service Worker cache updated to: ${newCacheName}`);
} else {
    console.error('❌ Could not find cachename variable in sw_cache_site.js');
}
