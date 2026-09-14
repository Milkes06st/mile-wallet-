import re

with open('server.ts', 'r') as f:
    content = f.read()

# 1. Add apiLogger
logger_code = """
const apiLogger = (req: Request, res: Response, next: any) => {
  if (req.path.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] API Request: ${req.method} ${req.path}`);
  }
  next();
};
app.use(apiLogger);
"""
content = content.replace("app.use(express.json());", "app.use(express.json());\n" + logger_code)

# 2. Add tgAuth to cryptobot routes
content = content.replace("app.post('/api/cryptobot/create-invoice', async (req: Request, res: Response) => {", "app.post('/api/cryptobot/create-invoice', tgAuth, async (req: Request, res: Response) => {")
content = content.replace("app.post('/api/cryptobot/create-check', async (req: Request, res: Response) => {", "app.post('/api/cryptobot/create-check', tgAuth, async (req: Request, res: Response) => {")
content = content.replace("app.post('/api/cryptobot/transfer', async (req: Request, res: Response) => {", "app.post('/api/cryptobot/transfer', tgAuth, async (req: Request, res: Response) => {")

# 3. Update Health Check
health_check_old = """app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    network: TON_NETWORK,
    tonEndpoint: TONCENTER_ENDPOINT,
    cryptoPayConfigured: Boolean(CRYPTO_PAY_API_TOKEN),
  });
});"""

health_check_new = """app.get('/api/health', (req: Request, res: Response) => {
  let dbStatus = 'ok';
  try {
    db.prepare('SELECT 1').get();
  } catch (err) {
    dbStatus = 'error';
  }
  
  res.json({
    status: 'ok',
    database: dbStatus,
    network: TON_NETWORK,
    tonEndpoint: TONCENTER_ENDPOINT,
    cryptoPayConfigured: Boolean(CRYPTO_PAY_API_TOKEN),
  });
});"""
content = content.replace(health_check_old, health_check_new)

with open('server.ts', 'w') as f:
    f.write(content)
