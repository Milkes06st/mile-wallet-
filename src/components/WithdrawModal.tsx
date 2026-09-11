import React, { useState } from 'react';
import { CryptoId, NetworkId, WalletBalances, WalletTransaction } from '../types';
import { CRYPTO_LIST } from '../data/cryptoData';
import { NETWORK_FEES } from '../services/walletService';
import { RealCryptoService } from '../services/realCryptoService';
import { CryptoIcon } from './CryptoIcons';
import { validateAddress } from '../utils/validators';
import { NetworkDropdown } from './NetworkDropdown';
import {
  X,
  ArrowUpRight,
  Layers,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ClipboardPaste,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface WithdrawModalProps {
  initialCryptoId?: CryptoId;
  balances: WalletBalances;
  onClose: () => void;
  onWithdraw: (
    cryptoId: CryptoId,
    amount: number,
    networkId: NetworkId,
    targetAddress: string,
    memo?: string
  ) => { success: boolean; error?: string; transaction?: WalletTransaction };
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  initialCryptoId = 'TON',
  balances,
  onClose,
  onWithdraw,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoId>(initialCryptoId);
  const cryptoItem = CRYPTO_LIST.find((c) => c.id === selectedCrypto) || CRYPTO_LIST[0];

  const availableNetworks = cryptoItem.networks.map((n) => n.id);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>(
    availableNetworks[0] || 'TON'
  );

  const [address, setAddress] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [broadcastStage, setBroadcastStage] = useState<string>('');
  const [completedTx, setCompletedTx] = useState<WalletTransaction | null>(null);
  const [copiedTxHash, setCopiedTxHash] = useState(false);

  const currentBalance = balances[selectedCrypto] || 0;
  const feeInfo = NETWORK_FEES[selectedNetwork] || {
    feeAmount: 0.05,
    feeCrypto: selectedCrypto,
    minWithdraw: 0.1,
    estimatedTime: '~30 сек',
  };

  const parsedAmount = parseFloat(amountInput) || 0;
  const isSameCryptoFee = feeInfo.feeCrypto === selectedCrypto;
  const feeCryptoBalance = balances[feeInfo.feeCrypto] || 0;

  const totalDeducted = isSameCryptoFee ? parsedAmount + feeInfo.feeAmount : parsedAmount;
  const recipientGets = Math.max(0, parsedAmount);

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
    let target = (currentBalance * pct) / 100;
    if (pct === 100 && isSameCryptoFee) {
      target = Math.max(0, currentBalance - feeInfo.feeAmount);
    }
    setAmountInput(target > 0 ? target.toFixed(selectedCrypto === 'BTC' ? 6 : 4) : '0');
    setError(null);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setAddress(text.trim());
        setError(null);
      }
    } catch {
      // ignore
    }
  };

  const handleConfirmWithdraw = () => {
    setError(null);

    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setError('Введите адрес кошелька получателя');
      return;
    }

    if (!validateAddress(cleanAddress, selectedNetwork)) {
      setError(`Указан некорректный адрес для сети ${selectedNetwork}`);
      return;
    }

    if (parsedAmount <= 0) {
      setError('Введите сумму для вывода');
      return;
    }

    if (parsedAmount < feeInfo.minWithdraw) {
      setError(
        `Минимальная сумма вывода для сети ${selectedNetwork}: ${feeInfo.minWithdraw} ${selectedCrypto}`
      );
      return;
    }

    if (currentBalance < totalDeducted) {
      setError(
        `Недостаточно средств. Баланс: ${currentBalance} ${selectedCrypto}, требуется: ${totalDeducted.toFixed(
          4
        )} ${selectedCrypto}`
      );
      return;
    }

    if (!isSameCryptoFee && feeCryptoBalance < feeInfo.feeAmount) {
      setError(
        `Недостаточно ${feeInfo.feeCrypto} для покрытия сетевой комиссии (${feeInfo.feeAmount} ${feeInfo.feeCrypto})`
      );
      return;
    }

    // Check for real on-chain broadcast capability
    const storedWallet = RealCryptoService.getStoredWallet();
    const isRealTonBroadcast =
      selectedCrypto === 'TON' &&
      selectedNetwork === 'TON' &&
      !!storedWallet?.mnemonic &&
      parseFloat(storedWallet.balanceTon || '0') >= parsedAmount;

    const isRealUsdtBroadcast =
      selectedCrypto === 'USDT' &&
      selectedNetwork === 'TON' &&
      !!storedWallet?.mnemonic &&
      parseFloat(storedWallet.balanceUsdt || '0') >= parsedAmount &&
      parseFloat(storedWallet.balanceTon || '0') >= 0.05;

    const isRealOnChainBroadcast = isRealTonBroadcast || isRealUsdtBroadcast;

    // Start blockchain execution
    setIsBroadcasting(true);
    setBroadcastStage(
      isRealUsdtBroadcast
        ? 'Подпись Jetton-трансфера USDT ключом Ed25519...'
        : isRealTonBroadcast
        ? 'Криптографическая подпись ключом Ed25519...'
        : 'Проверка подписи транзакции...'
    );

    if (isRealOnChainBroadcast) {
      setTimeout(async () => {
        setBroadcastStage(
          isRealUsdtBroadcast
            ? 'Трансляция Jetton-перевода USDT в блокчейн The Open Network...'
            : 'Трансляция в блокчейн The Open Network...'
        );
        try {
          await RealCryptoService.sendOnChainTransfer(
            storedWallet.mnemonic,
            cleanAddress,
            parsedAmount,
            memo,
            selectedCrypto as 'TON' | 'USDT'
          );
          const res = onWithdraw(selectedCrypto, parsedAmount, selectedNetwork, cleanAddress, memo);
          setIsBroadcasting(false);
          if (res.success && res.transaction) {
            setCompletedTx(res.transaction);
          } else {
            setError(res.error || 'Ошибка при обновлении баланса');
          }
        } catch (err: any) {
          setIsBroadcasting(false);
          setError(err.message || 'Ошибка трансляции транзакции в сеть TON');
        }
      }, 1000);
      return;
    }

    setTimeout(() => {
      setBroadcastStage('Трансляция в блокчейн-ноду...');
    }, 600);

    setTimeout(() => {
      setBroadcastStage('Подтверждение в пуле мемпула...');
    }, 1200);

    setTimeout(() => {
      const res = onWithdraw(selectedCrypto, parsedAmount, selectedNetwork, cleanAddress, memo);
      setIsBroadcasting(false);
      if (res.success && res.transaction) {
        setCompletedTx(res.transaction);
      } else {
        setError(res.error || 'Ошибка при отправке вывода');
      }
    }, 1800);
  };

  const handleCopyTxHash = () => {
    if (completedTx?.txHash) {
      navigator.clipboard.writeText(completedTx.txHash);
      setCopiedTxHash(true);
      setTimeout(() => setCopiedTxHash(false), 2000);
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
            <h3 className="text-xl font-bold text-white mb-2 text-center">Подтверждение вывода</h3>
            <div className="text-sm text-slate-300 mb-6 text-center space-y-2">
              <p>Вы собираетесь перевести средства в другой кошелек. Это действие <strong>необратимо</strong>.</p>
              <div className="bg-[#0b0f17] rounded-xl p-3 text-left border border-slate-800 break-all">
                <span className="text-slate-500 text-xs block mb-1">Сумма:</span>
                <span className="text-white font-mono font-bold">{parsedAmount} {selectedCrypto}</span>
                <span className="text-slate-500 text-xs block mt-3 mb-1">Адрес ({selectedNetwork}):</span>
                <span className="text-white font-mono text-xs">{address}</span>
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
                onClick={() => { setShowConfirm(false); handleConfirmWithdraw(); }}
                className="flex-1 py-3.5 rounded-xl bg-[#0088cc] text-white font-bold text-sm hover:bg-[#0099e6] transition-colors cursor-pointer"
              >
                Вывести
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
              <ArrowUpRight className="w-5 h-5 text-sky-400" />
              <span>Вывод средств</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Отправка на любой внешний криптовалютный кошелек
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
          /* SUCCESS STATE */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Транзакция успешно отправлена!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Средства списаны с вашего кошелька и направлены в блокчейн
              </p>
            </div>

            <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Сумма перевода:</span>
                <span className="text-white font-bold font-mono">
                  {completedTx.amount} {completedTx.cryptoId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Сеть:</span>
                <span className="text-slate-200 font-medium">{completedTx.networkId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Комиссия сети:</span>
                <span className="text-slate-200 font-mono">
                  {completedTx.fee || 0} {feeInfo.feeCrypto}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Получатель:</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                  {completedTx.counterparty}
                </span>
              </div>
              {completedTx.memo && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Memo/Tag:</span>
                  <span className="text-slate-300 font-mono">{completedTx.memo}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block mb-1">Хэш транзакции (TxHash):</span>
                <div className="flex items-center gap-2 bg-[#141b27] rounded-xl px-2.5 py-1.5 border border-slate-700/60">
                  <span className="font-mono text-[11px] text-sky-300 truncate flex-1">
                    {completedTx.txHash}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTxHash}
                    className="text-slate-400 hover:text-white cursor-pointer p-1"
                  >
                    {copiedTxHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#0088cc] hover:bg-[#0099e6] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Отлично, закрыть
            </button>
          </div>
        ) : (
          /* FORM BODY */
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Crypto selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Валюта для вывода
                </label>
                <span className="text-xs text-slate-400">
                  Баланс:{' '}
                  <span className="text-white font-bold font-mono">
                    {currentBalance} {selectedCrypto}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {CRYPTO_LIST.map((item) => {
                  const isSelected = item.id === selectedCrypto;
                  const bal = balances[item.id] || 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCryptoChange(item.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                          : 'bg-[#161e2e] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <CryptoIcon id={item.id} size={24} />
                      <span className="text-xs font-bold font-mono">{item.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {bal > 0 ? (bal < 1 ? bal.toFixed(3) : bal.toFixed(1)) : '0'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Network Selector Dropdown */}
            <div>
              <NetworkDropdown
                id="withdraw-network-dropdown"
                label="Сеть вывода (блокчейн)"
                selectedNetwork={selectedNetwork}
                onSelectNetwork={setSelectedNetwork}
                availableNetworks={availableNetworks}
                showFeeDetails={true}
              />
            </div>

            {/* Address Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Адрес кошелька получателя
                </label>
                <button
                  type="button"
                  onClick={handlePasteAddress}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Вставить</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError(null);
                  }}
                  placeholder={`Введите адрес ${selectedNetwork}`}
                  className="w-full bg-[#151c27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs outline-none focus:border-sky-500 pr-10"
                />
                {address && (
                  <button
                    type="button"
                    onClick={() => setAddress('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Memo / Tag Input (Optional) */}
            {(selectedNetwork === 'TON' || selectedNetwork === 'BEP20' || selectedCrypto === 'TON') && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Memo / Destination Tag (при выводе на биржу)
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Оставьте пустым, если отправляете на личный кошелек"
                  className="w-full bg-[#151c27] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>
            )}

            {/* Amount Input with Shortcuts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Сумма перевода
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

            {/* Fee & Summary Details */}
            <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Комиссия сети (Gas Fee):</span>
                <span className="text-slate-200 font-mono font-semibold">
                  {feeInfo.feeAmount} {feeInfo.feeCrypto}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Примерное время зачисления:</span>
                <span className="text-slate-300 font-medium">{feeInfo.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Минимальный вывод:</span>
                <span className="text-slate-300 font-mono">
                  {feeInfo.minWithdraw} {selectedCrypto}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-300 font-semibold">Получатель получит:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {recipientGets > 0 ? recipientGets : 0} {selectedCrypto}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Broadcasting state */}
            {isBroadcasting && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs flex items-center gap-3 animate-pulse">
                <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <div>
                  <div className="font-bold">Выполняется отправка в блокчейн...</div>
                  <div className="text-[11px] text-slate-300">{broadcastStage}</div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={isBroadcasting || parsedAmount <= 0}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                isBroadcasting || parsedAmount <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0088cc] hover:bg-[#0099e6] active:scale-[0.99] text-white shadow-sky-500/20'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Подтвердить и вывести {parsedAmount > 0 ? `${parsedAmount} ${selectedCrypto}` : ''}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
