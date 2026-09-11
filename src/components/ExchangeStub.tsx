import React from 'react';
import { BarChart2 } from 'lucide-react';

export const ExchangeStub: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
      <div className="w-20 h-20 rounded-full bg-sky-500/10 flex items-center justify-center mb-6">
        <BarChart2 className="w-10 h-10 text-sky-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Биржа</h2>
      <p className="text-slate-400 text-[15px] max-w-xs mx-auto leading-relaxed">
        Мгновенный обмен криптовалют по лучшему курсу. Раздел находится в стадии разработки.
      </p>
    </div>
  );
};
