"use client";

import React from 'react';
import { WalletProvider } from '@/app/WalletProvider';
import ClientLayout from './ClientLayout';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

const RootLayoutClient: React.FC<RootLayoutClientProps> = ({ children }) => {
  return (
    <WalletProvider>
      <ClientLayout>
        {children}
      </ClientLayout>
    </WalletProvider>
  );
};

export default RootLayoutClient;