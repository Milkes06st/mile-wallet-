import React, { useState } from 'react';
import { CryptoCheck, ActivationAttempt } from '../types';
import { CryptoIcon } from './CryptoIcons';
import { CheckCircle, Clock, Copy, Check, ExternalLink, X, Gift, Shield, Wallet } from 'lucide-react';

interface PrizeModalProps {
  check: CryptoCheck;
  attempt: ActivationAttempt;
  onClose: () => void;
  onViewAdmin?: () => void;
  onOpenWallet?: () => void;
  currentRateRub?: number;
}

export const PrizeModal: React.FC<PrizeModalProps> = ({
  check,
  attempt,
  onClose,
  onViewAdmin,
  onOpenWallet,
  currentRateRub,
}) => {
  const [copied, setCopied] = useState(false);

  const displayAmount = attempt.adminCustomAmount !== undefined ? attempt.adminCustomAmount : attempt.amount;
  const isPending = attempt.status === 'pending_admin';
  const isApproved = attempt.status === 'approved';
  const rate = currentRateRub || (check.cryptoId === 'DFC' ? 0.28 : check.cryptoId === 'USDT' ? 92.4 : 352);

  const handleCopyPrize = () => {
    if (attempt.prizeDelivered) {
      navigator.clipboard.writeText(attempt.prizeDelivered);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="prize-modal-content"
        className="w-full max-w-sm bg-[#151a24] border border-[#2b3548] rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden"
      >
        {/* Background glow */}
        <div
          className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-30 ${
            isPending ? 'bg-amber-500' : 'bg-sky-500'
          }`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isApproved ? (
          /* SUCCESS / APPROVED STATE */
          <div className="text-center space-y-4">
            <Gift className="w-14 h-14 text-emerald-400 mx-auto" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Чек успешно активирован!</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">Вы получили приз</h3>
              <p className="text-xs text-slate-400 mt-1">Капча пройдена, средства отправлены пользователю</p>
            </div>

            {/* Prize card */}
            <div className="bg-[#1c2331] border border-[#2f3b50] rounded-2xl p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CryptoIcon id={check.cryptoId} size={32} />
                <span className="text-3xl font-extrabold text-white">
                  {displayAmount} {check.cryptoId}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-400">
                ≈ {(displayAmount * rate).toFixed(2)} ₽ • Сеть: {check.networkId}
              </div>

              {/* Delivered Prize Code / Voucher */}
              <div className="mt-3 pt-3 border-t border-slate-700/60">
                <div className="text-[11px] text-slate-400 mb-1.5 font-medium flex items-center justify-between">
                  <span>Данные чека / Код приза:</span>
                  <span className="text-emerald-400 font-mono text-[10px]">Активирован</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0e131d] border border-slate-700 rounded-xl p-2.5">
                  <span className="flex-1 font-mono text-xs text-sky-300 select-all truncate text-left">
                    {attempt.prizeDelivered || `${check.prizeTemplate}-${attempt.id.slice(0, 4).toUpperCase()}`}
                  </span>
                  <button
                    onClick={handleCopyPrize}
                    className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано' : 'Копия'}</span>
                  </button>
                </div>
              </div>

              {/* Wallet Credit Notice */}
              <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Зачислено на баланс кошелька:</span>
                </div>
                <span className="font-bold font-mono text-white">
                  +{displayAmount} {check.cryptoId}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {onOpenWallet && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWallet();
                  }}
                  className="w-full py-3 bg-[#0088cc] hover:bg-[#0099e6] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Перейти в кошелек</span>
                </button>
              )}

              <button
                onClick={onClose}
                className={`w-full py-2.5 font-medium text-xs rounded-xl transition-all cursor-pointer ${
                  onOpenWallet
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    : 'bg-[#0088cc] hover:bg-[#0099e6] text-white'
                }`}
              >
                Закрыть
              </button>

              {onViewAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onViewAdmin();
                  }}
                  className="w-full py-2 text-xs text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Посмотреть статистику в админ-панели →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PENDING ADMIN APPROVAL STATE */
          <div className="text-center space-y-4">
            <Clock className="w-14 h-14 text-amber-400 mx-auto animate-pulse" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Ожидает проверки администратора</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Капча успешно пройдена!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Для этого чека настроено ручное подтверждение администратором перед выдачей приза.
              </p>
            </div>

            {/* Claim details */}
            <div className="bg-[#1c2331] border border-[#2f3b50] rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Пользователь:</span>
                <span className="text-white font-medium">{attempt.username}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Запрошенный чек:</span>
                <span className="text-sky-400 font-medium">
                  {displayAmount} {check.cryptoId} ({check.networkId})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Время прохождения капчи:</span>
                <span className="text-emerald-400 font-mono">{attempt.captchaDurationSeconds} сек</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>ID заявки:</span>
                <span className="font-mono text-slate-300">{attempt.id}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-left flex items-start gap-2.5 text-xs text-sky-200">
              <Shield className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                Администратор может подтвердить заявку, изменить сумму вручную и отправить приз через админ-панель.
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {onViewAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onViewAdmin();
                  }}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Перейти в админ-панель и выдать приз
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Понятно, ждать подтверждения
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
