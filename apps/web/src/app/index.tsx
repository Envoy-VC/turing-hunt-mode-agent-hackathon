import { useAuth, useWallet } from '@crossmint/client-sdk-react-ui';
import { createFileRoute } from '@tanstack/react-router';

const HomeComponent = () => {
  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
      <AuthButton />
      <Wallet />
    </div>
  );
};

const AuthButton = () => {
  const { login, logout, jwt } = useAuth();

  return (
    <div>
      {!jwt ? (
        <button
          className='rounded bg-blue-500 px-4 py-2 font-bold text-white'
          type='button'
          onClick={login}
        >
          Login
        </button>
      ) : (
        <button
          className='rounded border-2 border-blue-500 bg-black px-4 py-2 font-bold text-white'
          type='button'
          onClick={logout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

const Wallet = () => {
  const { wallet, status, error } = useWallet();

  return (
    <div>
      {status === 'loading-error' && error ? (
        <div className='rounded-lg border-2 border-red-500 px-8 py-4 font-bold text-red-500'>
          Error: {error.message}
        </div>
      ) : null}
      {status === 'in-progress' && (
        <div className='rounded-lg border-2 border-yellow-500 px-8 py-4 font-bold text-yellow-500'>
          Loading...
        </div>
      )}
      {status === 'loaded' && wallet ? (
        <div className='rounded-lg border-2 border-green-500 px-8 py-4 font-bold text-green-500'>
          Wallet: {wallet.address}
        </div>
      ) : null}
      {status === 'not-loaded' && (
        <div className='rounded-lg border-2 border-gray-500 px-8 py-4 font-bold text-gray-500'>
          Wallet not loaded
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
