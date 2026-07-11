const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const versionFilePath = path.join(publicDir, 'version.json');
const data = {
  version: Date.now().toString()
};

fs.writeFileSync(versionFilePath, JSON.stringify(data, null, 2));
console.log('Generated version.json:', data.version);
