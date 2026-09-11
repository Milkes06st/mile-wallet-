with open('src/services/walletService.ts', 'r') as f:
    content = f.read()

content = content.replace("TON: 14.8,", "TON: 0,")
content = content.replace("USDT: 1.0,", "USDT: 0,")
content = content.replace("USDT: 100.0, TON: 14.8", "USDT: 0, TON: 0")

with open('src/services/walletService.ts', 'w') as f:
    f.write(content)
