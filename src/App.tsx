import React, { useState, useEffect, useCallback } from 'react';
import { CryptoCheck, ActivationAttempt, BotTab, CryptoId } from './types';
import { INITIAL_CHECK, INITIAL_ATTEMPTS } from './data/cryptoData';
import { CheckView } from './components/CheckView';
import { CheckStub } from './components/CheckStub';
import { WalletView } from './components/WalletView';
import { AdminPanel } from './components/AdminPanel';
import { HomeView } from './components/HomeView';
import { ExchangeStub } from './components/ExchangeStub';
import { P2PStub } from './components/P2PStub';
import { motion, AnimatePresence } from 'motion/react';
import { BalanceProvider } from './context/BalanceContext';
import { useWallet } from './services/walletService';
import { Shield, Bot, RefreshCw, Zap, Wallet, Ticket, X, CheckCircle, Info, Home, BarChart2, Users } from 'lucide-react';

const STORAGE_KEY_CHECK = 'crypto_active_check_v2';
const STORAGE_KEY_ATTEMPTS = 'crypto_attempts_v2';
const STORAGE_KEY_ACTIVE_TAB = 'crypto_bot_active_tab_v1';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
}




export default function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Wallet Hook: manages real-time balances, withdrawals, deposits, and transfers
  const wallet = useWallet();

  // Intercept wallet actions to show toasts
  const handleDeposit = (cryptoId: CryptoId, amount: number, networkId: string) => {
    wallet.deposit(cryptoId, amount, networkId);
    addToast({
      title: 'Пополнение успешно',
      message: `+${amount} ${cryptoId} зачислено на ваш баланс.`,
      type: 'success',
    });
  };

  const handleWithdraw = async (cryptoId: CryptoId, amount: number, networkId: any, targetAddress: string, memo?: string) => {
    const res = await wallet.withdraw(cryptoId, amount, networkId, targetAddress, memo);
    if (res.success && targetAddress) {
      addToast({
        title: 'Вывод средств инициирован',
        message: `${amount} ${cryptoId} отправлено на ${targetAddress.substring(0, 6)}...`,
        type: 'info',
      });
    }
    return res;
  };

  const handleTransfer = async (cryptoId: CryptoId, amount: number, userId: string, networkId?: any) => {
    const res = await wallet.transfer(cryptoId, amount, userId, networkId);
    if (res.success) {
      addToast({
        title: 'Перевод выполнен',
        message: `${amount} ${cryptoId} отправлено пользователю ${userId}`,
        type: 'success',
      });
    }
    return res;
  };

  // Load state from localStorage or defaults
  const [check, setCheck] = useState<CryptoCheck>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY_CHECK) || localStorage.getItem('xrocket_active_check_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title === 'Чек xRocket') parsed.title = 'Крипто-чек';
        // Auto-migrate legacy check to 1 USDT test check if older format
        if (parsed.id === 'chk_ton_demo_01' || parsed.id === 'chk_dfc_872') {
          return INITIAL_CHECK;
        }
        return parsed;
      }
      return INITIAL_CHECK;
    } catch {
      return INITIAL_CHECK;
    }
  });

  const [attempts, setAttempts] = useState<ActivationAttempt[]>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY_ATTEMPTS) || localStorage.getItem('xrocket_attempts_v1');
      return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
    } catch {
      return INITIAL_ATTEMPTS;
    }
  });

  // Current bot tab: 'wallet' | 'check' | 'admin'
  const [tab, setTab] = useState<BotTab>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB) as BotTab;
      if (saved === 'home' || saved === 'wallet' || saved === 'check' || saved === 'admin') return saved;
    } catch {
      // fallback
    }
    return 'home';
  });

  const [resetKey, setResetKey] = useState<number>(0);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECK, JSON.stringify(check));
    } catch (err) {
      console.error('Storage write error:', err);
    }
  }, [check]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
    } catch (err) {
      console.error('Storage write error:', err);
    }
  }, [attempts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, tab);
    } catch (err) {
      console.error('Storage write error:', err);
    }
  }, [tab]);

  // Handle new activation by user
  const handleActivateSuccess = (newAttempt: ActivationAttempt) => {
    // Add to attempts log
    setAttempts((prev) => [newAttempt, ...prev]);

    // Increment activations count in check if approved
    if (newAttempt.status === 'approved') {
      setCheck((prev) => ({
        ...prev,
        currentActivations: Math.min(prev.maxActivations, prev.currentActivations + 1),
      }));
    }
  };

  // Direct check reward deposit to wallet
  const handleClaimToWallet = (
    cryptoId: CryptoId,
    amount: number,
    checkTitle: string,
    checkId: string
  ) => {
    wallet.claimCheckPrize(cryptoId, amount, checkTitle, checkId);
    addToast({
      title: 'Приз получен!',
      message: `+${amount} ${cryptoId} из чека зачислено в кошелек.`,
      type: 'success',
    });
  };

  // Admin approves attempt (with optional custom manual amount and prize delivery)
  const handleApproveAttempt = (attemptId: string, customAmount?: number, customPrize?: string) => {
    setAttempts((prev) =>
      prev.map((att) => {
        if (att.id === attemptId) {
          const finalAmount = customAmount !== undefined ? customAmount : att.amount;
          // Deposit approved prize to wallet
          wallet.claimCheckPrize(att.cryptoSymbol as CryptoId, finalAmount, check.title, check.id);
          addToast({
            title: 'Чек одобрен',
            message: `Зачислено ${finalAmount} ${att.cryptoSymbol}`,
            type: 'success',
          });

          return {
            ...att,
            status: 'approved',
            adminCustomAmount: finalAmount,
            prizeDelivered: customPrize || att.prizeDelivered || `${check.prizeTemplate}-ADMIN`,
            reviewedAt: Date.now(),
            adminNotes: 'Одобрено администратором вручную (начислено на кошелек)',
          };
        }
        return att;
      })
    );

    // Update activation counter
    setCheck((prev) => ({
      ...prev,
      currentActivations: Math.min(prev.maxActivations, prev.currentActivations + 1),
    }));
  };

  // Admin rejects attempt
  const handleRejectAttempt = (attemptId: string) => {
    setAttempts((prev) =>
      prev.map((att) =>
        att.id === attemptId ? { ...att, status: 'rejected', reviewedAt: Date.now() } : att
      )
    );
  };

  // Clear attempts
  const handleClearAttempts = () => {
    if (window.confirm('Очистить историю попыток?')) {
      setAttempts([]);
    }
  };

  // Reset demo user attempt in UI
  const handleResetUserSession = () => {
    setResetKey((prev) => prev + 1);
  };

  const pendingCount = attempts.filter((a) => a.status === 'pending_admin').length;

  return (
    <BalanceProvider>
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center select-none font-sans">
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3 bg-[#1c2431] border border-slate-700/50 rounded-xl shadow-lg shadow-black/50 animate-in slide-in-from-top-2 fade-in"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h4 className="text-[14px] font-bold text-white leading-snug">{toast.title}</h4>
              {toast.message && (
                <p className="text-[13px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Universal App Switcher Bar */}
      

      {/* Main Content Area */}
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
              <HomeView balances={wallet.balances} onNavigate={(t) => setTab(t)}  />
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
            
            {tab === 'check' && <CheckStub />}
            
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
      </main>

            {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000] border-t border-[#1c2431] flex items-center justify-around py-2 px-1 pb-safe">
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
      </nav>
    </div>
    </BalanceProvider>
  );
}
