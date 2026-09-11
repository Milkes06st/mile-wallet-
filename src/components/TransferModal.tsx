import React, { useState } from 'react';
import { CryptoId, NetworkId, WalletBalances, WalletTransaction } from '../types';
import { CRYPTO_LIST } from '../data/cryptoData';
import { CryptoIcon } from './CryptoIcons';
import { NetworkDropdown } from './NetworkDropdown';
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle, AlertTriangle,
  AtSign,
  Zap,
} from 'lucide-react';

interface TransferModalProps {
  balances: WalletBalances;
  onClose: () => void;
  onTransfer: (
    cryptoId: CryptoId,
    amount: number,
    recipientUsername: string,
    networkId?: NetworkId
  ) => { success: boolean; error?: string; transaction?: WalletTransaction };
}

export const TransferModal: React.FC<TransferModalProps> = ({
  balances,
  onClose,
  onTransfer,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoId>('TON');
  const cryptoItem = CRYPTO_LIST.find((c) => c.id === selectedCrypto) || CRYPTO_LIST[0];
  const availableNetworks = cryptoItem.networks.map((n) => n.id);

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>(
    availableNetworks[0] || 'TON'
  );
  const [recipient, setRecipient] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [completedTx, setCompletedTx] = useState<WalletTransaction | null>(null);

  const currentBalance = balances[selectedCrypto] || 0;
  const parsedAmount = parseFloat(amountInput) || 0;

  const handleCryptoChange = (id: CryptoId) => {
    setSelectedCrypto(id);
    const item = CRYPTO_LIST.find((c) => c.id === id);
    if (item && item.networks.length > 0) {
      setSelectedNetwork(item.networks[0].id);
    }
    setError(null);
  };

  const handleSetPercent = (pct: number) => {
    if (currentBalance <= 0) {
      setAmountInput('0');
      return;
    }
    const target = (currentBalance * pct) / 100;
    setAmountInput(target > 0 ? target.toFixed(selectedCrypto === 'BTC' ? 6 : 4) : '0');
    setError(null);
  };

  const handleSend = () => {
    setError(null);

    const cleanUser = recipient.trim();
    if (!cleanUser) {
      setError('Укажите @username или ID получателя');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Введите сумму перевода');
      return;
    }

    if (currentBalance < parsedAmount) {
      setError(`Недостаточно средств. Ваш баланс: ${currentBalance} ${selectedCrypto}`);
      return;
    }

    setShowConfirm(true);
  };

  const confirmSend = () => {
    const cleanUser = recipient.trim();
    const res = onTransfer(selectedCrypto, parsedAmount, cleanUser, selectedNetwork);
    if (res.success && res.transaction) {
      setCompletedTx(res.transaction);
    } else {
      setError(res.error || 'Ошибка отправки перевода');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2">
      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#151c27] w-full max-w-sm rounded-3xl p-6 border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Подтверждение перевода</h3>
            <div className="text-sm text-slate-300 mb-6 text-center space-y-2">
              <p>Вы собираетесь перевести средства внутри системы.</p>
              <div className="bg-[#0b0f17] rounded-xl p-3 text-left border border-slate-800 break-all">
                <span className="text-slate-500 text-xs block mb-1">Сумма:</span>
                <span className="text-white font-mono font-bold">{parsedAmount} {selectedCrypto}</span>
                <span className="text-slate-500 text-xs block mt-3 mb-1">Получатель:</span>
                <span className="text-white font-mono text-xs">@{recipient.trim().replace(/^@/, '')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button 
                onClick={() => { setShowConfirm(false); confirmSend(); }}
                className="flex-1 py-3.5 rounded-xl bg-[#0088cc] text-white font-bold text-sm hover:bg-[#0099e6] transition-colors cursor-pointer"
              >
                Перевести
              </button>
            </div>
          </div>
        </div>
      )}
<div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-sky-400" />
              <span>Перевод пользователю</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Мгновенный перевод по @username без комиссии (0%)
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedTx ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Перевод успешно отправлен!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Средства мгновенно зачислены получателю {completedTx.counterparty}
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Сумма:</span>
                <span className="text-white font-bold font-mono">
                  {completedTx.amount} {completedTx.cryptoId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Сеть блокчейна:</span>
                <span className="text-sky-400 font-bold font-mono">
                  {completedTx.networkId || selectedNetwork}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Получатель:</span>
                <span className="text-sky-400 font-bold">{completedTx.counterparty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Комиссия:</span>
                <span className="text-emerald-400 font-bold">0% (Бесплатно)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#0088cc] hover:bg-[#0099e6] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Recipient username */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Получатель (@username или ID)
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setError(null);
                  }}
                  placeholder="durov или 129482910"
                  className="w-full bg-[#151c27] border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-white font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Crypto selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Валюта
                </label>
                <span className="text-xs text-slate-400">
                  Доступно:{' '}
                  <span className="text-white font-bold font-mono">
                    {currentBalance} {selectedCrypto}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {CRYPTO_LIST.map((item) => {
                  const isSelected = item.id === selectedCrypto;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCryptoChange(item.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500 text-white'
                          : 'bg-[#161e2e] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <CryptoIcon id={item.id} size={22} />
                      <span className="text-xs font-bold font-mono">{item.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Network Dropdown component for selecting blockchain network */}
            <div>
              <NetworkDropdown
                id="transfer-network-select"
                label="Сеть блокчейна для перевода"
                selectedNetwork={selectedNetwork}
                onSelectNetwork={setSelectedNetwork}
                availableNetworks={availableNetworks}
                showFeeDetails={true}
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Сумма
                </label>
                <div className="flex items-center gap-1.5">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercent(pct)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {pct === 100 ? 'MAX' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className="w-full bg-[#151c27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-base outline-none focus:border-sky-500 font-bold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-400">
                  {selectedCrypto}
                </span>
              </div>
            </div>

            <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Комиссия бота:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                0% (Мгновенно)
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={parsedAmount <= 0}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                parsedAmount <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0088cc] hover:bg-[#0099e6] active:scale-[0.99] text-white shadow-sky-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Отправить {parsedAmount > 0 ? `${parsedAmount} ${selectedCrypto}` : ''}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
