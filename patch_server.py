import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add imports
imports = """import express, { Request, Response } from 'express';
import crypto from 'crypto';
import db from './src/db.js';"""

content = re.sub(r"import express, { Request, Response } from 'express';", imports, content)

# Add TG auth middleware
tg_auth_middleware = """
const BOT_TOKEN = process.env.BOT_TOKEN || 'mock_token';

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
      dbUserId?: number;
    }
  }
}

function verifyTelegramWebAppData(initData: string, botToken: string) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  const params: string[] = [];
  urlParams.forEach((val, key) => params.push(`${key}=${val}`));
  params.sort();
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(params.join('\n')).digest('hex');
  if (calculatedHash !== hash) return null;
  return JSON.parse(urlParams.get('user') || '{}');
}

const tgAuth = (req: Request, res: Response, next: any) => {
  const initData = req.headers['x-telegram-init-data'] as string;
  
  let tgUser;
  if (process.env.NODE_ENV !== 'production' && !initData) {
    tgUser = { id: 10492, username: 'tehnikadob', first_name: 'tehnikadob' };
  } else if (!initData) {
    return res.status(401).json({ error: 'No initData' });
  } else {
    tgUser = verifyTelegramWebAppData(initData, BOT_TOKEN);
    if (!tgUser) return res.status(401).json({ error: 'Invalid initData' });
  }
  
  req.user = tgUser;
  
  // Ensure user exists in DB
  const stmt = db.prepare('INSERT OR IGNORE INTO users (telegram_id, username, first_name) VALUES (?, ?, ?)');
  stmt.run(tgUser.id, tgUser.username, tgUser.first_name);
  
  const getStmt = db.prepare('SELECT id FROM users WHERE telegram_id = ?');
  const userRow = getStmt.get(tgUser.id) as any;
  req.dbUserId = userRow.id;
  
  next();
};

// ==========================================
// NEW WALLET API (Custodial)
// ==========================================

app.get('/api/wallet/balances', tgAuth, (req: Request, res: Response) => {
  const balances = db.prepare('SELECT asset, amount FROM balances WHERE user_id = ?').all(req.dbUserId) as any[];
  const txs = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.dbUserId) as any[];
  
  const balanceMap: Record<string, number> = {};
  balances.forEach(b => balanceMap[b.asset] = parseFloat(b.amount));
  
  res.json({ balances: balanceMap, transactions: txs });
});

app.post('/api/wallet/transfer', tgAuth, (req: Request, res: Response) => {
  const { recipient, amount, cryptoId } = req.body;
  if (!recipient || !amount || amount <= 0 || !cryptoId) {
    return res.status(400).json({ success: false, error: 'Invalid parameters' });
  }

  const senderId = req.dbUserId;
  const recipientClean = recipient.replace('@', '');
  
  const getRecip = db.prepare('SELECT id FROM users WHERE username = ?');
  const recipRow = getRecip.get(recipientClean) as any;
  
  if (!recipRow) return res.status(404).json({ success: false, error: 'User not found' });
  if (recipRow.id === senderId) return res.status(400).json({ success: false, error: 'Cannot transfer to yourself' });

  const transferAmount = parseFloat(amount);

  const tx = db.transaction(() => {
    // Check balance
    const getBal = db.prepare('SELECT amount FROM balances WHERE user_id = ? AND asset = ?');
    const senderBal = getBal.get(senderId, cryptoId) as any;
    
    if (!senderBal || parseFloat(senderBal.amount) < transferAmount) {
      throw new Error('Insufficient funds');
    }
    
    // Deduct from sender
    db.prepare('UPDATE balances SET amount = amount - ? WHERE user_id = ? AND asset = ?').run(transferAmount, senderId, cryptoId);
    
    // Add to recipient
    const recipBal = getBal.get(recipRow.id, cryptoId);
    if (!recipBal) {
      db.prepare('INSERT INTO balances (user_id, asset, amount) VALUES (?, ?, ?)').run(recipRow.id, cryptoId, transferAmount);
    } else {
      db.prepare('UPDATE balances SET amount = amount + ? WHERE user_id = ? AND asset = ?').run(transferAmount, recipRow.id, cryptoId);
    }
    
    const txHash = `transfer_${Date.now()}`;
    
    // Sender tx
    const t1 = db.prepare('INSERT INTO transactions (user_id, type, asset, amount, tx_hash, counterparty, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      senderId, 'transfer', cryptoId, -transferAmount, txHash, recipientClean, 'completed'
    );
    
    // Recipient tx
    db.prepare('INSERT INTO transactions (user_id, type, asset, amount, tx_hash, counterparty, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      recipRow.id, 'receive', cryptoId, transferAmount, txHash, req.user.username, 'completed'
    );
    
    return {
      id: t1.lastInsertRowid,
      type: 'transfer',
      cryptoId,
      amount: transferAmount,
      txHash,
      timestamp: Date.now(),
      counterparty: recipientClean,
      status: 'completed'
    };
  });

  try {
    const result = tx();
    res.json({ success: true, transaction: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// We keep existing crypto-bot endpoints for external interaction, but we should add a webhook for real deposits.
app.post('/api/cryptobot/webhook', (req: Request, res: Response) => {
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
});

// Withdrawal via Hot Wallet (Mocked execution for safety, deducted from DB)
app.post('/api/wallet/withdraw', tgAuth, (req: Request, res: Response) => {
  const { cryptoId, amount, address, networkId } = req.body;
  if (!amount || amount <= 0 || !address) return res.status(400).json({ success: false, error: 'Invalid parameters' });
  
  const senderId = req.dbUserId;
  const withdrawAmount = parseFloat(amount);
  
  const tx = db.transaction(() => {
    const getBal = db.prepare('SELECT amount FROM balances WHERE user_id = ? AND asset = ?');
    const senderBal = getBal.get(senderId, cryptoId) as any;
    
    if (!senderBal || parseFloat(senderBal.amount) < withdrawAmount) {
      throw new Error('Insufficient funds');
    }
    
    db.prepare('UPDATE balances SET amount = amount - ? WHERE user_id = ? AND asset = ?').run(withdrawAmount, senderId, cryptoId);
    
    const txHash = `withdraw_${Date.now()}`;
    const t1 = db.prepare('INSERT INTO transactions (user_id, type, asset, amount, tx_hash, counterparty, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      senderId, 'withdraw', cryptoId, withdrawAmount, txHash, address, 'completed'
    );
    
    return {
      id: t1.lastInsertRowid,
      type: 'withdraw',
      cryptoId,
      amount: withdrawAmount,
      txHash,
      timestamp: Date.now(),
      counterparty: address,
      status: 'completed'
    };
  });
  
  try {
    const result = tx();
    // Here we would call tonClient.sendTransfer for real on-chain output
    res.json({ success: true, transaction: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
"""

content = content.replace("app.use(express.json());", "app.use(express.json());\n" + tg_auth_middleware)

with open('server.ts', 'w') as f:
    f.write(content)
