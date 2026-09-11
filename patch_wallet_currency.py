import re

with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

# Add imports
if 'import { CurrencyModal, CURRENCIES } from' not in content:
    content = content.replace("import { CryptoIcon } from './CryptoIcons';", "import { CryptoIcon } from './CryptoIcons';\nimport { CurrencyModal, CURRENCIES } from './CurrencyModal';")

# Replace old currency logic
old_currency_logic = """  const currencies = [
    { symbol: '₽', code: 'RUB', rate: 1 },
    { symbol: '$', code: 'USD', rate: 1 / 92 },
    { symbol: '€', code: 'EUR', rate: 1 / 100 },
    { symbol: '¥', code: 'CNY', rate: 1 / 12.8 },
    { symbol: '£', code: 'GBP', rate: 1 / 117 },
    { symbol: '₹', code: 'INR', rate: 1 / 1.1 }
  ];
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const activeCurrency = currencies[currencyIndex];

  const toggleCurrency = () => {
    setCurrencyIndex((prev) => (prev + 1) % currencies.length);
  };"""

new_currency_logic = """  const [activeCurrencyCode, setActiveCurrencyCode] = useState('RUB');
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const activeCurrency = CURRENCIES.find(c => c.code === activeCurrencyCode) || CURRENCIES[1];"""

content = content.replace(old_currency_logic, new_currency_logic)

# Replace the click handler for currency
content = content.replace('onClick={toggleCurrency}', 'onClick={() => setIsCurrencyModalOpen(true)}')

# Add modal to return
content = content.replace('</nav>\n    </div>', '</nav>\n      <CurrencyModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} activeCurrencyCode={activeCurrencyCode} onSelectCurrency={setActiveCurrencyCode} />\n    </div>')

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
