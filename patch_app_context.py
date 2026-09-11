import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add import for BalanceProvider
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { BalanceProvider } from './context/BalanceContext';")

# 2. Remove useStickyState definition
sticky_state_regex = r"function useStickyState<T>.*?return \[value, setValue\];\n}"
content = re.sub(sticky_state_regex, "", content, flags=re.DOTALL)

# 3. Remove useStickyState call
content = content.replace("  const [isBalanceHidden, setIsBalanceHidden] = useStickyState(false, 'crypto_bot_hide_balance_v1');\n", "")

# 4. Remove props from HomeView
content = content.replace("isBalanceHidden={isBalanceHidden} onToggleBalance={() => setIsBalanceHidden(!isBalanceHidden)}", "")

# 5. Remove props from WalletView
content = content.replace("isBalanceHidden={isBalanceHidden}\n                onToggleBalance={() => setIsBalanceHidden(!isBalanceHidden)}", "")

# 6. Wrap return in BalanceProvider
# Find the main return statement: return ( ... );
# Easiest way is to replace `return (` with `return (\n    <BalanceProvider>` and add `</BalanceProvider>` at the end of the component.
# Actually, the return statement inside `App` is `return (\n    <div className=`
content = content.replace("return (\n    <div className=", "return (\n    <BalanceProvider>\n      <div className=")
content = content.replace("  );\n}", "      </div>\n    </BalanceProvider>\n  );\n}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
