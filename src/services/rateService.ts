import { useState, useEffect, useCallback, useRef } from 'react';
import { CryptoId, CryptoRateInfo, RatesMap } from '../types';

export const INITIAL_RATES: RatesMap = {
  DFC: { rub: 0.284, usd: 0.0031, change24h: 3.4, lastUpdated: Date.now(), direction: 'same' },
  TON: { rub: 352.5, usd: 3.86, change24h: 1.8, lastUpdated: Date.now(), direction: 'same' },
  USDT: { rub: 92.4, usd: 1.00, change24h: 0.1, lastUpdated: Date.now(), direction: 'same' },
  NOT: { rub: 0.725, usd: 0.0079, change24h: -1.2, lastUpdated: Date.now(), direction: 'same' },
  DOGS: { rub: 0.0585, usd: 0.00064, change24h: 2.1, lastUpdated: Date.now(), direction: 'same' },
  BTC: { rub: 6245000, usd: 68250, change24h: 2.5, lastUpdated: Date.now(), direction: 'same' },
  ETH: { rub: 246800, usd: 2680, change24h: 1.4, lastUpdated: Date.now(), direction: 'same' },
  SOL: { rub: 13620, usd: 148.5, change24h: 4.2, lastUpdated: Date.now(), direction: 'same' },
  TRX: { rub: 14.65, usd: 0.161, change24h: 0.8, lastUpdated: Date.now(), direction: 'same' },
  BNB: { rub: 52400, usd: 572, change24h: 1.1, lastUpdated: Date.now(), direction: 'same' },
};

// Global singleton rate store so all components share the exact same live state
let globalRates: RatesMap = { ...INITIAL_RATES };
const listeners = new Set<(rates: RatesMap) => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener(globalRates));
}

// Generate realistic micro-tick for simulation fallback
function tickFluctuation(prev: RatesMap): RatesMap {
  const updated = { ...prev };
  const cryptoKeys = Object.keys(updated) as CryptoId[];
  const now = Date.now();

  cryptoKeys.forEach((key) => {
    const item = updated[key];
    // Realistic micro percentage delta: between -0.3% and +0.35%
    const deltaPercent = (Math.random() * 0.7 - 0.32) / 100;
    const newRub = Math.max(0.0001, item.rub * (1 + deltaPercent));
    const newUsd = Math.max(0.0001, item.usd * (1 + deltaPercent));
    const direction = deltaPercent > 0.0002 ? 'up' : deltaPercent < -0.0002 ? 'down' : item.direction;

    updated[key] = {
      rub: Number(newRub.toFixed(item.rub < 1 ? 4 : item.rub < 100 ? 2 : 0)),
      usd: Number(newUsd.toFixed(item.usd < 1 ? 5 : 2)),
      change24h: Number((item.change24h + deltaPercent * 10).toFixed(2)),
      lastUpdated: now,
      direction,
    };
  });

  return updated;
}

// Fetch live rates from public APIs (CoinGecko / Binance)
async function fetchOnlineRates(): Promise<boolean> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,tether,bitcoin,ethereum,notcoin,solana,tron,binancecoin&vs_currencies=rub,usd&include_24hr_change=true',
      { signal: AbortSignal.timeout(3500) }
    );
    if (!res.ok) throw new Error('API response not ok');
    const data = await res.json();
    const now = Date.now();

    const mapping: Record<string, CryptoId> = {
      'the-open-network': 'TON',
      tether: 'USDT',
      bitcoin: 'BTC',
      ethereum: 'ETH',
      notcoin: 'NOT',
      solana: 'SOL',
      tron: 'TRX',
      binancecoin: 'BNB',
    };

    const next = { ...globalRates };
    for (const [cgId, cryptoId] of Object.entries(mapping)) {
      if (data[cgId]) {
        const item = data[cgId];
        const oldRub = next[cryptoId].rub;
        const newRub = item.rub;
        const direction = newRub > oldRub ? 'up' : newRub < oldRub ? 'down' : 'same';
        next[cryptoId] = {
          rub: newRub,
          usd: item.usd,
          change24h: Number((item.rub_24h_change || 0).toFixed(2)),
          lastUpdated: now,
          direction,
        };
      }
    }

    // For DFC & DOGS apply market delta
    const dfcDelta = (Math.random() * 0.4 - 0.18) / 100;
    next.DFC = {
      ...next.DFC,
      rub: Number((next.DFC.rub * (1 + dfcDelta)).toFixed(4)),
      usd: Number((next.DFC.usd * (1 + dfcDelta)).toFixed(5)),
      lastUpdated: now,
      direction: dfcDelta > 0 ? 'up' : 'down',
    };

    globalRates = next;
    notifyListeners();
    return true;
  } catch {
    // Fallback to internal micro-fluctuations
    globalRates = tickFluctuation(globalRates);
    notifyListeners();
    return false;
  }
}

export function useCryptoRates() {
  const [rates, setRates] = useState<RatesMap>(globalRates);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [lastTick, setLastTick] = useState<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const listener = (newRates: RatesMap) => {
      setRates({ ...newRates });
      setLastTick(Date.now());
    };
    listeners.add(listener);

    // Start live auto-polling every 6 seconds
    const interval = window.setInterval(async () => {
      setIsUpdating(true);
      await fetchOnlineRates();
      setIsUpdating(false);
    }, 6000);

    return () => {
      listeners.delete(listener);
      window.clearInterval(interval);
    };
  }, []);

  const refreshRates = useCallback(async () => {
    setIsUpdating(true);
    await fetchOnlineRates();
    setIsUpdating(false);
  }, []);

  const formatCryptoFiat = useCallback(
    (amount: number, cryptoId: CryptoId): string => {
      const rateInfo = rates[cryptoId] || rates.DFC;
      const total = amount * rateInfo.rub;
      if (total < 10) return total.toFixed(2);
      if (total < 1000) return total.toFixed(1);
      return Math.round(total).toLocaleString('ru-RU');
    },
    [rates]
  );

  return {
    rates,
    isUpdating,
    lastTick,
    refreshRates,
    formatCryptoFiat,
  };
}
