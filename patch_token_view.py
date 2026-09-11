with open('src/components/TokenView.tsx', 'r') as f:
    content = f.read()

new_content = """import React from 'react';
import { CryptoId, WalletBalances } from '../types';
import { CRYPTO_LIST } from '../data/cryptoData';
import { CryptoIcon } from './CryptoIcons';
import { useCryptoRates } from '../services/rateService';
import { 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  SlidersHorizontal 
} from 'lucide-react';

interface TokenViewProps {
  cryptoId: CryptoId;
  balances: WalletBalances;
  onClose: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export const TokenView: React.FC<TokenViewProps> = ({
  cryptoId,
  balances,
  onClose,
  onDeposit,
  onWithdraw,
  onTransfer,
}) => {
  const cryptoItem = CRYPTO_LIST.find((c) => c.id === cryptoId) || CRYPTO_LIST[0];
  const { rates } = useCryptoRates();
  const bal = balances[cryptoId] || 0;
  const rateInfo = rates[cryptoId] || { rub: cryptoItem.rateRub, change24h: 0 };
  const fiatValue = bal * rateInfo.rub;

  return (
    <div className="fixed inset-0 z-40 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-right-2 overflow-y-auto pb-20">
      
      <div className="flex-1 flex flex-col items-center pt-12 px-4">
        {/* Token Icon */}
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg"
          style={{ backgroundColor: cryptoItem.iconBg || '#1c2431' }}
        >
          <CryptoIcon id={cryptoId} size={80} />
        </div>

        {/* Token Name */}
        <h2 className="text-xl font-medium text-white mb-6">
          {cryptoItem.name}
        </h2>

        {/* Balance */}
        <div className="text-[13px] text-slate-500 mb-1">Доступный баланс</div>
        <div className="text-3xl font-bold text-white tracking-tight mb-1">
          {bal > 0 ? bal.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0'} {cryptoItem.symbol}
        </div>
        <div className="text-[15px] text-slate-400 mb-8">
          ₽{fiatValue.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onWithdraw}>
            <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:bg-[#0077b3] transition-colors">
              <ArrowUp className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-slate-200">Вывести</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onDeposit}>
            <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:bg-[#0077b3] transition-colors">
              <ArrowDown className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-slate-200">Пополнить</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={onTransfer}>
            <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:bg-[#0077b3] transition-colors">
              <RefreshCw className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-slate-200">Обменять</span>
          </div>

          <div className="flex flex-col items-center gap-2 cursor-pointer opacity-50">
            <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:bg-[#0077b3] transition-colors">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-slate-200">Торговать</span>
          </div>
        </div>
      </div>
      
      {/* Back button overlay */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-md text-white"
        >
          <ArrowUp className="w-6 h-6 -rotate-90" />
        </button>
      </div>
    </div>
  );
};
"""

with open('src/components/TokenView.tsx', 'w') as f:
    f.write(new_content)
