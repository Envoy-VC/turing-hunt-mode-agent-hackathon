import { type PropsWithChildren } from 'react';

import {
  ConvexProvider as ConvexProviderCore,
  ConvexReactClient,
} from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export const ConvexProvider = ({ children }: PropsWithChildren) => {
  return <ConvexProviderCore client={convex}>{children}</ConvexProviderCore>;
};
