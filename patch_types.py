with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("export type BotTab = 'wallet' | 'check' | 'admin';", "export type BotTab = 'home' | 'exchange' | 'p2p' | 'wallet' | 'check' | 'admin';")

with open('src/types.ts', 'w') as f:
    f.write(content)
