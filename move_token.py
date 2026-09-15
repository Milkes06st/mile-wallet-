import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove old definition
content = content.replace("const CRYPTO_PAY_API_TOKEN = process.env.CRYPTO_PAY_API_TOKEN || '';", "")

# Insert near the top
import_block = "const BOT_TOKEN = process.env.BOT_TOKEN || 'mock_token';"
content = content.replace(import_block, import_block + "\nconst CRYPTO_PAY_API_TOKEN = process.env.CRYPTO_PAY_API_TOKEN || '';")

with open('server.ts', 'w') as f:
    f.write(content)
