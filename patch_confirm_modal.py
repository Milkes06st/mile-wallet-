import re

with open('src/components/WithdrawModal.tsx', 'r') as f:
    content = f.read()

# Make the confirm modal more robust with warning icon
old_confirm_modal = """      {showConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#151c27] w-full max-w-sm rounded-2xl p-6 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Подтверждение вывода</h3>
            <p className="text-sm text-slate-300 mb-6">Вы уверены, что хотите вывести {parsedAmount} {selectedCrypto} на адрес {address}?</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={() => { setShowConfirm(false); handleConfirmWithdraw(); }}
                className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-colors"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}"""

new_confirm_modal = """      {showConfirm && (
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
      )}"""

content = content.replace(old_confirm_modal, new_confirm_modal)

# Check if AlertTriangle is imported from lucide-react
if 'AlertTriangle' not in content:
    content = content.replace("AlertCircle,", "AlertCircle, AlertTriangle,")

with open('src/components/WithdrawModal.tsx', 'w') as f:
    f.write(content)
