import {
  type Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from 'wagmi';
import { modeTestnet } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

import { TURING_HUNT_ABI } from './abi';

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

const metadata = {
  name: 'Web3 Turbo Starter',
  description: 'Web3 starter kit with turborepo, wagmi, and Next.js',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig: Config = createConfig({
  chains: [modeTestnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
  transports: {
    [modeTestnet.id]: http(),
  },
});

export const gameContractConfig = {
  address: '0xc96DE6A3C2d186aE35899297F009329f48c1ab3D' as `0x${string}`,
  abi: TURING_HUNT_ABI,
};
