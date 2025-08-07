"use client";
import React from 'react';
import { useUser } from '@clerk/nextjs';
import DynamicAccountHeader from './DynamicAccountHeader';
import AccountMenu from './AccountMenu';

interface ClientAccountLayoutProps {
  children: React.ReactNode;
}

const ClientAccountLayout: React.FC<ClientAccountLayoutProps> = ({ children }) => {
  const { user, isLoaded } = useUser();

  // Extract serializable user data for consistency
  const userData = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    emailAddress: user.emailAddresses?.[0]?.emailAddress,
    createdAt: user.createdAt,
  } : null;

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic Account Header with conditional visibility */}
      <DynamicAccountHeader user={userData} />
      
      {/* Dynamic Account Layout - Account Menu */}
      <AccountMenu />
      
      {/* Account page content */}
      {children}
    </>
  );
};

export default ClientAccountLayout;
