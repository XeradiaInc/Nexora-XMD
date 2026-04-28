const express = require('express');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 10000; // Render will assign PORT

app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Status check: does a session exist?
app.get('/status', (req, res) => {
  const sessionPath = path.join(__dirname, 'session');
  const files = fs.existsSync(sessionPath) ? fs.readdirSync(sessionPath) : [];
  const hasSession = files.some(f => /creds|session|auth/i.test(f));
  res.json({ hasSession, files });
});

// Show QR if available
app.get('/qr', async (req, res) => {
  try {
    const qrFile = path.join(__dirname, 'session', 'qr.json');
    if (!fs.existsSync(qrFile)) {
      return res.json({ ok: false, message: 'no qr' });
    }
    const obj = JSON.parse(fs.readFileSync(qrFile, 'utf8'));
    const dataUrl = await QRCode.toDataURL(obj.qr);
    res.json({ ok: true, qr: obj.qr, dataUrl, ts: obj.ts });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Show pairing code if available
app.get('/pairing', (req, res) => {
  try {
    const pairingFile = path.join(__dirname, 'session', 'pairing.json');
    if (!fs.existsSync(pairingFile)) {
      return res.json({ ok: false, message: 'no pairing' });
    }
    const obj = JSON.parse(fs.readFileSync(pairingFile, 'utf8'));
    res.json({ ok: true, ...obj });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`Nexora MD dashboard running on http://localhost:${PORT}`);
});
