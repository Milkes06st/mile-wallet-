import re
with open('src/components/CheckView.tsx', 'r') as f:
    content = f.read()

# Remove the Top Telegram App Bar
old_header = """      {/* Top Telegram App Bar */}
      <div className="w-full px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between border-b border-white/5 bg-[#0a0d14]/95 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={onOpenAdmin}
          title="Открыть админ-панель"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity">
          <span className="font-bold text-lg tracking-tight text-white">Crypto Bot</span>
          
          <ChevronDown className="w-4 h-4 text-slate-400 -ml-0.5" />
        </div>

        <div className="flex items-center gap-2">
          {onOpenWallet && (
            <button
              onClick={onOpenWallet}
              className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Баланс</span>
            </button>
          )}
          <button className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>"""

# Ensure we remove any slightly altered version of this block if it was modified
content = re.sub(r'\{\/\* Top Telegram App Bar \*\/.*?<\/div>\s*<\/div>\s*<\/div>', '', content, flags=re.DOTALL)

with open('src/components/CheckView.tsx', 'w') as f:
    f.write(content)
