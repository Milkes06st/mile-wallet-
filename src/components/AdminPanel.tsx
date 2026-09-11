import React, { useState } from 'react';
import {
  CryptoCheck,
  ActivationAttempt,
  CryptoId,
  NetworkId,
  CryptoItem,
} from '../types';
import { CRYPTO_LIST, NETWORKS } from '../data/cryptoData';
import { CryptoIcon } from './CryptoIcons';
import { NetworkDropdown } from './NetworkDropdown';
import { useCryptoRates } from '../services/rateService';
import {
  Settings,
  BarChart3,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Save,
  Check,
  ArrowRight,
  Layers,
  Edit3,
  UserCheck,
  Sparkles,
  Zap,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface AdminPanelProps {
  check: CryptoCheck;
  attempts: ActivationAttempt[];
  onUpdateCheck: (updated: CryptoCheck) => void;
  onApproveAttempt: (attemptId: string, customAmount?: number, customPrize?: string) => void;
  onRejectAttempt: (attemptId: string) => void;
  onClearAttempts: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  check,
  attempts,
  onUpdateCheck,
  onApproveAttempt,
  onRejectAttempt,
  onClearAttempts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'check_config' | 'attempts' | 'presets'>('attempts');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Check form state
  const [cryptoId, setCryptoId] = useState<CryptoId>(check.cryptoId);
  const [networkId, setNetworkId] = useState<NetworkId>(check.networkId);
  const [totalAmount, setTotalAmount] = useState<number>(check.totalAmount);
  const [perUserAmount, setPerUserAmount] = useState<number>(check.perUserAmount);
  const [maxActivations, setMaxActivations] = useState<number>(check.maxActivations);
  const [autoPayout, setAutoPayout] = useState<boolean>(check.autoPayout);
  const [prizeTemplate, setPrizeTemplate] = useState<string>(check.prizeTemplate);
  const [description, setDescription] = useState<string>(check.description);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Manual amount edit modal state
  const [editingAttempt, setEditingAttempt] = useState<ActivationAttempt | null>(null);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [customPrizeInput, setCustomPrizeInput] = useState<string>('');

  // Live real-time crypto rates
  const { rates, isUpdating, refreshRates } = useCryptoRates();

  const currentCrypto = CRYPTO_LIST.find((c) => c.id === cryptoId) || CRYPTO_LIST[0];

  // When crypto changes, auto-select its first available network if current network is incompatible
  const handleCryptoChange = (newCryptoId: CryptoId) => {
    setCryptoId(newCryptoId);
    const selected = CRYPTO_LIST.find((c) => c.id === newCryptoId);
    if (selected && !selected.networks.some((n) => n.id === networkId)) {
      setNetworkId(selected.networks[0].id);
    }
  };

  const handleSaveCheck = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCheck({
      ...check,
      cryptoId,
      networkId,
      totalAmount: Number(totalAmount) || 1,
      perUserAmount: Number(perUserAmount) || 0.1,
      maxActivations: Number(maxActivations) || 1,
      autoPayout,
      prizeTemplate: prizeTemplate.trim() || 'CHECK-PRIZE-CLAIM',
      description: description.trim() || 'Пройдите проверку капчи и нажмите кнопку "Активировать"',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleApplyPreset = (preset: {
    cryptoId: CryptoId;
    networkId: NetworkId;
    totalAmount: number;
    perUserAmount: number;
    maxActivations: number;
    autoPayout: boolean;
    prizeTemplate: string;
    description: string;
  }) => {
    setCryptoId(preset.cryptoId);
    setNetworkId(preset.networkId);
    setTotalAmount(preset.totalAmount);
    setPerUserAmount(preset.perUserAmount);
    setMaxActivations(preset.maxActivations);
    setAutoPayout(preset.autoPayout);
    setPrizeTemplate(preset.prizeTemplate);
    setDescription(preset.description);

    onUpdateCheck({
      ...check,
      ...preset,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Open modal to edit custom amount or approve
  const handleOpenApproveModal = (attempt: ActivationAttempt) => {
    setEditingAttempt(attempt);
    setCustomAmountInput((attempt.adminCustomAmount ?? attempt.amount).toString());
    setCustomPrizeInput(
      attempt.prizeDelivered || `${check.prizeTemplate}-${Math.floor(1000 + Math.random() * 9000)}`
    );
  };

  const handleConfirmApproval = () => {
    if (!editingAttempt) return;
    const parsedAmount = parseFloat(customAmountInput);
    const finalAmount = isNaN(parsedAmount) ? editingAttempt.amount : parsedAmount;
    onApproveAttempt(editingAttempt.id, finalAmount, customPrizeInput);
    setEditingAttempt(null);
  };

  // Filter attempts
  const filteredAttempts = attempts.filter((att) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return att.status === 'pending_admin';
    if (filterStatus === 'approved') return att.status === 'approved';
    if (filterStatus === 'rejected') return att.status === 'rejected';
    return true;
  });

  const pendingCount = attempts.filter((a) => a.status === 'pending_admin').length;
  const approvedCount = attempts.filter((a) => a.status === 'approved').length;
  const totalPaidOut = attempts
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => sum + (a.adminCustomAmount ?? a.amount), 0);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0d111a] border border-slate-800 rounded-2xl shadow-2xl text-white overflow-hidden my-4">
      {/* Admin Top Header */}
      <div className="px-6 py-4 bg-[#131824] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7 text-sky-400" />
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Панель управления чеками</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Admin Control
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Настройка параметров чека, капчи, сетей и выдача призов
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Rate Ticker in Header */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#182030] border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono">
              1 {check.cryptoId} ≈ {rates[check.cryptoId]?.rub ?? 0.28} ₽
            </span>
            <button
              type="button"
              onClick={refreshRates}
              title="Обновить курс валют"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0088cc] hover:bg-[#0099e6] active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>К виду бота</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="px-6 pt-3 bg-[#0f1420] border-b border-slate-800 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('attempts')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border-t-2 ${
            activeTab === 'attempts'
              ? 'bg-[#161d2c] text-white border-sky-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Статистика и Заявки</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('check_config')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border-t-2 ${
            activeTab === 'check_config'
              ? 'bg-[#161d2c] text-white border-sky-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>Создание / Настройка чека</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border-t-2 ${
            activeTab === 'presets'
              ? 'bg-[#161d2c] text-white border-sky-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Быстрые шаблоны</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* TAB 1: ATTEMPTS & STATS */}
        {activeTab === 'attempts' && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#151b27] border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Всего активаций</div>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                  <span>{check.currentActivations}</span>
                  <span className="text-xs text-slate-500">/ {check.maxActivations} макс.</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (check.currentActivations / check.maxActivations) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#151b27] border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Ожидают подтверждения</div>
                <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <span>{pendingCount}</span>
                  {pendingCount > 0 && <Clock className="w-4 h-4 text-amber-400 animate-pulse" />}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">Требуют решения админа</div>
              </div>

              <div className="bg-[#151b27] border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Выплачено призов</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {approvedCount}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Сумма: {totalPaidOut.toFixed(2)} {check.cryptoId}
                </div>
              </div>

              <div className="bg-[#151b27] border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1">Режим выдачи</div>
                <div className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                  {check.autoPayout ? (
                    <>
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Автовыдача</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 text-sm">Через админа</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Сеть: <span className="font-mono text-sky-400">{check.networkId}</span>
                </div>
              </div>
            </div>

            {/* Filter & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131824] p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Фильтр:</span>
                <div className="flex gap-1">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        filterStatus === status
                          ? 'bg-sky-500 text-white font-semibold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status === 'all' && `Все (${attempts.length})`}
                      {status === 'pending' && `Ожидают (${pendingCount})`}
                      {status === 'approved' && `Одобрено (${approvedCount})`}
                      {status === 'rejected' && 'Отклонено'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClearAttempts}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Очистить лог</span>
                </button>
              </div>
            </div>

            {/* Attempts Table */}
            <div className="bg-[#131824] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171f30] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Пользователь</th>
                      <th className="p-3.5">Капча</th>
                      <th className="p-3.5">Криптовалюта / Сеть</th>
                      <th className="p-3.5">Сумма приза</th>
                      <th className="p-3.5">Статус</th>
                      <th className="p-3.5 text-right">Действие (Выдача)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAttempts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center p-8 text-slate-400">
                          Пока нет заявок в выбранной категории
                        </td>
                      </tr>
                    ) : (
                      filteredAttempts.map((att) => {
                        const winAmount = att.adminCustomAmount !== undefined ? att.adminCustomAmount : att.amount;
                        return (
                          <tr key={att.id} className="hover:bg-[#192233] transition-colors">
                            {/* User column */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div
                                  style={{ backgroundColor: att.avatarColor }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs uppercase"
                                >
                                  {att.username.slice(0, 1)}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">@{att.username}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {att.userId} • {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Captcha Speed */}
                            <td className="p-3.5">
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{att.captchaDurationSeconds}с</span>
                              </div>
                            </td>

                            {/* Crypto & Network */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <CryptoIcon id={att.cryptoSymbol} size={18} />
                                <span className="font-bold text-white">{att.cryptoSymbol}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  {att.networkId}
                                </span>
                              </div>
                            </td>

                            {/* Prize Amount (with manual edit indicator) */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-white text-sm">
                                  {winAmount} {att.cryptoSymbol}
                                </span>
                                {att.adminCustomAmount !== undefined && (
                                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">
                                    Ручн.
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                ≈ {(winAmount * (att.cryptoSymbol === 'DFC' ? 0.28 : 92)).toFixed(2)} ₽
                              </div>
                            </td>

                            {/* Status */}
                            <td className="p-3.5">
                              {att.status === 'pending_admin' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-medium">
                                  <Clock className="w-3 h-3" />
                                  <span>Ожидает проверки</span>
                                </span>
                              )}
                              {att.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Выплачено</span>
                                </span>
                              )}
                              {att.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-medium">
                                  <XCircle className="w-3 h-3" />
                                  <span>Отклонено</span>
                                </span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {att.status === 'pending_admin' ? (
                                  <>
                                    <button
                                      onClick={() => handleOpenApproveModal(att)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                      <span>Выдать приз</span>
                                    </button>

                                    <button
                                      onClick={() => onRejectAttempt(att.id)}
                                      title="Отклонить заявку"
                                      className="p-1.5 bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleOpenApproveModal(att)}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3 text-sky-400" />
                                    <span>Сумма / Данные</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHECK CONFIGURATION */}
        {activeTab === 'check_config' && (
          <form onSubmit={handleSaveCheck} className="space-y-6 max-w-3xl">
            {/* Crypto Selection Grid with authentic SVG icons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                1. Выберите криптовалюту для чека (SVG иконки):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {CRYPTO_LIST.map((c) => {
                  const isSelected = cryptoId === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleCryptoChange(c.id)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-400 ring-1 ring-sky-400 text-white'
                          : 'bg-[#151b27] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <CryptoIcon id={c.id} size={26} />
                      <div className="min-w-0">
                        <div className="font-bold text-xs leading-tight truncate">{c.symbol}</div>
                        <div className="text-[10px] text-slate-400 truncate">{c.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

                        {/* Network Selection for this transaction */}
            <div className="z-40 relative">
              <NetworkDropdown
                id="admin-network-dropdown"
                label={`2. Выберите сеть для транзакции (${currentCrypto.symbol}):`}
                selectedNetwork={networkId}
                onSelectNetwork={setNetworkId}
                availableNetworks={currentCrypto.networks.map(n => n.id)}
                showFeeDetails={false}
              />
            </div>

            {/* Amount Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Общий банк чека ({cryptoId}):
                </label>
                <input
                  type="number"
                  step="any"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#151b27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  На 1 пользователя ({cryptoId}):
                </label>
                <input
                  type="number"
                  step="any"
                  value={perUserAmount}
                  onChange={(e) => setPerUserAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#151b27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Лимит активаций (кол-во чел.):
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxActivations}
                  onChange={(e) => setMaxActivations(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#151b27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Distribution Mode: Auto vs Admin Confirmation */}
            <div className="bg-[#151b27] border border-slate-800 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-white">
                3. Режим выдачи приза пользователю:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAutoPayout(true)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    autoPayout
                      ? 'bg-emerald-500/15 border-emerald-400 ring-1 ring-emerald-400'
                      : 'bg-[#111622] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm text-white">Авто-выдача чека</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Бот сразу автоматически выдает готовый чек/приз пользователю после успешного решения капчи.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAutoPayout(false)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    !autoPayout
                      ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-[#111622] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">Подтверждение администратором</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    После капчи создается заявка. Администратор проверяет ее и вручную выдает приз с возможностью корректировки суммы.
                  </p>
                </button>
              </div>
            </div>

            {/* Prize Payload & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Данные чека / Префикс приза:
                </label>
                <input
                  type="text"
                  value={prizeTemplate}
                  onChange={(e) => setPrizeTemplate(e.target.value)}
                  placeholder="CHECK-DFC-CLAIM или ссылка на чек https://t.me/..."
                  className="w-full bg-[#151b27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-sky-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Эти данные будут выданы пользователю (код ваучера, хеш транзакции или ссылка на чек).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Описание под заголовком чека:
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Выполните капчу и нажмите кнопку 'Активировать'"
                  className="w-full bg-[#151b27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#0088cc] hover:bg-[#0099e6] active:scale-95 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить настройки чека</span>
              </button>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>Настройки чека обновлены!</span>
                </div>
              )}
            </div>
          </form>
        )}

        {/* TAB 3: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4 max-w-2xl">
            <p className="text-xs text-slate-400">
              Быстро примените один из преднастроенных чеков (включая оригинал с DFC из вашего скриншота):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Preset 1: DFC (Screenshot replica) */}
              <div className="bg-[#151b27] border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-sky-500 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CryptoIcon id="DFC" size={26} />
                    <span className="font-bold text-white text-sm">Чек 6 DFC (Как на фото)</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    6 DFC суммарно, 1.5 DFC на пользователя, 10 активаций, сеть TON Network. Автовыдача приза.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleApplyPreset({
                      cryptoId: 'DFC',
                      networkId: 'TON',
                      totalAmount: 6,
                      perUserAmount: 1.5,
                      maxActivations: 10,
                      autoPayout: true,
                      prizeTemplate: 'CHECK-DFC-9938-CLAIM',
                      description: 'Пройдите проверку капчи и нажмите кнопку "Активировать"',
                    })
                  }
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Применить шаблон DFC
                </button>
              </div>

              {/* Preset 2: USDT Check */}
              <div className="bg-[#151b27] border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-sky-500 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CryptoIcon id="USDT" size={26} />
                    <span className="font-bold text-white text-sm">Раздача 100 USDT (TRC-20)</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    100 USDT в сети Tron (TRC-20). По 5 USDT на пользователя (20 активаций). Ручное подтверждение админом.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleApplyPreset({
                      cryptoId: 'USDT',
                      networkId: 'TRC20',
                      totalAmount: 100,
                      perUserAmount: 5,
                      maxActivations: 20,
                      autoPayout: false,
                      prizeTemplate: 'CHECK-USDT-TRC20-GIFT',
                      description: 'Пройдите проверку на бота и получите USDT в сети TRC-20',
                    })
                  }
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Применить USDT (TRC-20)
                </button>
              </div>

              {/* Preset 3: TON Giveaway */}
              <div className="bg-[#151b27] border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-sky-500 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CryptoIcon id="TON" size={26} />
                    <span className="font-bold text-white text-sm">Airdrop 25 TON</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    25 Toncoin в сети TON. 2.5 TON на человека (10 активаций). Моментальная авто-выдача.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleApplyPreset({
                      cryptoId: 'TON',
                      networkId: 'TON',
                      totalAmount: 25,
                      perUserAmount: 2.5,
                      maxActivations: 10,
                      autoPayout: true,
                      prizeTemplate: 'CHECK-TON-AIRDROP',
                      description: 'Получите 2.5 TON после быстрой проверки капчи',
                    })
                  }
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Применить TON Airdrop
                </button>
              </div>

              {/* Preset 4: NOTCOIN Check */}
              <div className="bg-[#151b27] border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-sky-500 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CryptoIcon id="NOT" size={26} />
                    <span className="font-bold text-white text-sm">Чек 500,000 NOT</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    500,000 NOT. 50,000 NOT на человека. Сеть TON Network.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleApplyPreset({
                      cryptoId: 'NOT',
                      networkId: 'TON',
                      totalAmount: 500000,
                      perUserAmount: 50000,
                      maxActivations: 10,
                      autoPayout: true,
                      prizeTemplate: 'CHECK-NOT-BONUS',
                      description: 'Пройдите капчу для начисления Notcoin',
                    })
                  }
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Применить Notcoin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Amount & Prize Approval Modal */}
      {editingAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161c28] border border-slate-700 rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>Выдача приза / Изменение суммы</span>
              </h3>
              <button
                onClick={() => setEditingAttempt(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Пользователь:</div>
                  <div className="font-bold text-white text-sm">@{editingAttempt.username}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400">Сеть:</div>
                  <div className="font-mono text-sky-400 font-bold">{editingAttempt.networkId}</div>
                </div>
              </div>

              {/* Requirement: "Сумму выйгреша так же могу писать вручную в админ-панели для каждой отдельной транзакции." */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Сумма выигрыша (ручной ввод для этой транзакции):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={customAmountInput}
                    onChange={(e) => setCustomAmountInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 font-bold">
                    {editingAttempt.cryptoSymbol}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Вы можете изменить сумму вручную для конкретного пользователя перед отправкой приза.
                </p>
              </div>

              {/* Prize Data to deliver */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Данные чека / Код приза (выдается пользователю):
                </label>
                <input
                  type="text"
                  value={customPrizeInput}
                  onChange={(e) => setCustomPrizeInput(e.target.value)}
                  placeholder="CHECK-CLAIM-XXXX или ссылка на чек"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingAttempt(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Подтвердить и выдать</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
