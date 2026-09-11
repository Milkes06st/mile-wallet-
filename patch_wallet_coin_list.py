import re

with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

# Add import
if 'import { CoinListModal, CoinFilterOption } from' not in content:
    content = content.replace("import { CurrencyModal, CURRENCIES } from './CurrencyModal';", "import { CurrencyModal, CURRENCIES } from './CurrencyModal';\nimport { CoinListModal, CoinFilterOption } from './CoinListModal';")

# Add state
new_state = """  const [activeCurrencyCode, setActiveCurrencyCode] = useState('RUB');
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const activeCurrency = CURRENCIES.find(c => c.code === activeCurrencyCode) || CURRENCIES[1];
  
  const [isCoinFilterOpen, setIsCoinFilterOpen] = useState(false);
  const [coinFilter, setCoinFilter] = useState<CoinFilterOption>('all');"""

content = content.replace("  const [activeCurrencyCode, setActiveCurrencyCode] = useState('RUB');\n  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);\n  const activeCurrency = CURRENCIES.find(c => c.code === activeCurrencyCode) || CURRENCIES[1];", new_state)

# Add logic to filteredCryptos
# we need to find filteredCryptos
old_filter = """  const filteredCryptos = CRYPTO_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );"""

new_filter = """  const filteredCryptos = CRYPTO_LIST.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    
    const bal = balances[c.id] || 0;
    const rateInfo = rates[c.id] || { usd: c.rateUsd }; // Ensure usd is available if possible, or fallback
    const usdValue = bal * (rateInfo.usd || c.rateUsd);
    
    if (coinFilter === 'hide_zero' && bal === 0) return false;
    if (coinFilter === 'hide_under_1' && usdValue < 1) return false;
    
    return true;
  });"""

content = content.replace(old_filter, new_filter)

# Change the click handler for the button
old_button = """          <div className="flex items-center gap-1 text-slate-300 text-[13px] bg-[#1c2431] px-3 py-1.5 rounded-full cursor-pointer">
            Все монеты <ChevronDown className="w-4 h-4" />
          </div>"""

new_button = """          <div onClick={() => setIsCoinFilterOpen(true)} className="flex items-center gap-1 text-slate-300 text-[13px] bg-[#1c2431] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#252f40] transition-colors">
            {coinFilter === 'hide_under_1' ? 'От $1' : coinFilter === 'hide_zero' ? 'Ненулевые' : 'Все монеты'} <ChevronDown className="w-4 h-4" />
          </div>"""

content = content.replace(old_button, new_button)

# Add modal to return
content = content.replace('</nav>\n      <CurrencyModal', '</nav>\n      <CoinListModal isOpen={isCoinFilterOpen} onClose={() => setIsCoinFilterOpen(false)} selectedOption={coinFilter} onSelectOption={setCoinFilter} />\n      <CurrencyModal')

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
