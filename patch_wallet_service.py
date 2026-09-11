import re

with open('src/services/walletService.ts', 'r') as f:
    content = f.read()

# Remove the test funds logic from loadBalances
old_load_balances = """function loadBalances(): WalletBalances {
  try {
    const saved = localStorage.getItem(STORAGE_BALANCES);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure user has sufficient test funds for testing transfers
      if (parsed.USDT === undefined || parsed.USDT < 5) {
        parsed.USDT = 100.0;
      }
      if (parsed.TON === undefined || parsed.TON < 3) {
        parsed.TON = 14.8;
      }
      return { ...INITIAL_BALANCES, ...parsed };
    }
  } catch {
    // fallback
  }
  return { ...INITIAL_BALANCES, USDT: 0, TON: 0 };
}"""

new_load_balances = """function loadBalances(): WalletBalances {
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
}"""

content = content.replace(old_load_balances, new_load_balances)

# Ensure INITIAL_BALANCES is clean
old_initial = """export const INITIAL_BALANCES: WalletBalances = {
  TON: 0,
  USDT: 0,
};"""

new_initial = """export const INITIAL_BALANCES: WalletBalances = {
  TON: 0,
  USDT: 0,
};"""
# it's already clean, but let's make sure it doesn't give them other balances elsewhere.

with open('src/services/walletService.ts', 'w') as f:
    f.write(content)
