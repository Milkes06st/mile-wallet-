import re
with open('src/components/DepositModal.tsx', 'r') as f:
    content = f.read()

new_info_block = """        {/* Info Block */}
        <div className="bg-[#10141a] border border-slate-800/80 rounded-[24px] overflow-hidden">
          {/* Network */}
          <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center">
              <CryptoIcon id="TON" size={28} />
            </div>
            <span className="text-[17px] text-slate-200">The Open Network ({selectedNetwork})</span>
          </div>
          
          {/* Contract Address */}
          {selectedCrypto !== 'TON' && (
            <div className="px-5 py-4 flex flex-col gap-1 border-b border-slate-800/60">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(contractAddress);
                  setCopiedContract(true);
                  setTimeout(() => setCopiedContract(false), 2000);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center">
                    <CryptoIcon id={selectedCrypto} size={28} />
                  </div>
                  <span className="text-[17px] text-slate-200">Адрес контракта ({cryptoItem.symbol})</span>
                </div>
                {copiedContract ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-500" />}
              </div>
              <div className="text-[14px] text-slate-400 font-mono break-all mt-1 pl-10">
                {contractAddress}
              </div>
            </div>
          )}

          {/* Wallet Address */}
          <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-[15px] text-slate-400 mb-1">Адрес кошелька</div>
              <div className="text-[17px] text-slate-200 font-mono break-all leading-tight">
                {depositConfig.address}
              </div>
            </div>
            <button
              onClick={handleCopyAddress}
              className="p-2 cursor-pointer transition-transform active:scale-95"
            >
              {copiedAddress ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6 text-slate-500" />}
            </button>
          </div>

          {/* Minimum Amount */}
          <div className="px-5 py-4 border-b border-slate-800/60">
            <div className="text-[15px] text-slate-400 mb-1">Минимальная сумма для пополнения</div>
            <div className="text-[17px] text-slate-200">
              {depositConfig.minDeposit} {cryptoItem.symbol}
            </div>
          </div>
        </div>"""

content = re.sub(
    r'\{\/\* Info Block \*\/\}.*?<\/div>\s*\{\/\* Hidden Test Deposit Feature',
    new_info_block + '\n\n        {/* Hidden Test Deposit Feature',
    content,
    flags=re.DOTALL
)

with open('src/components/DepositModal.tsx', 'w') as f:
    f.write(content)
