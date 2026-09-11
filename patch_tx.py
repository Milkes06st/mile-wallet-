with open('src/services/walletService.ts', 'r') as f:
    content = f.read()

import re
content = re.sub(r'export const INITIAL_TRANSACTIONS: WalletTransaction\[\] = \[.*?\];', 'export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];', content, flags=re.DOTALL)

with open('src/services/walletService.ts', 'w') as f:
    f.write(content)
