import re

with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

# 1. Add import
content = content.replace("import { TokenView } from './TokenView';", "import { TokenView } from './TokenView';\nimport { useBalanceContext } from '../context/BalanceContext';")

# 2. Update interface
interface_old = """interface WalletViewProps {
  isBalanceHidden: boolean;
  onToggleBalance: () => void;
  balances: WalletBalances;"""
interface_new = """interface WalletViewProps {
  balances: WalletBalances;"""
content = content.replace(interface_old, interface_new)

# 3. Update component signature
sig_old = """export const WalletView: React.FC<WalletViewProps> = ({
  balances,
  transactions,
  onDeposit,
  onWithdraw,
  onTransfer,
  onOpenCheck,
  onOpenAdmin,
  isBalanceHidden,
  onToggleBalance,
}) => {"""
sig_new = """export const WalletView: React.FC<WalletViewProps> = ({
  balances,
  transactions,
  onDeposit,
  onWithdraw,
  onTransfer,
  onOpenCheck,
  onOpenAdmin,
}) => {
  const { isBalanceHidden, toggleBalanceVisibility } = useBalanceContext();"""
content = content.replace(sig_old, sig_new)

# 4. Update button onClick
content = content.replace("onClick={onToggleBalance}", "onClick={toggleBalanceVisibility}")

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
