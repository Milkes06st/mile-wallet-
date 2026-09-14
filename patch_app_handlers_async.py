import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_withdraw = """  const handleWithdraw = (cryptoId: CryptoId, amount: number, networkId: any, targetAddress: string, memo?: string) => {
    const res = wallet.withdraw(cryptoId, amount, networkId, targetAddress, memo);
    if (res.success && targetAddress) {
      addToast({
        title: 'Вывод средств инициирован',
        message: `${amount} ${cryptoId} отправлено на ${targetAddress.substring(0, 6)}...`,
        type: 'info',
      });
    }
    return res;
  };"""

new_withdraw = """  const handleWithdraw = async (cryptoId: CryptoId, amount: number, networkId: any, targetAddress: string, memo?: string) => {
    const res = await wallet.withdraw(cryptoId, amount, networkId, targetAddress, memo);
    if (res.success && targetAddress) {
      addToast({
        title: 'Вывод средств инициирован',
        message: `${amount} ${cryptoId} отправлено на ${targetAddress.substring(0, 6)}...`,
        type: 'info',
      });
    }
    return res;
  };"""

content = content.replace(old_withdraw, new_withdraw)

old_transfer = """  const handleTransfer = (cryptoId: CryptoId, amount: number, userId: string, networkId?: any) => {
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

new_transfer = """  const handleTransfer = async (cryptoId: CryptoId, amount: number, userId: string, networkId?: any) => {
    const res = await wallet.transfer(cryptoId, amount, userId, networkId);
    if (res.success) {
      addToast({
        title: 'Перевод выполнен',
        message: `${amount} ${cryptoId} отправлено пользователю ${userId}`,
        type: 'success',
      });
    }
    return res;
  };"""

content = content.replace(old_transfer, new_transfer)

with open('src/App.tsx', 'w') as f:
    f.write(content)
