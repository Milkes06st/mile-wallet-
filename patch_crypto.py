import re
with open('src/data/cryptoData.ts', 'r') as f:
    content = f.read()

new_crypto_list = """export const CRYPTO_LIST: CryptoItem[] = [
  {
    id: 'TON',
    name: 'Toncoin',
    symbol: 'TON',
    rateRub: 350,
    rateUsd: 3.85,
    networks: [NETWORKS.TON],
    iconBg: '#0088cc',
  },
  {
    id: 'USDT',
    name: 'Tether USD',
    symbol: 'USDT',
    rateRub: 92,
    rateUsd: 1.00,
    networks: [
      NETWORKS.TRC20,
      NETWORKS.TON,
      NETWORKS.BEP20,
      NETWORKS.ERC20,
      NETWORKS.POLYGON,
      NETWORKS.SOL,
      NETWORKS.ARBITRUM,
    ],
    iconBg: '#26a17b',
  },
];"""

content = re.sub(
    r'export const CRYPTO_LIST: CryptoItem\[\] = \[.*?\n\];',
    new_crypto_list,
    content,
    flags=re.DOTALL
)

with open('src/data/cryptoData.ts', 'w') as f:
    f.write(content)
