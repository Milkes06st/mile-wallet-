import re

with open('src/components/TransferModal.tsx', 'r') as f:
    content = f.read()

old_handle_send = """  const handleSend = () => {
    setError(null);

    const cleanUser = recipient.trim();
    if (!cleanUser) {
      setError('Укажите @username или ID получателя');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Введите сумму перевода');
      return;
    }

    if (currentBalance < parsedAmount) {
      setError(`Недостаточно средств. Ваш баланс: ${currentBalance} ${selectedCrypto}`);
      return;
    }

    const res = onTransfer(selectedCrypto, parsedAmount, cleanUser, selectedNetwork);
    if (res.success && res.transaction) {
      setCompletedTx(res.transaction);
    } else {
      setError(res.error || 'Ошибка перевода');
    }
  };"""

new_handle_send = """  const handleSend = () => {
    setError(null);

    const cleanUser = recipient.trim();
    if (!cleanUser) {
      setError('Укажите @username или ID получателя');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Введите сумму перевода');
      return;
    }

    if (currentBalance < parsedAmount) {
      setError(`Недостаточно средств. Ваш баланс: ${currentBalance} ${selectedCrypto}`);
      return;
    }
    
    setShowConfirm(true);
  };

  const confirmSend = () => {
    const cleanUser = recipient.trim();
    const res = onTransfer(selectedCrypto, parsedAmount, cleanUser, selectedNetwork);
    if (res.success && res.transaction) {
      setCompletedTx(res.transaction);
    } else {
      setError(res.error || 'Ошибка перевода');
    }
  };"""

content = content.replace(old_handle_send, new_handle_send)

# And earlier I already added a modal, but let's check if the old one is still there, because my previous regex didn't match and just added the modal to the bottom.
# Oh, looking at the grep output, there was an old modal. Let's find it.
old_modal_regex = r"\{/\* Confirmation Modal Overlay \*/\}.*?\{showConfirm && \(.*?Подтвердить.*?</div>\s*</div>\s*\)\}"
content = re.sub(old_modal_regex, "", content, flags=re.DOTALL)

with open('src/components/TransferModal.tsx', 'w') as f:
    f.write(content)
