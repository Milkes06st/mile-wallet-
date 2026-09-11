import re

def refactor_withdraw():
    with open('src/components/WithdrawModal.tsx', 'r') as f:
        content = f.read()

    # Make full screen
    content = content.replace('bg-black/60 backdrop-blur-sm p-4 sm:p-6', 'bg-[#0a0d14]')
    content = content.replace('max-w-md w-full max-h-[90vh] bg-[#10141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col', 'w-full h-full bg-[#0a0d14] flex flex-col pt-safe pb-safe')

    # Add Confirm modal state
    if 'const [showConfirm, setShowConfirm] = useState(false);' not in content:
        content = content.replace('const [isBroadcasting, setIsBroadcasting] = useState(false);', 'const [isBroadcasting, setIsBroadcasting] = useState(false);\n  const [showConfirm, setShowConfirm] = useState(false);')

    # Update handleSubmitWithdraw
    content = content.replace('const handleSubmitWithdraw = async () => {', 'const handleConfirmWithdraw = async () => {')
    content = content.replace('onClick={handleSubmitWithdraw}', 'onClick={() => setShowConfirm(true)}')
    
    # Add Confirmation Modal JSX inside return
    confirm_jsx = """
      {/* Confirmation Modal Overlay */}
      {showConfirm && (
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
      )}
"""
    content = content.replace('return (\n    <div', 'return (\n    <div') # Need to find a good place
    content = re.sub(r'(return \(\n\s*<div.*?>)', r'\1' + confirm_jsx, content, count=1)

    with open('src/components/WithdrawModal.tsx', 'w') as f:
        f.write(content)

def refactor_transfer():
    with open('src/components/TransferModal.tsx', 'r') as f:
        content = f.read()

    # Make full screen
    content = content.replace('bg-black/60 backdrop-blur-sm p-4 sm:p-6', 'bg-[#0a0d14]')
    content = content.replace('max-w-md w-full max-h-[90vh] bg-[#10141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col', 'w-full h-full bg-[#0a0d14] flex flex-col pt-safe pb-safe')

    # Add Confirm modal state
    if 'const [showConfirm, setShowConfirm] = useState(false);' not in content:
        content = content.replace('const [isBroadcasting, setIsBroadcasting] = useState(false);', 'const [isBroadcasting, setIsBroadcasting] = useState(false);\n  const [showConfirm, setShowConfirm] = useState(false);')

    # Update handleSubmitTransfer
    content = content.replace('const handleSubmitTransfer = async () => {', 'const handleConfirmTransfer = async () => {')
    content = content.replace('onClick={handleSubmitTransfer}', 'onClick={() => setShowConfirm(true)}')
    
    # Add Confirmation Modal JSX inside return
    confirm_jsx = """
      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#151c27] w-full max-w-sm rounded-2xl p-6 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Подтверждение перевода</h3>
            <p className="text-sm text-slate-300 mb-6">Вы уверены, что хотите перевести {parsedAmount} {selectedCrypto} пользователю {recipient}?</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={() => { setShowConfirm(false); handleConfirmTransfer(); }}
                className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-colors"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
"""
    content = re.sub(r'(return \(\n\s*<div.*?>)', r'\1' + confirm_jsx, content, count=1)

    with open('src/components/TransferModal.tsx', 'w') as f:
        f.write(content)

def refactor_deposit():
    with open('src/components/DepositModal.tsx', 'r') as f:
        content = f.read()

    # Make full screen
    content = content.replace('bg-black/60 backdrop-blur-sm p-4 sm:p-6', 'bg-[#0a0d14]')
    content = content.replace('max-w-md w-full max-h-[90vh] bg-[#10141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col', 'w-full h-full bg-[#0a0d14] flex flex-col pt-safe pb-safe')

    with open('src/components/DepositModal.tsx', 'w') as f:
        f.write(content)

refactor_withdraw()
refactor_transfer()
refactor_deposit()
