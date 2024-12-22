import type { PropsWithChildren } from 'react';

import { ConvexProvider } from './convex-provider';
import { QueryProvider } from './query-provider';
import { Web3Provider } from './web3-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <ConvexProvider>
        <Web3Provider>{children}</Web3Provider>
      </ConvexProvider>
    </QueryProvider>
  );
};
