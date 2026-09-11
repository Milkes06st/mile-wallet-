with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

# 1. Add props
content = content.replace("interface WalletViewProps {", "interface WalletViewProps {\n  isBalanceHidden: boolean;\n  onToggleBalance: () => void;")

content = content.replace(
"""export const WalletView: React.FC<WalletViewProps> = ({
  balances,
  transactions,
  onDeposit,
  onWithdraw,
  onTransfer,
  onOpenCheck,
  onOpenAdmin,
}) => {""",
"""export const WalletView: React.FC<WalletViewProps> = ({
  balances,
  transactions,
  onDeposit,
  onWithdraw,
  onTransfer,
  onOpenCheck,
  onOpenAdmin,
  isBalanceHidden,
  onToggleBalance,
}) => {""")

# 2. Remove local isBalanceHidden state
content = content.replace("const [isBalanceHidden, setIsBalanceHidden] = useState(false);", "")

# 3. Update onClick to use onToggleBalance
content = content.replace("onClick={() => setIsBalanceHidden(!isBalanceHidden)}", "onClick={onToggleBalance}")

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
