import re
with open('src/components/RealOnChainWallet.tsx', 'r') as f:
    content = f.read()

content = content.replace("Telegram Wallet", "Кошелек")
content = content.replace("Telegram @wallet", "Кошелек")
content = content.replace("Telegram @username", "@username")
content = content.replace("Telegram", "App")

with open('src/components/RealOnChainWallet.tsx', 'w') as f:
    f.write(content)
