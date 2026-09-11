import React from 'react';
import { X } from 'lucide-react';

export type CoinFilterOption = 'all' | 'hide_under_1' | 'hide_zero';

interface CoinListModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: CoinFilterOption;
  onSelectOption: (option: CoinFilterOption) => void;
}

export const CoinListModal: React.FC<CoinListModalProps> = ({
  isOpen,
  onClose,
  selectedOption,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  const options: { id: CoinFilterOption; label: string }[] = [
    { id: 'all', label: 'Показывать все' },
    { id: 'hide_under_1', label: 'Скрывать активы менее $1' },
    { id: 'hide_zero', label: 'Скрывать нулевые активы' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full bg-[#0a0a0a] rounded-t-[24px] flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-2xl font-bold text-white tracking-tight">Список монет</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col px-4 pb-12">
          <div className="bg-[#141414] rounded-2xl overflow-hidden border border-white/5">
            {options.map((opt, index) => (
              <div
                key={opt.id}
                onClick={() => {
                  onSelectOption(opt.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                  index !== options.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <span className="text-base font-medium text-white">{opt.label}</span>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${selectedOption === opt.id ? 'border-sky-500' : 'border-slate-700'}`}>
                  {selectedOption === opt.id && (
                    <div className="w-3 h-3 rounded-full bg-sky-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
