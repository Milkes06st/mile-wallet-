const crypto = require('crypto');
const token = '634578:AAjDJphgYe9NViWKkkNi1kP1PcCDDYbMknE';
const secret = crypto.createHash('sha256').update(token).digest();

const body = JSON.stringify({ update_id: 1, update_type: 'invoice_paid' });
const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
console.log('Signature:', signature);

const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/cryptobot/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'crypto-pay-api-signature': signature
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.write(body);
req.end();
