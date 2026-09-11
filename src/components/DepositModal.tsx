import React, { useState } from 'react';
import { CryptoId, NetworkId } from '../types';
import { CRYPTO_LIST } from '../data/cryptoData';
import { DEPOSIT_CONFIGS } from '../services/walletService';
import { RealCryptoService } from '../services/realCryptoService';
import { CryptoIcon } from './CryptoIcons';

import {
  X,
  ArrowLeft,
  MoreVertical,
  ChevronDown,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';

interface DepositModalProps {
  initialCryptoId?: CryptoId;
  onClose: () => void;
  onSimulateDeposit: (cryptoId: CryptoId, amount: number, networkId: NetworkId) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  initialCryptoId = 'USDT',
  onClose,
  onSimulateDeposit,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoId>(initialCryptoId);
  const cryptoItem = CRYPTO_LIST.find((c) => c.id === selectedCrypto) || CRYPTO_LIST[0];

  const availableNetworks = cryptoItem.networks.map((n) => n.id);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>(
    availableNetworks[0] || 'TON'
  );

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [testAmount, setTestAmount] = useState<number>(initialCryptoId === 'USDT' ? 1 : 10);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  const realTonWallet = RealCryptoService.getStoredWallet();
  const isRealTon = selectedCrypto === 'TON' && selectedNetwork === 'TON' && !!realTonWallet;

  const depositConfig = isRealTon
    ? {
        address: realTonWallet.address,
        network: 'TON' as NetworkId,
        minDeposit: 0.05,
      }
    : DEPOSIT_CONFIGS[selectedCrypto]?.[selectedNetwork] ||
      DEPOSIT_CONFIGS[selectedCrypto]?.['TON'] || {
        address: 'UQCE7QUXismmeSXE5icCg3zcwS-KblIkobh34wrw-QzsQrty',
        network: selectedNetwork,
        minDeposit: 0.1,
      };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositConfig.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleTestDeposit = () => {
    const amount = Number(testAmount) || 1;
    onSimulateDeposit(selectedCrypto, amount, selectedNetwork);
    setDepositSuccessMsg(`Зачислено +${amount} ${selectedCrypto}!`);
    setTimeout(() => {
        setDepositSuccessMsg(null);
        onClose();
    }, 1500);
  };

  // Mock contract address for UI
  const contractAddress = selectedCrypto === 'USDT' 
    ? 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'
    : 'Not available';

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2">
      {/* Top Header */}
      <div className="w-full px-4 pt-4 pb-2 flex items-center justify-end sticky top-0 z-30 bg-[#000000]">
        <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <h1 className="text-3xl font-bold text-white mt-4 mb-5 tracking-tight">
          Пополнить {cryptoItem.symbol}
        </h1>

        {/* Warning Box */}
        <div className="bg-[#1c2431] border border-slate-800 rounded-[20px] p-4 flex gap-3 items-start mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[14px] text-slate-200 leading-snug">
            Вносите только {cryptoItem.symbol} в сети The Open Network ({selectedNetwork})-{cryptoItem.symbol}. Если вы отправите другую монету или используете другую сеть, ваши средства будут потеряны.
          </p>
        </div>

        <label className="text-[15px] text-slate-400 block mb-2 px-1">
          Кошелёк для пополнения
        </label>

        {/* User Profile Selector */}
        <div className="bg-[#10141a] border border-slate-800/80 rounded-[20px] p-3 flex items-center justify-between mb-6 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center text-xl overflow-hidden">
                🐵
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#10141a] rounded-full p-0.5">
                <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">V</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-white">Wallet #1372429</div>
              <div className="text-[13px] text-slate-500 font-mono">
                {depositConfig.address.substring(0, 3)}...{depositConfig.address.substring(depositConfig.address.length - 5)}
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-5 h-5 text-slate-500 mr-2" />
        </div>

                {/* Info Block */}
        <div className="bg-[#10141a] border border-slate-800/80 rounded-[24px] overflow-hidden">
          {/* Network */}
          <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center">
              <CryptoIcon id="TON" size={28} />
            </div>
            <span className="text-[17px] text-slate-200">The Open Network ({selectedNetwork})</span>
          </div>
          
          {/* Contract Address */}
          {selectedCrypto !== 'TON' && (
            <div className="px-5 py-4 flex flex-col gap-1 border-b border-slate-800/60">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(contractAddress);
                  setCopiedContract(true);
                  setTimeout(() => setCopiedContract(false), 2000);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center">
                    <CryptoIcon id={selectedCrypto} size={28} />
                  </div>
                  <span className="text-[17px] text-slate-200">Адрес контракта ({cryptoItem.symbol})</span>
                </div>
                {copiedContract ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-500" />}
              </div>
              <div className="text-[14px] text-slate-400 font-mono break-all mt-1 pl-10">
                {contractAddress}
              </div>
            </div>
          )}

          {/* Wallet Address */}
          <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-[15px] text-slate-400 mb-1">Адрес кошелька</div>
              <div className="text-[17px] text-slate-200 font-mono break-all leading-tight">
                {depositConfig.address}
              </div>
            </div>
            <button
              onClick={handleCopyAddress}
              className="p-2 cursor-pointer transition-transform active:scale-95"
            >
              {copiedAddress ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6 text-slate-500" />}
            </button>
          </div>

          {/* Minimum Amount */}
          <div className="px-5 py-4 border-b border-slate-800/60">
            <div className="text-[15px] text-slate-400 mb-1">Минимальная сумма для пополнения</div>
            <div className="text-[17px] text-slate-200">
              {depositConfig.minDeposit} {cryptoItem.symbol}
            </div>
          </div>
        </div>

        {/* Hidden Test Deposit Feature for the user to quickly get funds */}
        <div className="mt-8 opacity-20 hover:opacity-100 transition-opacity flex flex-col items-center">
            <span className="text-xs text-slate-500 mb-2">Отладочное зачисление (Test Mode)</span>
            <div className="flex gap-2">
                 <button onClick={() => { setTestAmount(1); handleTestDeposit(); }} className="px-4 py-2 bg-sky-500 rounded-lg text-sm text-white font-bold">+1 {cryptoItem.symbol}</button>
                 <button onClick={() => { setTestAmount(10); handleTestDeposit(); }} className="px-4 py-2 bg-sky-500 rounded-lg text-sm text-white font-bold">+10 {cryptoItem.symbol}</button>
            </div>
            {depositSuccessMsg && <span className="text-emerald-500 text-sm mt-2">{depositSuccessMsg}</span>}
        </div>
      </div>
    </div>
  );
};
