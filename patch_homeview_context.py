import re

with open('src/components/HomeView.tsx', 'r') as f:
    content = f.read()

# 1. Add import
content = content.replace("import { CRYPTO_LIST } from '../data/cryptoData';", "import { CRYPTO_LIST } from '../data/cryptoData';\nimport { useBalanceContext } from '../context/BalanceContext';")

# 2. Update interface
interface_old = """interface HomeViewProps {
  isBalanceHidden: boolean;
  onToggleBalance: () => void;
  balances: WalletBalances;
  onNavigate: (tab: 'wallet' | 'exchange' | 'p2p' | 'check' | 'admin') => void;
}"""
interface_new = """interface HomeViewProps {
  balances: WalletBalances;
  onNavigate: (tab: 'wallet' | 'exchange' | 'p2p' | 'check' | 'admin') => void;
}"""
content = content.replace(interface_old, interface_new)

# 3. Update component signature
sig_old = "export const HomeView: React.FC<HomeViewProps> = ({ balances, onNavigate, isBalanceHidden, onToggleBalance }) => {"
sig_new = """export const HomeView: React.FC<HomeViewProps> = ({ balances, onNavigate }) => {
  const { isBalanceHidden, toggleBalanceVisibility } = useBalanceContext();"""
content = content.replace(sig_old, sig_new)

# 4. Update button onClick
content = content.replace("onClick={onToggleBalance}", "onClick={toggleBalanceVisibility}")

with open('src/components/HomeView.tsx', 'w') as f:
    f.write(content)
