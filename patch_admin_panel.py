import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add NetworkDropdown import if missing
if "NetworkDropdown" not in content:
    content = content.replace("import { CryptoIcon } from './CryptoIcons';", "import { CryptoIcon } from './CryptoIcons';\nimport { NetworkDropdown } from './NetworkDropdown';")

# Replace network selection block
network_block_old = r'\{\/\* Network Selection for this transaction \*\/\}.*?<\/div>.*?<\/div>'

network_block_new = """            {/* Network Selection for this transaction */}
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

content = re.sub(
    r'\{\/\* Network Selection for this transaction \*\/\}.*?<\/div>.*?<\/div>.*?<\/div>',
    network_block_new,
    content,
    flags=re.DOTALL
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

