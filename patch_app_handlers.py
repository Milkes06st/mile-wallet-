import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_handlers = """  const handleWithdraw = (cryptoId: CryptoId, amount: number, address: string) => {
    wallet.withdraw(cryptoId, amount, address);
    addToast({
      title: 'Вывод средств инициирован',
      message: `${amount} ${cryptoId} отправлено на ${address.substring(0, 6)}...`,
      type: 'info',
    });
  };

  const handleTransfer = (cryptoId: CryptoId, amount: number, userId: string) => {
    wallet.transfer(cryptoId, amount, userId);
    addToast({
      title: 'Перевод выполнен',
      message: `${amount} ${cryptoId} отправлено пользователю ${userId}`,
      type: 'success',
    });
  };"""

new_handlers = """  const handleWithdraw = (cryptoId: CryptoId, amount: number, networkId: any, targetAddress: string, memo?: string) => {
    const res = wallet.withdraw(cryptoId, amount, networkId, targetAddress, memo);
    if (res.success && targetAddress) {
      addToast({
        title: 'Вывод средств инициирован',
        message: `${amount} ${cryptoId} отправлено на ${targetAddress.substring(0, 6)}...`,
        type: 'info',
      });
    }
    return res;
  };

  const handleTransfer = (cryptoId: CryptoId, amount: number, userId: string, networkId?: any) => {
    const res = wallet.transfer(cryptoId, amount, userId, networkId);
    if (res.success) {
      addToast({
        title: 'Перевод выполнен',
        message: `${amount} ${cryptoId} отправлено пользователю ${userId}`,
        type: 'success',
      });
    }
    return res;
  };"""

content = content.replace(old_handlers, new_handlers)

with open('src/App.tsx', 'w') as f:
    f.write(content)
