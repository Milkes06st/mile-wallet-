export type CryptoId = 'DFC' | 'TON' | 'USDT' | 'BTC' | 'ETH' | 'NOT' | 'DOGS' | 'SOL' | 'TRX' | 'BNB';

export type NetworkId = 'TON' | 'TRC20' | 'ERC20' | 'BEP20' | 'SOL' | 'POLYGON' | 'ARBITRUM' | 'BTC';

export interface NetworkOption {
  id: NetworkId;
  name: string;
  badge: string;
  badgeColor: string;
}

export interface CryptoItem {
  id: CryptoId;
  name: string;
  symbol: string;
  rateRub: number;
  rateUsd: number;
  networks: NetworkOption[];
  iconBg: string;
}

export interface CryptoCheck {
  id: string;
  title: string;
  description: string;
  cryptoId: CryptoId;
  networkId: NetworkId;
  totalAmount: number;
  perUserAmount: number;
  maxActivations: number;
  currentActivations: number;
  limitPerUser: number;
  autoPayout: boolean; // true = instant delivery after captcha, false = requires admin confirmation
  prizePayloadType: 'code' | 'tx_hash' | 'link' | 'secret';
  prizeTemplate: string;
  referralRewardRub: number;
  createdAt: number;
  status: 'active' | 'completed' | 'paused';
}

export interface ActivationAttempt {
  id: string;
  checkId: string;
  username: string;
  userId: string;
  avatarColor: string;
  timestamp: number;
  cryptoSymbol: string;
  networkId: NetworkId;
  amount: number;
  fiatRub: number;
  status: 'approved' | 'pending_admin' | 'rejected';
  captchaDurationSeconds: number;
  prizeDelivered?: string;
  adminCustomAmount?: number;
  adminNotes?: string;
  reviewedAt?: number;
}

export interface CaptchaConfig {
  charactersCount: number;
  includeNumbers: boolean;
  includeLetters: boolean;
  caseSensitive: boolean;
  testDurationMs: number;
}

export interface CryptoRateInfo {
  rub: number;
  usd: number;
  change24h: number;
  lastUpdated: number;
  direction?: 'up' | 'down' | 'same';
}

export type RatesMap = Record<CryptoId, CryptoRateInfo>;

export type TransactionType =
  | 'deposit'
  | 'withdraw'
  | 'transfer_out'
  | 'transfer_in'
  | 'check_claim'
  | 'check_create';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  cryptoId: CryptoId;
  networkId?: NetworkId;
  amount: number;
  fee?: number;
  counterparty?: string; // address, @username, or check title
  memo?: string;
  txHash?: string;
  timestamp: number;
  status: TransactionStatus;
  fiatRub?: number;
  fiatUsd?: number;
  notes?: string;
}

export type WalletBalances = Partial<Record<CryptoId, number>>;

export interface NetworkFeeInfo {
  networkId: NetworkId;
  feeAmount: number;
  feeCrypto: CryptoId;
  minWithdraw: number;
  estimatedTime: string;
}

export type BotTab = 'home' | 'exchange' | 'p2p' | 'wallet' | 'check' | 'admin';

