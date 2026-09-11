with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import {\n  Home,\n  BarChart2,\n  Users,", "import {")
content = content.replace("import { Wallet } from 'lucide-react';", "import { Wallet, Home, BarChart2, Users } from 'lucide-react';")

with open('src/App.tsx', 'w') as f:
    f.write(content)
