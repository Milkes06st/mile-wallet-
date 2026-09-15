import re

with open('server.ts', 'r') as f:
    content = f.read()

# 1. Update express.json()
content = content.replace("app.use(express.json());", """app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));""")

# 2. Update webhook
old_webhook = """app.post('/api/cryptobot/webhook', (req: Request, res: Response) => {
  // Should verify webhook signature here
  const update = req.body;
  if (update && update.update_type === 'invoice_paid') {
    const payload = update.payload; // Contains user ID
    // Credit user balance in DB
    try {
      const { userId } = JSON.parse(payload.payload);
      if (userId) {
        const getBal = db.prepare('SELECT amount FROM balances WHERE user_id = ? AND asset = ?');
        const bal = getBal.get(userId, payload.asset);
        if (!bal) {
          db.prepare('INSERT INTO balances (user_id, asset, amount) VALUES (?, ?, ?)').run(userId, payload.asset, parseFloat(payload.amount));
        } else {
          db.prepare('UPDATE balances SET amount = amount + ? WHERE user_id = ? AND asset = ?').run(parseFloat(payload.amount), userId, payload.asset);
        }
        db.prepare('INSERT INTO transactions (user_id, type, asset, amount, tx_hash, status) VALUES (?, ?, ?, ?, ?, ?)').run(
          userId, 'deposit', payload.asset, parseFloat(payload.amount), `invoice_${payload.invoice_id}`, 'completed'
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
  res.json({ success: true });
});"""

new_webhook = """app.post('/api/cryptobot/webhook', (req: Request | any, res: Response) => {
  try {
    const signature = req.headers['crypto-pay-api-signature'];
    if (!signature) {
      console.error('CryptoBot Webhook: Missing signature');
      return res.status(401).send('Missing signature');
    }

    if (!CRYPTO_PAY_API_TOKEN) {
      console.error('CryptoBot Webhook: CRYPTO_PAY_API_TOKEN is missing');
      return res.status(500).send('Server misconfigured');
    }

    const secret = crypto.createHash('sha256').update(CRYPTO_PAY_API_TOKEN).digest();
    const checkSig = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');

    if (checkSig !== signature) {
      console.error('CryptoBot Webhook: Invalid signature');
      return res.status(401).send('Invalid signature');
    }

    const update = req.body;
    console.log('Verified CryptoBot Webhook:', update);

    if (update && update.update_type === 'invoice_paid') {
      const payload = update.payload; // Contains user ID
      // Credit user balance in DB
      try {
        let userId = null;
        if (payload.payload) {
            const parsed = JSON.parse(payload.payload);
            userId = parsed.userId;
        }
        if (userId) {
          const getBal = db.prepare('SELECT amount FROM balances WHERE user_id = ? AND asset = ?');
          const bal = getBal.get(userId, payload.asset);
          if (!bal) {
            db.prepare('INSERT INTO balances (user_id, asset, amount) VALUES (?, ?, ?)').run(userId, payload.asset, parseFloat(payload.amount));
          } else {
            db.prepare('UPDATE balances SET amount = amount + ? WHERE user_id = ? AND asset = ?').run(parseFloat(payload.amount), userId, payload.asset);
          }
          db.prepare('INSERT INTO transactions (user_id, type, asset, amount, tx_hash, status) VALUES (?, ?, ?, ?, ?, ?)').run(
            userId, 'deposit', payload.asset, parseFloat(payload.amount), `invoice_${payload.invoice_id}`, 'completed'
          );
          console.log(`Credited ${payload.amount} ${payload.asset} to user ${userId}`);
        }
      } catch (e) {
        console.error('Error processing invoice_paid webhook:', e);
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).send('Internal Server Error');
  }
});"""
content = content.replace(old_webhook, new_webhook)

# 3. Add payload to createInvoice
create_invoice_old = """      body: JSON.stringify({
        asset,
        amount: amount.toString(),
        description,
        paid_btn_name: 'callback',
        paid_btn_url: process.env.APP_URL || 'https://t.me',
      }),"""

create_invoice_new = """      body: JSON.stringify({
        asset,
        amount: amount.toString(),
        description,
        payload: JSON.stringify({ userId: req.dbUserId }),
        paid_btn_name: 'callback',
        paid_btn_url: process.env.APP_URL || 'https://t.me',
      }),"""
content = content.replace(create_invoice_old, create_invoice_new)

with open('server.ts', 'w') as f:
    f.write(content)
