import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make sure imports are added
if "import { Wallet, Home, BarChart2, Users } from 'lucide-react';" not in content:
    content = content.replace("import { Wallet } from 'lucide-react';", "import { Wallet, Home, BarChart2, Users } from 'lucide-react';")

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/types.ts', 'r') as f:
    types = f.read()

types = types.replace("export type WalletBalances = Record<CryptoId, number>;", "export type WalletBalances = Partial<Record<CryptoId, number>>;")

with open('src/types.ts', 'w') as f:
    f.write(types)

