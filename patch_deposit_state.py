import re
with open('src/components/DepositModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const [copiedAddress, setCopiedAddress] = useState(false);',
    'const [copiedAddress, setCopiedAddress] = useState(false);\n  const [copiedContract, setCopiedContract] = useState(false);'
)

content = content.replace(
    'setCopiedAddress(true);\n                  setTimeout(() => setCopiedAddress(false), 2000);',
    'setCopiedContract(true);\n                  setTimeout(() => setCopiedContract(false), 2000);'
)

content = content.replace(
    '{copiedAddress ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-500" />}',
    '{copiedContract ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-500" />}'
)

with open('src/components/DepositModal.tsx', 'w') as f:
    f.write(content)
