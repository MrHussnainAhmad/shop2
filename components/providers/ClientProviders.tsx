"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AlertModalProvider } from '@/components/ui/alert-modal';
import Header from '@/components/header/Header';
import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

interface ClientProvidersProps {
  children: React.ReactNode;
  webData: any; // Define a proper type for WebData if available
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children, webData }) => {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <AlertModalProvider>
      {!isAdminPath && <Header webData={webData} logo={webData?.logo} />}
      {children}
      {!isAdminPath && <Footer webData={webData} logo={webData?.logo} />}
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
