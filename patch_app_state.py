with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a persistent hook or just useState for now with localStorage
# Let's write a small useStickyState hook at the top or just use standard useState/useEffect.

hook_code = """
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function App() {"""

content = content.replace("export default function App() {", hook_code)

# Add state to App component
state_code = """export default function App() {
  const [isBalanceHidden, setIsBalanceHidden] = useStickyState(false, 'crypto_bot_hide_balance_v1');"""

content = content.replace("export default function App() {", state_code)

# Update HomeView
content = content.replace(
    "<HomeView balances={wallet.balances} onNavigate={(t) => setTab(t)} />",
    "<HomeView balances={wallet.balances} onNavigate={(t) => setTab(t)} isBalanceHidden={isBalanceHidden} onToggleBalance={() => setIsBalanceHidden(!isBalanceHidden)} />"
)

# Update WalletView
content = content.replace(
    """onOpenAdmin={() => setTab('admin')}
              />""",
    """onOpenAdmin={() => setTab('admin')}
                isBalanceHidden={isBalanceHidden}
                onToggleBalance={() => setIsBalanceHidden(!isBalanceHidden)}
              />"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
