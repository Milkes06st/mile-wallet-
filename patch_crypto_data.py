import re

with open('src/data/cryptoData.ts', 'r') as f:
    content = f.read()

new_list = """export const CRYPTO_LIST: CryptoItem[] = [
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
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    rateRub: 6000000,
    rateUsd: 65000,
    networks: [NETWORKS.BTC],
    iconBg: '#f7931a',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    rateRub: 300000,
    rateUsd: 3300,
    networks: [NETWORKS.ERC20],
    iconBg: '#627eea',
  },
  {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    rateRub: 14000,
    rateUsd: 150,
    networks: [NETWORKS.SOL],
    iconBg: '#14f195',
  },
  {
    id: 'BNB',
    name: 'BNB',
    symbol: 'BNB',
    rateRub: 55000,
    rateUsd: 600,
    networks: [NETWORKS.BEP20],
    iconBg: '#f3ba2f',
  },
  {
    id: 'TRX',
    name: 'TRON',
    symbol: 'TRX',
    rateRub: 11,
    rateUsd: 0.12,
    networks: [NETWORKS.TRC20],
    iconBg: '#ff060a',
  },
];"""

content = re.sub(r'export const CRYPTO_LIST: CryptoItem\[\] = \[.*?\];', new_list, content, flags=re.DOTALL)

with open('src/data/cryptoData.ts', 'w') as f:
    f.write(content)
