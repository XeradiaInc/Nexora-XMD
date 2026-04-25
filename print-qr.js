const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

const sessionPath = path.join(process.cwd(), 'session', 'qr.json');
if (!fs.existsSync(sessionPath)) {
  console.error('qr.json not found at', sessionPath);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(sessionPath, 'utf8');
  const data = JSON.parse(raw);
  const qr = data.qr || raw;
  qrcode.generate(qr, { small: true });
} catch (e) {
  console.error('Failed to read or parse qr.json:', e.message);
  process.exit(1);
}
