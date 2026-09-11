import re
with open('src/services/walletService.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r'export const INITIAL_BALANCES: WalletBalances = \{[^}]*\};',
    '''export const INITIAL_BALANCES: WalletBalances = {
  TON: 14.8,
  USDT: 1.0,
};''',
    content,
    flags=re.DOTALL
)

with open('src/services/walletService.ts', 'w') as f:
    f.write(content)
