import type { PropsWithChildren } from 'react';

import { QueryProvider } from './query-provider';
import { Web3Provider } from './web3-provider';

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <Web3Provider>{children}</Web3Provider>
    </QueryProvider>
  );
};
