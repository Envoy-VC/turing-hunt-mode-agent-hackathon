import { useState } from 'react';
import { FcGoogle as GoogleIcon } from 'react-icons/fc';

import {
  BlockchainTypes,
  CrossmintEVMWalletAdapter,
  CrossmintEnvironment,
} from '@crossmint/connect';

import { Button } from './ui/button';

export const SignIn = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);

  async function connectToCrossmint() {
    const _crossmintConnect = new CrossmintEVMWalletAdapter({
      chain: BlockchainTypes.ETHEREUM,
      environment: CrossmintEnvironment.STAGING,
    });

    const address = await _crossmintConnect.connect();
    console.log(address);

    if (address) {
      setAddress(address);
    }
  }

  return (
    <Button
      className='flex h-12 flex-row items-center gap-2 rounded-xl font-medium text-white [&_svg]:size-6'
      onClick={async () => {
        try {
          await connectToCrossmint();
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <GoogleIcon size={100} />
      {status === 'in-progress' ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
};
