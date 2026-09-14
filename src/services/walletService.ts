import { useState, useEffect, useCallback } from 'react';
import { CryptoId, NetworkId, WalletBalances, WalletTransaction } from '../types';


// Fetch initial data from server
export async function fetchUserBalances() {
  const initData = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData || '';
  const res = await fetch('/api/wallet/balances', {
    headers: { 'X-Telegram-Init-Data': initData }
  });
  if (!res.ok) return { balances: {}, transactions: [] };
  return await res.json();
}

export async function sendTransfer(recipient: string, amount: number, cryptoId: string, networkId?: string) {
  const initData = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData || '';
  const res = await fetch('/api/wallet/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData
    },
    body: JSON.stringify({ recipient, amount, cryptoId, networkId })
  });
  return await res.json();
}

export async function sendWithdraw(cryptoId: string, amount: number, address: string, networkId: string) {
  const initData = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData || '';
  const res = await fetch('/api/wallet/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData
    },
    body: JSON.stringify({ cryptoId, amount, address, networkId })
  });
  return await res.json();
}

export function useWallet() {
  const [balances, setBalances] = useState<WalletBalances>({});
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchUserBalances();
      setBalances(data.balances || {});
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
    // In a real app, you might set up a WebSocket or polling here
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const deposit = useCallback(
    (cryptoId: CryptoId, amount: number, networkId: NetworkId = 'TON', notes?: string) => {
      // In real app, this redirects to CryptoBot
      console.log('Deposit requested', cryptoId, amount);
      return { success: true };
    },
    []
  );

  const withdraw = useCallback(
    (
      cryptoId: CryptoId,
      amount: number,
      networkId: NetworkId,
      targetAddress: string,
      memo?: string
    ) => {
      return sendWithdraw(cryptoId, amount, targetAddress, networkId);
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
      return sendTransfer(recipientUsername, amount, cryptoId, networkId);
    },
    []
  );

  // Mocks for checks
  const claimCheckPrize = useCallback(
    (cryptoId: CryptoId, amount: number, checkTitle: string, checkId: string) => {
      console.log('Claim mock');
      return { id: 'tx_mock' } as any;
    },
    []
  );

  const createCheckFromWallet = useCallback(
    (cryptoId: CryptoId, totalAmount: number, checkTitle: string) => {
      return { success: true } as any;
    },
    []
  );

  return {
    balances,
    transactions,
    deposit,
    withdraw,
    transfer,
    claimCheckPrize,
    createCheckFromWallet,
  };
}

export const NETWORK_FEES: Record<NetworkId, { feeAmount: number; feeCrypto: CryptoId; minWithdraw: number; estimatedTime: string }> = {
  TON: { feeAmount: 0.05, feeCrypto: 'TON', minWithdraw: 0.1, estimatedTime: '~30 сек' },
  TRC20: { feeAmount: 1.5, feeCrypto: 'USDT', minWithdraw: 5, estimatedTime: '~3 мин' },
  ERC20: { feeAmount: 5, feeCrypto: 'USDT', minWithdraw: 10, estimatedTime: '~5 мин' },
  BEP20: { feeAmount: 0.3, feeCrypto: 'USDT', minWithdraw: 1, estimatedTime: '~1 мин' },
  SOL: { feeAmount: 0.01, feeCrypto: 'SOL', minWithdraw: 0.05, estimatedTime: '~30 сек' },
  POLYGON: { feeAmount: 0.1, feeCrypto: 'USDT', minWithdraw: 1, estimatedTime: '~2 мин' },
  ARBITRUM: { feeAmount: 0.5, feeCrypto: 'USDT', minWithdraw: 2, estimatedTime: '~1 мин' },
  BTC: { feeAmount: 0.0001, feeCrypto: 'BTC', minWithdraw: 0.0005, estimatedTime: '~15 мин' },
};

export const DEPOSIT_CONFIGS: Record<NetworkId, { minDeposit: number; estimatedTime: string }> = {
  TON: { minDeposit: 0.1, estimatedTime: '~30 сек' },
  TRC20: { minDeposit: 1, estimatedTime: '~3 мин' },
  ERC20: { minDeposit: 10, estimatedTime: '~5 мин' },
  BEP20: { minDeposit: 1, estimatedTime: '~1 мин' },
  SOL: { minDeposit: 0.05, estimatedTime: '~30 сек' },
  POLYGON: { minDeposit: 1, estimatedTime: '~2 мин' },
  ARBITRUM: { minDeposit: 2, estimatedTime: '~1 мин' },
  BTC: { minDeposit: 0.0001, estimatedTime: '~15 мин' },
};

const INITIAL_BALANCES = {};
const INITIAL_TRANSACTIONS: any[] = [];
