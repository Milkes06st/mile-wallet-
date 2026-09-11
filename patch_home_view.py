with open('src/components/HomeView.tsx', 'r') as f:
    content = f.read()

# 1. Import Ticket and Eye/EyeOff
content = content.replace("ArrowUp, ArrowDown, RefreshCw, Send, Bell, User", "ArrowUp, ArrowDown, RefreshCw, Send, Bell, User, Eye, EyeOff, Receipt")

# 2. Add props
content = content.replace("interface HomeViewProps {", "interface HomeViewProps {\n  isBalanceHidden: boolean;\n  onToggleBalance: () => void;")
content = content.replace("export const HomeView: React.FC<HomeViewProps> = ({ balances, onNavigate }) => {", "export const HomeView: React.FC<HomeViewProps> = ({ balances, onNavigate, isBalanceHidden, onToggleBalance }) => {")

# 3. Add eye icon to "Примерный баланс"
old_balance_title = '<div className="text-sky-100 text-sm font-medium opacity-80 mb-1">Примерный баланс</div>'
new_balance_title = """<div className="flex items-center gap-2 mb-1">
            <div className="text-sky-100 text-sm font-medium opacity-80">Примерный баланс</div>
            <button onClick={onToggleBalance} className="text-sky-200 hover:text-white transition-colors">
              {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>"""
content = content.replace(old_balance_title, new_balance_title)

# 4. Hide total balance if hidden
old_balance_value = "{totalRub.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"
new_balance_value = "{isBalanceHidden ? '•••' : totalRub.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"
content = content.replace(old_balance_value, new_balance_value)

# 5. Hide crypto balances if hidden
old_crypto_rub = "{rateInfo.rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽"
new_crypto_rub = "{isBalanceHidden ? '••• ₽' : `${rateInfo.rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`}"
content = content.replace(old_crypto_rub, new_crypto_rub)

# 6. Change Check icon from Send to Receipt
content = content.replace("<Send className=\"w-5 h-5 text-white\" />", "<Receipt className=\"w-5 h-5 text-white\" />")

with open('src/components/HomeView.tsx', 'w') as f:
    f.write(content)
