import { FcGoogle as GoogleIcon } from 'react-icons/fc';

import { useAuth } from '@crossmint/client-sdk-react-ui';

import { Button } from './ui/button';

export const SignIn = () => {
  const { login, status } = useAuth();

  return (
    <Button
      className='flex h-12 flex-row items-center gap-2 rounded-xl font-medium text-white [&_svg]:size-6'
      onClick={() => {
        try {
          login();
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
