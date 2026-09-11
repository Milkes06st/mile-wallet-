import re

with open('src/components/TransferModal.tsx', 'r') as f:
    content = f.read()

# Add AlertTriangle to imports
if 'AlertTriangle' not in content:
    content = content.replace("AlertCircle,", "AlertCircle, AlertTriangle,")

# Add showConfirm state
content = content.replace("const [isSending, setIsSending] = useState(false);", "const [isSending, setIsSending] = useState(false);\n  const [showConfirm, setShowConfirm] = useState(false);")

# Update handleSend to handle actual send, and add a click handler for the button to setShowConfirm
# First, let's look at handleSend
# It's better to just replace the button onClick with setShowConfirm, and rename handleSend to confirmSend.
# Wait, handleSend has validation. We want validation BEFORE showing confirm.
# So handleSend should validate, then setShowConfirm(true), then confirmSend will do the transfer.

old_handle_send = """  const handleSend = () => {
    setError(null);

    const cleanRecipient = recipient.trim().replace(/^@/, '');
    if (!cleanRecipient) {
      setError('Введите @username получателя');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Введите сумму для перевода');
      return;
    }

    if (parsedAmount > currentBalance) {
      setError('Недостаточно средств');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const res = onTransfer(selectedCrypto, parsedAmount, cleanRecipient, selectedNetwork);
      if (res.success && res.transaction) {
        setCompletedTx(res.transaction);
      } else {
        setError(res.error || 'Ошибка перевода');
      }
      setIsSending(false);
    }, 1200);
  };"""

new_handle_send = """  const handleSend = () => {
    setError(null);

    const cleanRecipient = recipient.trim().replace(/^@/, '');
    if (!cleanRecipient) {
      setError('Введите @username получателя');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Введите сумму для перевода');
      return;
    }

    if (parsedAmount > currentBalance) {
      setError('Недостаточно средств');
      return;
    }

    setShowConfirm(true);
  };

  const confirmSend = () => {
    setIsSending(true);
    const cleanRecipient = recipient.trim().replace(/^@/, '');

    setTimeout(() => {
      const res = onTransfer(selectedCrypto, parsedAmount, cleanRecipient, selectedNetwork);
      if (res.success && res.transaction) {
        setCompletedTx(res.transaction);
      } else {
        setError(res.error || 'Ошибка перевода');
      }
      setIsSending(false);
    }, 1200);
  };"""

content = content.replace(old_handle_send, new_handle_send)

# Add confirm modal JSX
confirm_modal_jsx = """
      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#151c27] w-full max-w-sm rounded-3xl p-6 border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Подтверждение перевода</h3>
            <div className="text-sm text-slate-300 mb-6 text-center space-y-2">
              <p>Вы собираетесь перевести средства другому пользователю.</p>
              <div className="bg-[#0b0f17] rounded-xl p-3 text-left border border-slate-800 break-all">
                <span className="text-slate-500 text-xs block mb-1">Сумма:</span>
                <span className="text-white font-mono font-bold">{parsedAmount} {selectedCrypto}</span>
                <span className="text-slate-500 text-xs block mt-3 mb-1">Получатель:</span>
                <span className="text-white font-mono text-xs">@{recipient.trim().replace(/^@/, '')}</span>
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
                onClick={() => { setShowConfirm(false); confirmSend(); }}
                className="flex-1 py-3.5 rounded-xl bg-[#0088cc] text-white font-bold text-sm hover:bg-[#0099e6] transition-colors cursor-pointer"
              >
                Перевести
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("    <div className=\"fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2\">", "    <div className=\"fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2\">" + confirm_modal_jsx)

with open('src/components/TransferModal.tsx', 'w') as f:
    f.write(content)
