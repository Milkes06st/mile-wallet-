import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CryptoCheck, ActivationAttempt, CryptoId, NetworkId } from '../types';
import { CRYPTO_LIST, NETWORKS } from '../data/cryptoData';
import { ReceiptBadgeIcon, CryptoIcon } from './CryptoIcons';
import { HumanCaptcha } from './HumanCaptcha';
import { PrizeModal } from './PrizeModal';
import { useCryptoRates } from '../services/rateService';
import {
  X,
  MoreVertical,
  ChevronDown,
  Link2,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';

interface CheckViewProps {
  check: CryptoCheck;
  onActivateSuccess: (attempt: ActivationAttempt) => void;
  onOpenAdmin: () => void;
  onOpenWallet?: () => void;
  onClaimToWallet?: (cryptoId: CryptoId, amount: number, checkTitle: string, checkId: string) => void;
  onUpdateCheck?: (updates: Partial<CryptoCheck>) => void;
}

export const CheckView: React.FC<CheckViewProps> = ({
  check,
  onActivateSuccess,
  onOpenAdmin,
  onOpenWallet,
  onClaimToWallet,
  onUpdateCheck,
}) => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaSolveDuration, setCaptchaSolveDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeModalAttempt, setActiveModalAttempt] = useState<ActivationAttempt | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);

  // Live real-time rates
  const { rates, isUpdating, refreshRates, formatCryptoFiat } = useCryptoRates();

  const currentRate = rates[check.cryptoId] || rates.DFC;
  const totalFiat = formatCryptoFiat(check.totalAmount, check.cryptoId);
  const perUserFiat = formatCryptoFiat(check.perUserAmount, check.cryptoId);

  const remainingActivations = Math.max(0, check.maxActivations - check.currentActivations);

  // Available networks for current crypto
  const currentCryptoDef = CRYPTO_LIST.find((c) => c.id === check.cryptoId) || CRYPTO_LIST[0];
  const availableNetworks = currentCryptoDef.networks.map((n) => n.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://t.me/CryptoBot?start=chk_${check.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCaptchaVerified = (durationSeconds: number) => {
    setCaptchaVerified(true);
    setCaptchaSolveDuration(durationSeconds);
  };

  // Quick switch to 1 USDT test configuration
  const handleQuickSet1Usdt = (targetNetwork: NetworkId = 'TON') => {
    if (onUpdateCheck) {
      onUpdateCheck({
        cryptoId: 'USDT',
        networkId: targetNetwork,
        totalAmount: 1,
        perUserAmount: 1,
        currentActivations: 0,
        maxActivations: 100,
        title: 'Крипто-чек 1.0 USDT',
        description: 'Проверка работоспособности: чек на 1 USDT в сети ' + targetNetwork,
      });
    }
  };

  // Switch network
  const handleSelectNetwork = (networkId: NetworkId) => {
    if (onUpdateCheck) {
      onUpdateCheck({ networkId });
    }
  };

  // Switch crypto
  const handleSelectCrypto = (cryptoId: CryptoId) => {
    if (onUpdateCheck) {
      const def = CRYPTO_LIST.find((c) => c.id === cryptoId);
      const defaultNet = def?.networks[0]?.id || 'TON';
      const defaultAmt = cryptoId === 'USDT' ? 1 : cryptoId === 'TON' ? 1 : cryptoId === 'BTC' ? 0.0005 : 10;
      onUpdateCheck({
        cryptoId,
        networkId: defaultNet,
        totalAmount: defaultAmt,
        perUserAmount: defaultAmt,
      });
    }
  };

  // Switch amount
  const handleSelectAmount = (amt: number) => {
    if (onUpdateCheck) {
      onUpdateCheck({
        totalAmount: amt,
        perUserAmount: amt,
      });
    }
  };

  const handleActivateCheck = () => {
    if (!captchaVerified || isActivating) return;

    setIsActivating(true);

    const isAutoPayout = check.autoPayout;

    // Generate random realistic Telegram user for demo
    const randomUsernames = ['vlad_crypto', 'anton_ton', 'misha_trader', 'elena_web3', 'cryptoman_77'];
    const selectedUsername = randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
    const randomId = `id${Math.floor(100000 + Math.random() * 900000)}`;

    const newAttempt: ActivationAttempt = {
      id: `att_${Date.now().toString().slice(-6)}`,
      checkId: check.id,
      username: selectedUsername,
      userId: randomId,
      avatarColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
      timestamp: Date.now(),
      cryptoSymbol: check.cryptoId,
      networkId: check.networkId,
      amount: check.perUserAmount,
      fiatRub: parseFloat(perUserFiat.replace(/\s/g, '').replace(',', '.')) || (check.perUserAmount * currentRate.rub),
      status: isAutoPayout ? 'approved' : 'pending_admin',
      captchaDurationSeconds: captchaSolveDuration || 4.2,
      prizeDelivered: isAutoPayout ? `${check.prizeTemplate}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      adminNotes: isAutoPayout
        ? `Авто-выдача чека ${check.perUserAmount} ${check.cryptoId} (${check.networkId})`
        : 'Капча пройдена. Ожидает одобрения администратора',
      reviewedAt: isAutoPayout ? Date.now() : undefined,
    };

    setTimeout(() => {
      setIsActivating(false);
      onActivateSuccess(newAttempt);
      setActiveModalAttempt(newAttempt);

      if (isAutoPayout) {
        // Automatically credit the user's wallet
        if (onClaimToWallet) {
          onClaimToWallet(check.cryptoId, check.perUserAmount, check.title, check.id);
        }

        // Trigger celebratory confetti
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0088cc', '#38bdf8', '#34d399', '#facc15'],
        });
      }
    }, 450);
  };

  return (
    <div className="w-full flex-1 min-h-screen bg-[#0a0d14] text-white flex flex-col justify-between relative select-none font-sans overflow-x-hidden">
      {/* Main Content Area - Full Screen Responsive */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col items-center">
        {/* Document Receipt Icon directly on background */}
        <div className="mt-1 mb-2">
          <ReceiptBadgeIcon size={70} />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Чек</h1>
        <p className="text-xs text-slate-400 text-center max-w-md mb-4 leading-relaxed">
          {check.description || 'Пройдите проверку капчи и нажмите кнопку "Активировать"'}
        </p>

        {/* The Receipt Card */}
        <div className="w-full receipt-card rounded-2xl px-6 py-5 mb-5 shadow-2xl border border-slate-700/60">
          <div className="receipt-top-teeth" />
          <div className="receipt-bottom-teeth" />

          {/* Network tag & Mode badge */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setShowNetworkPicker(true)}
              title="Нажмите для смены сети"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs text-sky-400 font-mono transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Сеть: {check.networkId}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <div className="text-xs font-medium">
              {check.autoPayout ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  ⚡ Авто-выдача
                </span>
              ) : (
                <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  🛡️ Проверка админом
                </span>
              )}
            </div>
          </div>

          {/* Total Amount & Symbol (SVG icon directly on background) */}
          <div className="text-center py-2.5">
            <div className="flex items-center justify-center gap-3">
              <CryptoIcon id={check.cryptoId} size={40} />
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {check.totalAmount} {check.cryptoId}
              </div>
            </div>

            {/* Dynamic Real-Time Rate Display */}
            <div className="flex items-center justify-center gap-2.5 mt-2">
              <span className="text-base font-semibold text-slate-300 font-mono">
                ≈{totalFiat} ₽
              </span>

              <button
                type="button"
                onClick={refreshRates}
                title="Нажмите для принудительного обновления курса"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-sky-400 text-[11px] font-mono transition-colors cursor-pointer border border-slate-700/60"
              >
                <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
                <span>{isUpdating ? 'Курс обновляется...' : 'Курс обновляется'}</span>
              </button>
            </div>
          </div>

          {/* Dashed Separator Line with Label */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-dashed border-slate-700" />
            <span className="absolute bg-[#171c26] px-3.5 text-xs text-slate-400 whitespace-nowrap">
              Поделитесь и получайте награды
            </span>
          </div>

          {/* Row: На одного пользователя and Live Rate with Flash Direction */}
          <div className="flex items-center justify-between text-sm py-2.5 border-b border-slate-800">
            <div>
              <div className="text-slate-400 text-xs">На одного пользователя</div>
              <div className="text-white font-bold text-base mt-0.5">
                {check.perUserAmount} {check.cryptoId}
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live курс:
                </span>
                <span className="text-slate-200 font-mono font-bold">
                  1 {check.cryptoId} ≈ {currentRate.rub} ₽
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-400 text-xs font-mono">
                  (≈{perUserFiat} ₽)
                </span>
                <span
                  className={`text-[10px] font-mono px-1 rounded flex items-center ${
                    currentRate.change24h >= 0
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {currentRate.change24h >= 0 ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                  )}
                  {currentRate.change24h > 0 ? '+' : ''}
                  {currentRate.change24h}%
                </span>
              </div>
            </div>
          </div>

          {/* Referral / Share Link */}
          <div className="pt-3 flex items-center justify-between">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium cursor-pointer group"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
              <span className="group-hover:underline">
                {copiedLink ? 'Ссылка скопирована!' : 'Получить реферальную ссылку'}
              </span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Осталось: {remainingActivations}/{check.maxActivations}
            </span>
          </div>
        </div>

        {/* Captcha Section */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-2 mb-2 px-1">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              ПРОВЕРКА БЕЗОПАСНОСТИ (КАПЧА)
            </span>
          </div>

          {/* Interactive Human Captcha */}
          <HumanCaptcha
            onVerified={handleCaptchaVerified}
            onReset={() => setCaptchaVerified(false)}
            isCompleted={captchaVerified}
          />
        </div>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="w-full p-4 sm:p-5 bg-[#0a0d14]/95 backdrop-blur-md border-t border-slate-800/80 sticky bottom-0 z-30">
        <div className="w-full max-w-2xl mx-auto">
          <button
            type="button"
            id="btn-activate-check"
            onClick={handleActivateCheck}
            disabled={!captchaVerified || isActivating || remainingActivations <= 0}
            className={`w-full py-4 sm:py-4.5 rounded-2xl font-bold text-base sm:text-lg tracking-wide uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
              captchaVerified && remainingActivations > 0
                ? 'bg-[#0088cc] hover:bg-[#0099e6] active:scale-[0.99] text-white shadow-sky-500/25'
                : 'bg-[#1b2333] text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
          >
            {isActivating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Обработка чека...</span>
              </div>
            ) : remainingActivations <= 0 ? (
              <span>Лимит активаций исчерпан</span>
            ) : !captchaVerified ? (
              <span className="text-sm sm:text-base">Пройдите капчу выше для активации</span>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>АКТИВИРОВАТЬ ЧЕК ({check.perUserAmount} {check.cryptoId})</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Prize / Status Modal */}
      {activeModalAttempt && (
        <PrizeModal
          check={check}
          attempt={activeModalAttempt}
          onClose={() => setActiveModalAttempt(null)}
          onViewAdmin={onOpenAdmin}
          onOpenWallet={onOpenWallet}
          currentRateRub={currentRate.rub}
        />
      )}
    </div>
  );
};
