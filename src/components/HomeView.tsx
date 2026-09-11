import React from 'react';
import { CryptoId, WalletBalances } from '../types';
import { useCryptoRates } from '../services/rateService';
import { CryptoIcon } from './CryptoIcons';
import { ArrowUp, ArrowDown, RefreshCw, Send, Bell, User, Eye, EyeOff, Receipt } from 'lucide-react';
import { CRYPTO_LIST } from '../data/cryptoData';
import { useBalanceContext } from '../context/BalanceContext';

interface HomeViewProps {
  balances: WalletBalances;
  onNavigate: (tab: 'wallet' | 'exchange' | 'p2p' | 'check' | 'admin') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ balances, onNavigate }) => {
  const { isBalanceHidden, toggleBalanceVisibility } = useBalanceContext();
  const { rates } = useCryptoRates();

  // Calculate total balance in RUB
  const totalRub = React.useMemo(() => {
    let sumRub = 0;
    Object.entries(balances).forEach(([cryptoId, amount]) => {
      const rateInfo = rates[cryptoId as CryptoId];
      if (rateInfo && amount) {
        sumRub += (Number(amount) || 0) * rateInfo.rub;
      }
    });
    return sumRub;
  }, [balances, rates]);

  // Top 3 cryptos by market (just picking first 3 for demo)
  const topCryptos = CRYPTO_LIST.slice(0, 3);

  return (
    <div className="w-full flex flex-col pt-safe animate-in fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">tehnikadob</span>
            <span className="text-xs text-slate-500">Обычный аккаунт</span>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#1c2431] flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#1c2431]"></span>
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="px-4 mt-2">
        <div className="w-full rounded-3xl bg-gradient-to-br from-sky-600 to-blue-800 p-6 shadow-lg shadow-sky-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-2 mb-1">
            <div className="text-sky-100 text-sm font-medium opacity-80">Примерный баланс</div>
            <button onClick={toggleBalanceVisibility} className="text-sky-200 hover:text-white transition-colors">
              {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {isBalanceHidden ? '•••' : totalRub.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sky-100 font-medium">₽</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-6">
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('wallet')}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <ArrowDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-white">Ввод</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('wallet')}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <ArrowUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-white">Вывод</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('exchange')}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-white">Обмен</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('check')}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-white">Чек</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="px-4 mt-8 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Популярные монеты</h2>
          <span className="text-[13px] text-sky-400 font-medium cursor-pointer" onClick={() => onNavigate('wallet')}>Больше</span>
        </div>

        <div className="flex flex-col gap-1">
          {topCryptos.map((coin) => {
            const rateInfo = rates[coin.id] || { rub: coin.rateRub, change24h: 0 };
            const isPositive = rateInfo.change24h >= 0;

            return (
              <div key={coin.id} className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#0f141a] rounded-xl px-2 -mx-2 transition-colors" onClick={() => onNavigate('wallet')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full overflow-hidden">
                    <CryptoIcon id={coin.id} size={40} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-[15px]">{coin.symbol}</span>
                    <span className="text-slate-500 text-[13px]">{coin.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-white text-[15px]">
                    {rateInfo.rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽
                  </span>
                  <span className={`text-[13px] font-medium mt-0.5 ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                    {isPositive ? '+' : ''}{rateInfo.change24h}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Admin Link for Demo */}
        <div className="mt-6 flex justify-center">
            <button 
                onClick={() => onNavigate('admin')}
                className="text-xs text-slate-600 border border-slate-800 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
                Панель управления чеками (Admin)
            </button>
        </div>
      </div>
    </div>
  );
};
