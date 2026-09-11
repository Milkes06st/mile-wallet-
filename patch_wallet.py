import re

with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

# 4) Remove tabs
content = re.sub(
    r'<div className="flex items-center gap-8 px-4 mt-2 border-b border-slate-800">.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# 1) & 2) Remove QR Payment button
content = re.sub(
    r'<div className="flex flex-col items-center gap-2 cursor-pointer">\s*<div className="w-12 h-12 rounded-\[18px\] bg-\[#155a8a\] flex items-center justify-center">\s*<QrCode className="w-5 h-5 text-white" />\s*</div>\s*<span className="text-\[11px\] font-medium text-slate-200">QR Оплата</span>\s*</div>',
    '',
    content,
    flags=re.DOTALL
)

# Replace state and currencies
new_state = """
  const [searchQuery, setSearchQuery] = useState('');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const currencies = [
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
  };
"""

content = content.replace("const [searchQuery, setSearchQuery] = useState('');", new_state)

# Replace Balance section
balance_section_old = """
        {/* Balance */}
        <div className="flex items-center gap-2 text-slate-400 text-[15px]">
          Общий баланс
          <Eye className="w-4 h-4 cursor-pointer" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-bold text-white tracking-tight">
            {totalRub.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-0.5 text-slate-400 font-medium text-sm cursor-pointer">
            RUB <ChevronDown className="w-4 h-4" />
          </div>
        </div>
"""

balance_section_new = """
        {/* Balance */}
        <div className="flex items-center gap-2 text-slate-400 text-[15px]">
          Общий баланс
          <Eye className="w-4 h-4 cursor-pointer" onClick={() => setIsBalanceHidden(!isBalanceHidden)} />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-bold text-white tracking-tight" onClick={() => setIsBalanceHidden(!isBalanceHidden)}>
            {isBalanceHidden ? '•••' : (totalRub * activeCurrency.rate).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-0.5 text-slate-400 font-medium text-sm cursor-pointer" onClick={toggleCurrency}>
            {activeCurrency.code} <ChevronDown className="w-4 h-4" />
          </div>
        </div>
"""

content = content.replace(balance_section_old.strip(), balance_section_new.strip())

# Change filtered assets conversion
fiat_value_old = "const fiatValue = bal * rateInfo.rub;"
fiat_value_new = "const fiatValue = bal * rateInfo.rub * activeCurrency.rate;"
content = content.replace(fiat_value_old, fiat_value_new)

rate_display_old = "{rateInfo.rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽"
rate_display_new = "{(rateInfo.rub * activeCurrency.rate).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} {activeCurrency.symbol}"
content = content.replace(rate_display_old, rate_display_new)

bal_display_old = "{fiatValue.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽"
bal_display_new = "{isBalanceHidden ? '•••' : `${fiatValue.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${activeCurrency.symbol}`}"
content = content.replace(bal_display_old, bal_display_new)

bal_crypto_old = "{bal > 0 ? bal.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0'}"
bal_crypto_new = "{isBalanceHidden ? '•••' : (bal > 0 ? bal.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0')}"
content = content.replace(bal_crypto_old, bal_crypto_new)

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
