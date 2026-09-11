import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the header
content = re.sub(r'<header className="w-full bg-\[#0d121c\].*?</header>', '', content, flags=re.DOTALL)

# Update the main content area routing
old_main = """      <main className="w-full flex-1 flex flex-col p-0 pb-16 sm:pb-0 overflow-y-auto">
        {tab === 'wallet' || tab === 'home' ? (
          /* FULL CRYPTO WALLET VIEW */
          <WalletView
            balances={wallet.balances}
            transactions={wallet.transactions}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onTransfer={handleTransfer}
            onOpenCheck={() => setTab('check')}
            onOpenAdmin={() => setTab('admin')}
          />
        ) : tab === 'check' ? (
          /* CHECK CLAIM VIEW */
          <div className="w-full flex-1 flex flex-col">
            <CheckView
              key={resetKey}
              check={check}
              onActivateSuccess={handleActivateSuccess}
              onOpenAdmin={() => setTab('admin')}
              onOpenWallet={() => setTab('wallet')}
              onClaimToWallet={handleClaimToWallet}
              onUpdateCheck={setCheck}
            />
          </div>
        ) : (
          /* ADMIN CONTROL PANEL VIEW */
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            <AdminPanel
              check={check}
              attempts={attempts}
              onUpdateCheck={setCheck}
              onApproveAttempt={handleApproveAttempt}
              onRejectAttempt={handleRejectAttempt}
              onClearAttempts={handleClearAttempts}
              onClose={() => setTab('wallet')}
            />
          </div>
        )}
      </main>"""

new_main = """      <main className="w-full flex-1 flex flex-col p-0 pb-16 overflow-y-auto">
        {tab === 'wallet' && (
          <WalletView
            balances={wallet.balances}
            transactions={wallet.transactions}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onTransfer={handleTransfer}
            onOpenCheck={() => setTab('exchange')}
            onOpenAdmin={() => setTab('p2p')}
          />
        )}
        {tab === 'exchange' && (
          <div className="w-full flex-1 flex flex-col">
            <CheckView
              key={resetKey}
              check={check}
              onActivateSuccess={handleActivateSuccess}
              onOpenAdmin={() => setTab('p2p')}
              onOpenWallet={() => setTab('wallet')}
              onClaimToWallet={handleClaimToWallet}
              onUpdateCheck={setCheck}
            />
          </div>
        )}
        {tab === 'p2p' && (
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            <AdminPanel
              check={check}
              attempts={attempts}
              onUpdateCheck={setCheck}
              onApproveAttempt={handleApproveAttempt}
              onRejectAttempt={handleRejectAttempt}
              onClearAttempts={handleClearAttempts}
              onClose={() => setTab('wallet')}
            />
          </div>
        )}
        {tab === 'home' && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
            <Home className="w-16 h-16 mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2 text-white">Главная страница</h2>
            <p className="text-sm">Раздел в разработке (визуальная заглушка).</p>
          </div>
        )}
      </main>"""

content = content.replace(old_main, new_main)

# Update the bottom navigation bar
old_nav = """      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#000000] border-t border-[#1c2431] flex items-center justify-around py-2 px-1 pb-safe">
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

new_nav = """      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000] border-t border-[#1c2431] flex items-center justify-around py-2 px-1 pb-safe">
        <button
          onClick={() => setTab('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors w-1/4 ${
            tab === 'home' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px]">Главная</span>
        </button>
        <button
          onClick={() => setTab('exchange')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors w-1/4 ${
            tab === 'exchange' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px]">Биржа</span>
        </button>
        <button
          onClick={() => setTab('p2p')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative w-1/4 ${
            tab === 'p2p' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px]">P2P</span>
          {pendingCount > 0 && (
            <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
        <button
          onClick={() => setTab('wallet')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors w-1/4 ${
            tab === 'wallet' ? 'text-sky-500 font-medium' : 'text-slate-500'
          }`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-[10px]">Кошелек</span>
        </button>
      </nav>"""

content = content.replace(old_nav, new_nav)

with open('src/App.tsx', 'w') as f:
    f.write(content)
