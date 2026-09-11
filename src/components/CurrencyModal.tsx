import React from 'react';
import { X, Check } from 'lucide-react';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Against RUB for now, or just rate logic
  color: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', name: 'Доллар США', symbol: '$', rate: 1 / 92, color: 'bg-emerald-500' },
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', rate: 1, color: 'bg-indigo-500' },
  { code: 'EUR', name: 'Евро', symbol: '€', rate: 1 / 100, color: 'bg-amber-500' },
  { code: 'BYN', name: 'Белорусский рубль', symbol: 'Br', rate: 1 / 28, color: 'bg-sky-500' },
  { code: 'UAH', name: 'Гривна', symbol: '₴', rate: 1 / 2.5, color: 'bg-emerald-400' },
  { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', rate: 1 / 117, color: 'bg-indigo-400' },
  { code: 'CNY', name: 'Юань', symbol: '¥', rate: 1 / 12.8, color: 'bg-amber-500' },
  { code: 'KZT', name: 'Тенге', symbol: '₸', rate: 4.8, color: 'bg-sky-400' },
  { code: 'UZS', name: 'Узбекский сум', symbol: "so'm", rate: 136, color: 'bg-emerald-500' },
  { code: 'GEL', name: 'Лари', symbol: '₾', rate: 1 / 34, color: 'bg-indigo-400' },
  { code: 'TRY', name: 'Турецкая лира', symbol: '₺', rate: 1 / 2.9, color: 'bg-amber-500' },
  { code: 'KRW', name: 'Вона', symbol: '₩', rate: 14.5, color: 'bg-sky-500' },
  { code: 'TJS', name: 'Сомони', symbol: 'SM', rate: 1 / 8.5, color: 'bg-emerald-400' },
  { code: 'PLN', name: 'Злотый', symbol: 'zł', rate: 1 / 23, color: 'bg-indigo-500' },
  { code: 'THB', name: 'Бат', symbol: '฿', rate: 1 / 2.5, color: 'bg-amber-500' },
];

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCurrencyCode: string;
  onSelectCurrency: (code: string) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  activeCurrencyCode,
  onSelectCurrency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full bg-[#0a0a0a] rounded-t-[24px] flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-2xl font-bold text-white tracking-tight">Валюта кошелька</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 pb-safe-or-8">
          {CURRENCIES.map((currency) => (
            <div
              key={currency.code}
              onClick={() => {
                onSelectCurrency(currency.code);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-lg ${currency.color}`}>
                  {currency.symbol}
                </div>
                <div>
                  <div className="text-base font-medium text-white">{currency.code}</div>
                  <div className="text-sm text-slate-400">{currency.name}</div>
                </div>
              </div>
              
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${activeCurrencyCode === currency.code ? 'border-sky-500' : 'border-slate-700'}`}>
                {activeCurrencyCode === currency.code && (
                  <div className="w-3 h-3 rounded-full bg-sky-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
