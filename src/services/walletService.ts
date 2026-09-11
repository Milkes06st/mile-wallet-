import { useState, useEffect, useCallback } from 'react';
import {
  CryptoId,
  NetworkId,
  WalletBalances,
  WalletTransaction,
  NetworkFeeInfo,
} from '../types';

export const INITIAL_BALANCES: WalletBalances = {
  TON: 0,
  USDT: 0,
};

export const NETWORK_FEES: Record<NetworkId, NetworkFeeInfo> = {
  TON: {
    networkId: 'TON',
    feeAmount: 0.01,
    feeCrypto: 'TON',
    minWithdraw: 0.1,
    estimatedTime: '~15-30 сек',
  },
  TRC20: {
    networkId: 'TRC20',
    feeAmount: 0.05,
    feeCrypto: 'USDT',
    minWithdraw: 0.1,
    estimatedTime: '~1-3 мин',
  },
  ERC20: {
    networkId: 'ERC20',
    feeAmount: 0.2,
    feeCrypto: 'USDT',
    minWithdraw: 0.5,
    estimatedTime: '~3-8 мин',
  },
  BEP20: {
    networkId: 'BEP20',
    feeAmount: 0.02,
    feeCrypto: 'USDT',
    minWithdraw: 0.1,
    estimatedTime: '~30-60 сек',
  },
  SOL: {
    networkId: 'SOL',
    feeAmount: 0.001,
    feeCrypto: 'SOL',
    minWithdraw: 0.01,
    estimatedTime: '~10-20 сек',
  },
  POLYGON: {
    networkId: 'POLYGON',
    feeAmount: 0.01,
    feeCrypto: 'USDT',
    minWithdraw: 0.1,
    estimatedTime: '~1-2 мин',
  },
  ARBITRUM: {
    networkId: 'ARBITRUM',
    feeAmount: 0.02,
    feeCrypto: 'USDT',
    minWithdraw: 0.1,
    estimatedTime: '~30 сек',
  },
  BTC: {
    networkId: 'BTC',
    feeAmount: 0.00005,
    feeCrypto: 'BTC',
    minWithdraw: 0.0001,
    estimatedTime: '~10-30 мин',
  },
};

export interface CryptoDepositConfig {
  address: string;
  memo?: string;
  network: NetworkId;
  minDeposit: number;
}

export const DEPOSIT_CONFIGS: Record<CryptoId, Record<string, CryptoDepositConfig>> = {
  TON: {
    TON: {
      address: 'UQCE7QUXismmeSXE5icCg3zcwS-KblIkobh34wrw-QzsQrty',
      memo: '849201',
      network: 'TON',
      minDeposit: 0.05,
    },
  },
  USDT: {
    TRC20: {
      address: 'TXq7R9vF4K2wL8nM1yP6bC3eZ0oA5sD8j2K7m',
      network: 'TRC20',
      minDeposit: 0.1,
    },
    TON: {
      address: 'UQCE7QUXismmeSXE5icCg3zcwS-KblIkobh34wrw-QzsQrty',
      memo: '',
      network: 'TON',
      minDeposit: 0.1,
    },
    BEP20: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'BEP20',
      minDeposit: 0.1,
    },
    ERC20: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'ERC20',
      minDeposit: 0.5,
    },
    POLYGON: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'POLYGON',
      minDeposit: 0.1,
    },
    SOL: {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      network: 'SOL',
      minDeposit: 0.1,
    },
    ARBITRUM: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'ARBITRUM',
      minDeposit: 0.1,
    },
  },
  DFC: {
    TON: {
      address: 'UQCE7QUXismmeSXE5icCg3zcwS-KblIkobh34wrw-QzsQrty',
      memo: '849201',
      network: 'TON',
      minDeposit: 10,
    },
  },
  NOT: {
    TON: {
      address: 'UQCE7QUXismmeSXE5icCg3zcwS-KblIkobh34wrw-QzsQrty',
      memo: '849201',
      network: 'TON',
      minDeposit: 500,
    },
  },
  DOGS: {
    TON: {
      address: 'UQCE7QUXismmeSXE5icCg3zcwS-KblIkobh34wrw-QzsQrty',
      memo: '849201',
      network: 'TON',
      minDeposit: 1000,
    },
  },
  BTC: {
    BTC: {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      network: 'BTC',
      minDeposit: 0.0001,
    },
    BEP20: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'BEP20',
      minDeposit: 0.0001,
    },
  },
  ETH: {
    ERC20: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'ERC20',
      minDeposit: 0.005,
    },
    ARBITRUM: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      network: 'ARBITRUM',
      minDeposit: 0.002,
    },
  },
  SOL: {
    SOL: {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      network: 'SOL',
      minDeposit: 0.02,
    },
  },
  TRX: {
    TRC20: {
      address: 'TXq7R9vF4K2wL8nM1yP6bC3eZ0oA5sD8j2K7m',
      network: 'TRC20',
      minDeposit: 5,
    },
  },
  BNB: {
    BEP20: {
      address: '0x71C95911E9a5D330f4d621842EC243EE1343292e',
      memo: '390124',
      network: 'BEP20',
      minDeposit: 0.01,
    },
  },
};

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

const STORAGE_BALANCES = 'crypto_bot_balances_v4';
const STORAGE_TRANSACTIONS = 'crypto_bot_txs_v4';

function loadBalances(): WalletBalances {
  try {
    const saved = localStorage.getItem(STORAGE_BALANCES);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_BALANCES, ...parsed };
    }
  } catch {
    // fallback
  }
  return { ...INITIAL_BALANCES };
}

function loadTransactions(): WalletTransaction[] {
  try {
    const saved = localStorage.getItem(STORAGE_TRANSACTIONS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return [...INITIAL_TRANSACTIONS];
}

let globalBalances: WalletBalances = loadBalances();
let globalTransactions: WalletTransaction[] = loadTransactions();

const balanceListeners = new Set<(balances: WalletBalances) => void>();
const txListeners = new Set<(txs: WalletTransaction[]) => void>();

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_BALANCES, JSON.stringify(globalBalances));
    localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(globalTransactions));
  } catch {
    // ignore
  }
}

function notifyAll() {
  saveToStorage();
  balanceListeners.forEach((fn) => fn({ ...globalBalances }));
  txListeners.forEach((fn) => fn([...globalTransactions]));
}

// Generate a random realistic crypto hash
function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export const WalletManager = {
  getBalances(): WalletBalances {
    return { ...globalBalances };
  },

  getTransactions(): WalletTransaction[] {
    return [...globalTransactions];
  },

  deposit(
    cryptoId: CryptoId,
    amount: number,
    networkId: NetworkId = 'TON',
    customNotes?: string
  ): WalletTransaction {
    const current = globalBalances[cryptoId] || 0;
    globalBalances = {
      ...globalBalances,
      [cryptoId]: Number((current + amount).toFixed(6)),
    };

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'deposit',
      cryptoId,
      networkId,
      amount,
      counterparty: DEPOSIT_CONFIGS[cryptoId]?.[networkId]?.address || 'Адрес шлюза',
      txHash: generateTxHash(),
      timestamp: Date.now(),
      status: 'completed',
      notes: customNotes || `Пополнение баланса через сеть ${networkId}`,
    };

    globalTransactions = [tx, ...globalTransactions];
    notifyAll();
    return tx;
  },

  withdraw(
    cryptoId: CryptoId,
    amount: number,
    networkId: NetworkId,
    targetAddress: string,
    memo?: string
  ): { success: boolean; error?: string; transaction?: WalletTransaction } {
    const current = globalBalances[cryptoId] || 0;
    const feeInfo = NETWORK_FEES[networkId];
    const feeAmount = feeInfo ? feeInfo.feeAmount : 0;

    // Check if sufficient balance
    // If fee is in the same crypto
    let requiredAmount = amount;
    if (feeInfo && feeInfo.feeCrypto === cryptoId) {
      requiredAmount = amount + feeAmount;
    }

    if (current < requiredAmount) {
      return {
        success: false,
        error: `Недостаточно средств. Баланс: ${current} ${cryptoId}, требуется с учетом комиссии: ${requiredAmount} ${cryptoId}`,
      };
    }

    // Deduct main crypto
    const newBal = Number((current - requiredAmount).toFixed(6));
    const nextBalances = { ...globalBalances, [cryptoId]: Math.max(0, newBal) };

    // Deduct fee if different crypto
    if (feeInfo && feeInfo.feeCrypto !== cryptoId) {
      const feeCryptoBal = nextBalances[feeInfo.feeCrypto] || 0;
      if (feeCryptoBal < feeAmount) {
        return {
          success: false,
          error: `Недостаточно ${feeInfo.feeCrypto} для оплаты сетевой комиссии (${feeAmount} ${feeInfo.feeCrypto})`,
        };
      }
      nextBalances[feeInfo.feeCrypto] = Number((feeCryptoBal - feeAmount).toFixed(6));
    }

    globalBalances = nextBalances;

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'withdraw',
      cryptoId,
      networkId,
      amount,
      fee: feeAmount,
      counterparty: targetAddress,
      memo: memo?.trim() || undefined,
      txHash: generateTxHash(),
      timestamp: Date.now(),
      status: 'completed',
      notes: `Вывод на внешний адрес ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}`,
    };

    globalTransactions = [tx, ...globalTransactions];
    notifyAll();

    return { success: true, transaction: tx };
  },

  transfer(
    cryptoId: CryptoId,
    amount: number,
    recipientUsername: string,
    networkId?: NetworkId
  ): { success: boolean; error?: string; transaction?: WalletTransaction } {
    const current = globalBalances[cryptoId] || 0;
    if (current < amount) {
      return {
        success: false,
        error: `Недостаточно средств. Баланс: ${current} ${cryptoId}`,
      };
    }

    globalBalances = {
      ...globalBalances,
      [cryptoId]: Number((current - amount).toFixed(6)),
    };

    const cleanUsername = recipientUsername.startsWith('@')
      ? recipientUsername
      : `@${recipientUsername}`;

    const effectiveNetwork: NetworkId = networkId || (cryptoId === 'TON' ? 'TON' : 'TRC20');

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'transfer_out',
      cryptoId,
      networkId: effectiveNetwork,
      amount,
      fee: 0,
      counterparty: cleanUsername,
      txHash: generateTxHash(),
      timestamp: Date.now(),
      status: 'completed',
      notes: `Мгновенный перевод пользователю ${cleanUsername} в сети ${effectiveNetwork} без комиссии`,
    };

    globalTransactions = [tx, ...globalTransactions];
    notifyAll();

    return { success: true, transaction: tx };
  },

  topUpTestBalance(usdtAmount = 100, tonAmount = 10): void {
    globalBalances = {
      ...globalBalances,
      USDT: Number(((globalBalances.USDT || 0) + usdtAmount).toFixed(4)),
      TON: Number(((globalBalances.TON || 0) + tonAmount).toFixed(4)),
    };
    notifyAll();
  },

  claimCheckPrize(
    cryptoId: CryptoId,
    amount: number,
    checkTitle: string,
    checkId: string
  ): WalletTransaction {
    const current = globalBalances[cryptoId] || 0;
    globalBalances = {
      ...globalBalances,
      [cryptoId]: Number((current + amount).toFixed(6)),
    };

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'check_claim',
      cryptoId,
      networkId: 'TON',
      amount,
      counterparty: `${checkTitle} (#${checkId.slice(-6)})`,
      txHash: generateTxHash(),
      timestamp: Date.now(),
      status: 'completed',
      notes: `Награда за активацию крипто-чека (${checkTitle})`,
    };

    globalTransactions = [tx, ...globalTransactions];
    notifyAll();
    return tx;
  },

  createCheckFromWallet(
    cryptoId: CryptoId,
    totalAmount: number,
    checkTitle: string
  ): { success: boolean; error?: string; transaction?: WalletTransaction } {
    const current = globalBalances[cryptoId] || 0;
    if (current < totalAmount) {
      return {
        success: false,
        error: `Недостаточно средств на балансе. Баланс: ${current} ${cryptoId}, требуется: ${totalAmount} ${cryptoId}`,
      };
    }

    globalBalances = {
      ...globalBalances,
      [cryptoId]: Number((current - totalAmount).toFixed(6)),
    };

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'check_create',
      cryptoId,
      amount: totalAmount,
      counterparty: `Создан чек: ${checkTitle}`,
      txHash: generateTxHash(),
      timestamp: Date.now(),
      status: 'completed',
      notes: `Резервирование баланса на создание крипто-чека "${checkTitle}"`,
    };

    globalTransactions = [tx, ...globalTransactions];
    notifyAll();

    return { success: true, transaction: tx };
  },

  setCryptoBalance(cryptoId: CryptoId, amount: number): void {
    globalBalances = {
      ...globalBalances,
      [cryptoId]: Math.max(0, amount),
    };
    notifyAll();
  },

  resetAll(): void {
    globalBalances = { ...INITIAL_BALANCES };
    globalTransactions = [...INITIAL_TRANSACTIONS];
    notifyAll();
  },
};

export function useWallet() {
  const [balances, setBalances] = useState<WalletBalances>(globalBalances);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(globalTransactions);

  useEffect(() => {
    const handleBalanceChange = (next: WalletBalances) => setBalances(next);
    const handleTxChange = (next: WalletTransaction[]) => setTransactions(next);

    balanceListeners.add(handleBalanceChange);
    txListeners.add(handleTxChange);

    return () => {
      balanceListeners.delete(handleBalanceChange);
      txListeners.delete(handleTxChange);
    };
  }, []);

  const deposit = useCallback(
    (cryptoId: CryptoId, amount: number, networkId: NetworkId = 'TON', notes?: string) => {
      return WalletManager.deposit(cryptoId, amount, networkId, notes);
    },
    []
  );

  const setCryptoBalance = useCallback((cryptoId: CryptoId, amount: number) => {
    WalletManager.setCryptoBalance(cryptoId, amount);
  }, []);

  const withdraw = useCallback(
    (
      cryptoId: CryptoId,
      amount: number,
      networkId: NetworkId,
      targetAddress: string,
      memo?: string
    ) => {
      return WalletManager.withdraw(cryptoId, amount, networkId, targetAddress, memo);
    },
    []
  );

  const transfer = useCallback(
    (
      cryptoId: CryptoId,
      amount: number,
      recipientUsername: string,
      networkId?: NetworkId
    ) => {
      return WalletManager.transfer(cryptoId, amount, recipientUsername, networkId);
    },
    []
  );

  const topUpTestBalance = useCallback((usdtAmount = 100, tonAmount = 10) => {
    WalletManager.topUpTestBalance(usdtAmount, tonAmount);
  }, []);

  const claimCheckPrize = useCallback(
    (cryptoId: CryptoId, amount: number, checkTitle: string, checkId: string) => {
      return WalletManager.claimCheckPrize(cryptoId, amount, checkTitle, checkId);
    },
    []
  );

  const createCheckFromWallet = useCallback(
    (cryptoId: CryptoId, totalAmount: number, checkTitle: string) => {
      return WalletManager.createCheckFromWallet(cryptoId, totalAmount, checkTitle);
    },
    []
  );

  const resetAll = useCallback(() => {
    WalletManager.resetAll();
  }, []);

  return {
    balances,
    transactions,
    deposit,
    setCryptoBalance,
    withdraw,
    transfer,
    topUpTestBalance,
    claimCheckPrize,
    createCheckFromWallet,
    resetAll,
  };
}
