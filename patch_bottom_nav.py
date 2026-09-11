import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make sure we have the right icons imported
if "Home," not in content:
    content = content.replace("import {", "import {\n  Home,\n  BarChart2,\n  Users,")

bottom_nav = """      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#000000] border-t border-[#1c2431] flex items-center justify-around py-2 px-1 pb-safe">
        <button
          onClick={() => setTab('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            tab === 'home' || tab === 'wallet' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px]">Главная</span>
        </button>
        <button
          onClick={() => setTab('check')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            tab === 'check' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px]">Биржа</span>
        </button>
        <button
          onClick={() => setTab('admin')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
            tab === 'admin' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px]">P2P</span>
          {pendingCount > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
        <button
          onClick={() => setTab('wallet')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            tab === 'wallet' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-[10px]">Кошелек</span>
        </button>
      </nav>"""

content = re.sub(
    r'\{\/\* Mobile Telegram Bottom Navigation Bar \*\/\}.*?<\/nav>',
    bottom_nav,
    content,
    flags=re.DOTALL
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
