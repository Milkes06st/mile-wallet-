import React, { useState, useMemo } from 'react';
import { CryptoId, NetworkId, WalletBalances, WalletTransaction } from '../types';
import { CRYPTO_LIST } from '../data/cryptoData';
import { CryptoIcon } from './CryptoIcons';
import { CurrencyModal, CURRENCIES } from './CurrencyModal';
import { CoinListModal, CoinFilterOption } from './CoinListModal';
import { useCryptoRates } from '../services/rateService';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { TransferModal } from './TransferModal';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { TokenView } from './TokenView';
import { useBalanceContext } from '../context/BalanceContext';
import {
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  QrCode,
  ArrowRightLeft,
  RefreshCw,
  Search,
} from 'lucide-react';

interface WalletViewProps {
  balances: WalletBalances;
  transactions: WalletTransaction[];
  onDeposit: (cryptoId: CryptoId, amount: number, networkId: NetworkId) => void;
  onWithdraw: (
    cryptoId: CryptoId,
    amount: number,
    networkId: NetworkId,
    targetAddress: string,
    memo?: string
  ) => { success: boolean; error?: string; transaction?: WalletTransaction };
  onTransfer: (
    cryptoId: CryptoId,
    amount: number,
    recipientUsername: string
  ) => { success: boolean; error?: string; transaction?: WalletTransaction };
  onOpenCheck: () => void;
  onOpenAdmin: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  balances,
  transactions,
  onDeposit,
  onWithdraw,
  onTransfer,
  onOpenCheck,
  onOpenAdmin,
}) => {
  const { isBalanceHidden, toggleBalanceVisibility } = useBalanceContext();
  const { rates, refreshRates, formatCryptoFiat } = useCryptoRates();

  // Modals state
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositCrypto, setDepositCrypto] = useState<CryptoId>('TON');
  const [selectedTokenInfo, setSelectedTokenInfo] = useState<CryptoId | null>(null);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawCrypto, setWithdrawCrypto] = useState<CryptoId>('TON');

  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  // Search
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeCurrencyCode, setActiveCurrencyCode] = useState('RUB');
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const activeCurrency = CURRENCIES.find(c => c.code === activeCurrencyCode) || CURRENCIES[1];
  
  const [isCoinFilterOpen, setIsCoinFilterOpen] = useState(false);
  const [coinFilter, setCoinFilter] = useState<CoinFilterOption>('all');


  // Calculate Total Portfolio Value in RUB and USD
  const { totalRub } = useMemo(() => {
    let sumRub = 0;
    Object.entries(balances).forEach(([cryptoId, amount]) => {
      const rateInfo = rates[cryptoId as CryptoId];
      if (rateInfo) {
        sumRub += (amount as number) * rateInfo.rub;
      }
    });
    return { totalRub: sumRub };
  }, [balances, rates]);

  // Filtered cryptos
  const filteredCryptos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CRYPTO_LIST;
    return CRYPTO_LIST.filter(
      (c) =>
        c.symbol.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleOpenDepositFor = (cryptoId: CryptoId) => {
    setDepositCrypto(cryptoId);
    setDepositOpen(true);
  };

  const handleOpenWithdrawFor = (cryptoId: CryptoId) => {
    setWithdrawCrypto(cryptoId);
    setWithdrawOpen(true);
  };

  return (
    <div className="w-full flex-1 min-h-screen bg-[#000000] text-white flex flex-col font-sans overflow-x-hidden">


      

      <div className="px-4 mt-6">
        {/* Balance */}
        <div className="flex items-center gap-2 text-slate-400 text-[15px]">
          Общий баланс
          <button onClick={toggleBalanceVisibility} className="hover:text-white transition-colors cursor-pointer">
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-bold text-white tracking-tight">
            {(totalRub * activeCurrency.rate).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-0.5 text-slate-400 font-medium text-sm cursor-pointer" onClick={() => setIsCurrencyModalOpen(true)}>
            {activeCurrency.code} <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2 mt-8">
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setWithdrawOpen(true)}>
            <div className="w-12 h-12 rounded-[18px] bg-[#1c2431] flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-slate-200" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Вывод</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setDepositOpen(true)}>
            <div className="w-12 h-12 rounded-[18px] bg-[#1c2431] flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-slate-200" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Пополнение</span>
          </div>

          

          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-12 h-12 rounded-[18px] bg-[#1c2431] flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-slate-200" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Обмен</span>
          </div>

          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setTransferOpen(true)}>
            <div className="w-12 h-12 rounded-[18px] bg-[#1c2431] flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-slate-200" />
            </div>
            <span className="text-[11px] font-medium text-slate-200">Перевод</span>
          </div>
        </div>
      </div>

      {/* Assets Section */}
      <div className="px-4 mt-8 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Мои активы</h2>
          <div onClick={() => setIsCoinFilterOpen(true)} className="flex items-center gap-1 text-slate-300 text-[13px] bg-[#1c2431] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#252f40] transition-colors">
            {coinFilter === 'hide_under_1' ? 'От $1' : coinFilter === 'hide_zero' ? 'Ненулевые' : 'Все монеты'} <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-[#0f141a] text-white rounded-2xl py-3 pl-11 pr-4 outline-none text-[15px] border border-transparent focus:border-slate-800 transition-colors placeholder-slate-500"
          />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {filteredCryptos.map((coin) => {
            const bal = balances[coin.id] || 0;
            const rateInfo = rates[coin.id] || { rub: coin.rateRub, change24h: 0 };
            const fiatValue = bal * rateInfo.rub * activeCurrency.rate;
            const isPositive = rateInfo.change24h >= 0;

            return (
              <div
                key={coin.id}
                onClick={() => setSelectedTokenInfo(coin.id)}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#0f141a] rounded-xl px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 flex items-center justify-center bg-slate-800 rounded-full overflow-hidden">
                    <CryptoIcon id={coin.id} size={44} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-base leading-tight">{coin.symbol}</span>
                    <div className="flex items-center gap-1 text-[13px] mt-0.5">
                      <span className="text-slate-500">{(rateInfo.rub * activeCurrency.rate).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} {activeCurrency.symbol}</span>
                      <span className={isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}>
                        {isPositive ? '+' : ''}{rateInfo.change24h}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-semibold text-white text-base leading-tight">
                    {isBalanceHidden ? '•••' : (bal > 0 ? bal.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0')}
                  </span>
                  <span className="text-[13px] text-slate-500 mt-0.5">
                    {isBalanceHidden ? '•••' : `${fiatValue.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${activeCurrency.symbol}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}

      {selectedTokenInfo && (
        <TokenView
          cryptoId={selectedTokenInfo}
          balances={balances}
          onClose={() => setSelectedTokenInfo(null)}
          onDeposit={() => handleOpenDepositFor(selectedTokenInfo)}
          onWithdraw={() => handleOpenWithdrawFor(selectedTokenInfo)}
          onTransfer={() => setTransferOpen(true)}
        />
      )}

      {depositOpen && (
        <DepositModal
          initialCryptoId={depositCrypto}
          onClose={() => setDepositOpen(false)}
          onSimulateDeposit={(cryptoId, amount, networkId) => {
            onDeposit(cryptoId, amount, networkId);
          }}
        />
      )}

      {withdrawOpen && (
        <WithdrawModal
          initialCryptoId={withdrawCrypto}
          balances={balances}
          onClose={() => setWithdrawOpen(false)}
          onWithdraw={onWithdraw}
        />
      )}

      {transferOpen && (
        <TransferModal
          balances={balances}
          onClose={() => setTransferOpen(false)}
          onTransfer={onTransfer}
        />
      )}

      {selectedTx && (
        <TransactionDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
      <CoinListModal isOpen={isCoinFilterOpen} onClose={() => setIsCoinFilterOpen(false)} selectedOption={coinFilter} onSelectOption={setCoinFilter} />
      <CurrencyModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} activeCurrencyCode={activeCurrencyCode} onSelectCurrency={setActiveCurrencyCode} />
    </div>
  );
};
