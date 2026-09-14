import re
with open('src/services/walletService.ts', 'r') as f:
    content = f.read()

content = content.replace("import { INITIAL_BALANCES, INITIAL_TRANSACTIONS } from '../data/cryptoData';", "")

with open('src/services/walletService.ts', 'w') as f:
    f.write(content)
