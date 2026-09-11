with open('src/utils/validators.ts', 'r') as f:
    content = f.read()

content = content.replace("network === 'OPTIMISM'", "network as any === 'OPTIMISM'")
content = content.replace("network === 'SOLANA'", "network === 'SOL'")

with open('src/utils/validators.ts', 'w') as f:
    f.write(content)
