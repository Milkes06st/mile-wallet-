with open('src/components/TransferModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("onClick={() => { setShowConfirm(false); handleConfirmTransfer(); }}", "onClick={() => { setShowConfirm(false); handleSend(); }}")
content = content.replace("onClick={handleSend}", "onClick={() => setShowConfirm(true)}")

with open('src/components/TransferModal.tsx', 'w') as f:
    f.write(content)
