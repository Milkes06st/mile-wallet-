import React from 'react';
import { Users } from 'lucide-react';

export const P2PStub: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
        <Users className="w-10 h-10 text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">P2P Маркет</h2>
      <p className="text-slate-400 text-[15px] max-w-xs mx-auto leading-relaxed">
        Покупайте и продавайте криптовалюту напрямую другим пользователям. Скоро.
      </p>
    </div>
  );
};
