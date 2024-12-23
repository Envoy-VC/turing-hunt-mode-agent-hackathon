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
  address: '0x7F057B162503D0689F629dfbAc1546D76ddc0004' as `0x${string}`,
  abi: TURING_HUNT_ABI,
};
