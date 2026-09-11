import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

imports_to_add = """import { HomeView } from './components/HomeView';
import { ExchangeStub } from './components/ExchangeStub';
import { P2PStub } from './components/P2PStub';
import { motion, AnimatePresence } from 'motion/react';"""
content = content.replace("import { AdminPanel } from './components/AdminPanel';", "import { AdminPanel } from './components/AdminPanel';\n" + imports_to_add)

content = content.replace("if (saved === 'wallet' || saved === 'check' || saved === 'admin') return saved;", "if (saved === 'home' || saved === 'wallet' || saved === 'check' || saved === 'admin' || saved === 'exchange' || saved === 'p2p') return saved;")
content = content.replace("return 'wallet';", "return 'home';")

old_main = """      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col p-0 pb-16 overflow-y-auto">
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

new_main = """      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col p-0 pb-16 overflow-y-auto overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex-1 flex flex-col min-h-full"
          >
            {tab === 'home' && (
              <HomeView balances={wallet.balances} onNavigate={(t) => setTab(t)} />
            )}
            
            {tab === 'wallet' && (
              <WalletView
                balances={wallet.balances}
                transactions={wallet.transactions}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onTransfer={handleTransfer}
                onOpenCheck={() => setTab('check')}
                onOpenAdmin={() => setTab('admin')}
              />
            )}
            
            {tab === 'exchange' && <ExchangeStub />}
            
            {tab === 'p2p' && <P2PStub />}
            
            {tab === 'check' && (
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
            )}
            
            {tab === 'admin' && (
              <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
                <AdminPanel
                  check={check}
                  attempts={attempts}
                  onUpdateCheck={setCheck}
                  onApproveAttempt={handleApproveAttempt}
                  onRejectAttempt={handleRejectAttempt}
                  onClearAttempts={handleClearAttempts}
                  onClose={() => setTab('home')}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>"""

content = content.replace(old_main, new_main)

with open('src/App.tsx', 'w') as f:
    f.write(content)
