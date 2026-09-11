import re
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Make sure NetworkDropdown is imported
if "NetworkDropdown" not in content:
    content = content.replace("import { CryptoIcon } from './CryptoIcons';", "import { CryptoIcon } from './CryptoIcons';\nimport { NetworkDropdown } from './NetworkDropdown';")

# Find the network selection block precisely
old_block = """            {/* Network Selection for this transaction */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                2. Выберите сеть для транзакции ({currentCrypto.symbol}):
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCrypto.networks.map((net) => {
                  const isSelected = networkId === net.id;
                  return (
                    <button
                      type="button"
                      key={net.id}
                      onClick={() => setNetworkId(net.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 ring-1 ring-indigo-400'
                          : 'bg-[#151b27] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      <span>{net.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">({net.badge})</span>
                    </button>
                  );
                })}
              </div>
            </div>"""

new_block = """            {/* Network Selection for this transaction */}
            <div className="z-40 relative">
              <NetworkDropdown
                id="admin-network-dropdown"
                label={`2. Выберите сеть для транзакции (${currentCrypto.symbol}):`}
                selectedNetwork={networkId}
                onSelectNetwork={setNetworkId}
                availableNetworks={currentCrypto.networks.map(n => n.id)}
                showFeeDetails={false}
              />
            </div>"""

content = content.replace(old_block, new_block)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
