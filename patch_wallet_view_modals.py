import re

with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

# 1. Ensure EyeOff is imported
if 'EyeOff' not in content:
    content = content.replace('Eye,', 'Eye,\n  EyeOff,')

# 2. Add the Eye icon back to the balance header
old_balance_header = """        <div className="flex items-center gap-2 text-slate-400 text-[15px]">
          Общий баланс
        </div>"""
new_balance_header = """        <div className="flex items-center gap-2 text-slate-400 text-[15px]">
          Общий баланс
          <button onClick={() => setIsBalanceHidden(!isBalanceHidden)} className="hover:text-white transition-colors cursor-pointer">
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>"""
content = content.replace(old_balance_header, new_balance_header)

# 3. Add the missing Modals to the render return
if '<CurrencyModal' not in content:
    old_return_end = """      {selectedTx && (
        <TransactionDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
};"""
    new_return_end = """      {selectedTx && (
        <TransactionDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
      <CoinListModal isOpen={isCoinFilterOpen} onClose={() => setIsCoinFilterOpen(false)} selectedOption={coinFilter} onSelectOption={setCoinFilter} />
      <CurrencyModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} activeCurrencyCode={activeCurrencyCode} onSelectCurrency={setActiveCurrencyCode} />
    </div>
  );
};"""
    content = content.replace(old_return_end, new_return_end)

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
