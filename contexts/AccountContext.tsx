"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface AccountContextType {
  isAccountMenuVisible: boolean;
  setAccountMenuVisible: (visible: boolean) => void;
  currentSection: string | null;
  setCurrentSection: (section: string | null) => void;
  hideMainMenu: boolean;
  setHideMainMenu: (hide: boolean) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [isAccountMenuVisible, setAccountMenuVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [hideMainMenu, setHideMainMenu] = useState(true);

  return (
    <AccountContext.Provider
      value={{
        isAccountMenuVisible,
        setAccountMenuVisible,
        currentSection,
        setCurrentSection,
        hideMainMenu,
        setHideMainMenu,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
