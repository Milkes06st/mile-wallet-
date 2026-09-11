import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("tab === 'wallet' ? (", "tab === 'wallet' || tab === 'home' ? (")

with open('src/App.tsx', 'w') as f:
    f.write(content)
