import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace import
content = content.replace("import { CheckView } from './components/CheckView';", "import { CheckView } from './components/CheckView';\nimport { CheckStub } from './components/CheckStub';")

# Replace usage
old_usage = """            {tab === 'check' && (
              <div className="w-full flex-1 flex flex-col">
                <CheckView
                  key={resetKey}
                  check={check}
                  onActivateSuccess={handleActivateSuccess}
                  onOpenAdmin={() => setTab('admin')}
                  onOpenWallet={() => setTab('wallet')}
                  onClaimToWallet={handleClaimToWallet}
                  onUpdateCheck={setCheck}
                />
              </div>
            )}"""

new_usage = """            {tab === 'check' && <CheckStub />}"""

content = content.replace(old_usage, new_usage)

with open('src/App.tsx', 'w') as f:
    f.write(content)
