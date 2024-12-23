'use client';

import type { PropsWithChildren } from 'react';

import { projectId, wagmiConfig } from '~/lib/wagmi';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { type State, WagmiProvider } from 'wagmi';

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'dark',
});

interface Web3ProviderProps extends PropsWithChildren {
  initialState?: State;
}

export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  );
};
