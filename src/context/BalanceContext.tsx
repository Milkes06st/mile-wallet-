import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem('crypto_bot_hide_balance_v1');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('crypto_bot_hide_balance_v1', JSON.stringify(isBalanceHidden));
    } catch {
      // ignore
    }
  }, [isBalanceHidden]);

  const toggleBalanceVisibility = () => setIsBalanceHidden((prev) => !prev);

  return (
    <BalanceContext.Provider value={{ isBalanceHidden, toggleBalanceVisibility }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
};
