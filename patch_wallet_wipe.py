with open('src/services/walletService.ts', 'r') as f:
    content = f.read()

# Wipe test balances completely
content = content.replace("const STORAGE_BALANCES = 'crypto_bot_balances_v1';", "const STORAGE_BALANCES = 'crypto_bot_balances_v4';")
content = content.replace("const STORAGE_TRANSACTIONS = 'crypto_bot_txs_v1';", "const STORAGE_TRANSACTIONS = 'crypto_bot_txs_v4';")

with open('src/services/walletService.ts', 'w') as f:
    f.write(content)
