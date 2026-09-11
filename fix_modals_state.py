with open('src/components/WithdrawModal.tsx', 'r') as f:
    content = f.read()

if "const [showConfirm, setShowConfirm] = useState(false);" not in content:
    content = content.replace("const [error, setError] = useState<string | null>(null);", "const [error, setError] = useState<string | null>(null);\n  const [showConfirm, setShowConfirm] = useState(false);")
content = content.replace("const handleSubmitWithdraw = () => {", "const handleConfirmWithdraw = () => {")

with open('src/components/WithdrawModal.tsx', 'w') as f:
    f.write(content)

with open('src/components/TransferModal.tsx', 'r') as f:
    content = f.read()

if "const [showConfirm, setShowConfirm] = useState(false);" not in content:
    content = content.replace("const [error, setError] = useState<string | null>(null);", "const [error, setError] = useState<string | null>(null);\n  const [showConfirm, setShowConfirm] = useState(false);")
content = content.replace("const handleSubmitTransfer = () => {", "const handleConfirmTransfer = () => {")

with open('src/components/TransferModal.tsx', 'w') as f:
    f.write(content)

