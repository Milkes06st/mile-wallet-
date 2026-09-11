with open('src/components/WalletView.tsx', 'r') as f:
    content = f.read()

import re
# Remove the remaining tab lines
content = re.sub(
    r'\{\/\* Tabs \*\/\}\s*<div className="text-slate-400 pb-2 -mb-\[1px\] font-medium text-\[15px\] cursor-pointer">Основной</div>\s*<div className="text-slate-400 pb-2 -mb-\[1px\] font-medium text-\[15px\] cursor-pointer">Торговый</div>\s*</div>',
    '',
    content,
    flags=re.DOTALL
)

with open('src/components/WalletView.tsx', 'w') as f:
    f.write(content)
