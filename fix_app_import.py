import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("Shield, Bot, RefreshCw, Zap, Wallet, Ticket, X, CheckCircle, Info", "Shield, Bot, RefreshCw, Zap, Wallet, Ticket, X, CheckCircle, Info, Home, BarChart2, Users")

with open('src/App.tsx', 'w') as f:
    f.write(content)
