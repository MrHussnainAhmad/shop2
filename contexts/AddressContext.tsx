"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface AddressContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AddressContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressRefresh = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddressRefresh must be used within an AddressProvider');
  }
  return context;
};
