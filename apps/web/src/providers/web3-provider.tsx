import type { PropsWithChildren } from 'react';

import {
  CrossmintAuthProvider,
  CrossmintProvider,
} from '@crossmint/client-sdk-react-ui';

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <CrossmintProvider apiKey={import.meta.env.VITE_CROSSMINT_API_KEY}>
      <CrossmintAuthProvider
        embeddedWallets={{
          type: 'evm-smart-wallet',
          defaultChain: 'polygon-amoy',
          createOnLogin: 'all-users',
        }}
      >
        {children}
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
};
