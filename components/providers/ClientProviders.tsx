"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AlertModalProvider } from '@/components/ui/alert-modal';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <AlertModalProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#00ff00",
          },
        }}
      />
    </AlertModalProvider>
  );
};
