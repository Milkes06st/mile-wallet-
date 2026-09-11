import re
with open('src/components/DepositModal.tsx', 'r') as f:
    content = f.read()

# Remove TelegramVerifiedBadge import
content = content.replace("import { CryptoIcon, TelegramVerifiedBadge } from './CryptoIcons';", "import { CryptoIcon } from './CryptoIcons';")
# Remove TelegramVerifiedBadge usage
content = re.sub(r'<TelegramVerifiedBadge size=\{16\} />', '', content)

# Fix Contract Address display
contract_address_block = """          {/* Contract Address */}
          {selectedCrypto !== 'TON' && (
            <div className="px-5 py-4 flex flex-col gap-1 border-b border-slate-800/60">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(contractAddress);
                  setCopiedAddress(true);
                  setTimeout(() => setCopiedAddress(false), 2000);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center">
                    <CryptoIcon id={selectedCrypto} size={28} />
                  </div>
                  <span className="text-[17px] text-slate-200">Адрес контракта ({cryptoItem.symbol})</span>
                </div>
                {copiedAddress ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-500" />}
              </div>
              <div className="text-[14px] text-slate-400 font-mono break-all mt-1 pl-10">
                {contractAddress}
              </div>
            </div>
          )}"""

content = re.sub(
    r'\{\/\* Contract Address \*\/\}.*?<\/div>.*?<\/div>.*?<\/div>',
    contract_address_block,
    content,
    flags=re.DOTALL
)

with open('src/components/DepositModal.tsx', 'w') as f:
    f.write(content)
