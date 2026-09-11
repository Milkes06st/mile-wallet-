import React, { useState } from 'react';
import { WalletTransaction } from '../types';
import { CryptoIcon } from './CryptoIcons';
import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Ticket,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface TransactionDetailsModalProps {
  tx: WalletTransaction;
  onClose: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ tx, onClose }) => {
  const [copiedHash, setCopiedHash] = useState(false);

  const isPositive =
    tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'check_claim';

  const getTypeLabel = () => {
    switch (tx.type) {
      case 'deposit':
        return 'Пополнение';
      case 'withdraw':
        return 'Вывод средств';
      case 'transfer_out':
        return 'Перевод пользователю';
      case 'transfer_in':
        return 'Входящий перевод';
      case 'check_claim':
        return 'Активация чека';
      case 'check_create':
        return 'Создание чека';
      default:
        return 'Транзакция';
    }
  };

  const handleCopyHash = () => {
    if (tx.txHash) {
      navigator.clipboard.writeText(tx.txHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2">
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300">Детали транзакции</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount & Type Banner */}
        <div className="py-5 text-center">
          <div className="flex justify-center mb-3">
            <CryptoIcon id={tx.cryptoId} size={48} />
          </div>

          <div
            className={`text-3xl font-black font-mono tracking-tight ${
              isPositive ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {isPositive ? '+' : '-'}
            {tx.amount} {tx.cryptoId}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 mt-2 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{getTypeLabel()}</span>
          </div>
        </div>

        {/* Transaction details table */}
        <div className="bg-[#0b0f17] border border-slate-800/90 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Статус:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Подтверждено
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Дата и время:</span>
            <span className="text-slate-200 font-mono">
              {new Date(tx.timestamp).toLocaleString('ru-RU')}
            </span>
          </div>

          {tx.networkId && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Сеть блокчейна:</span>
              <span className="text-slate-200 font-medium">{tx.networkId}</span>
            </div>
          )}

          {tx.counterparty && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Контрагент / Получатель:</span>
              <span className="text-sky-400 font-mono text-[11px] truncate max-w-[200px]">
                {tx.counterparty}
              </span>
            </div>
          )}

          {tx.memo && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Memo/Tag:</span>
              <span className="text-slate-200 font-mono">{tx.memo}</span>
            </div>
          )}

          {tx.fee !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Комиссия:</span>
              <span className="text-slate-300 font-mono">
                {tx.fee === 0 ? '0 (Бесплатно)' : `${tx.fee} ${tx.cryptoId}`}
              </span>
            </div>
          )}

          {tx.notes && (
            <div className="pt-2 border-t border-slate-800 text-slate-400 text-[11px] leading-relaxed">
              {tx.notes}
            </div>
          )}

          {tx.txHash && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 block mb-1">Хэш в блокчейне (TxHash):</span>
              <div className="flex items-center gap-2 bg-[#141b27] rounded-xl px-2.5 py-1.5 border border-slate-700/60">
                <span className="font-mono text-[11px] text-sky-300 truncate flex-1 select-all">
                  {tx.txHash}
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-slate-400 hover:text-white cursor-pointer p-1"
                >
                  {copiedHash ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
