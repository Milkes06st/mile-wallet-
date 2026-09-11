import { NetworkId } from '../types';

export const validateAddress = (address: string, network: NetworkId): boolean => {
  if (!address || typeof address !== 'string') return false;
  const cleaned = address.trim();
  
  if (network === 'TON') {
    if (cleaned.endsWith('.ton')) return true;
    if (cleaned.endsWith('.t.me')) return true;
    if (cleaned.length === 48 && (cleaned.startsWith('EQ') || cleaned.startsWith('UQ'))) {
      return true;
    }
    return false;
  }
  
  if (network === 'TRC20') {
    return cleaned.startsWith('T') && cleaned.length === 34;
  }
  
  if (network === 'ERC20' || network === 'BEP20' || network === 'POLYGON' || network === 'ARBITRUM' || network as any === 'OPTIMISM') {
    return /^0x[a-fA-F0-9]{40}$/.test(cleaned);
  }
  
  if (network === 'SOL') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleaned);
  }

  if (network === 'BTC') {
    return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,59}$/.test(cleaned);
  }
  
  return cleaned.length >= 16;
};
