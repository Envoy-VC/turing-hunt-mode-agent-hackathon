export const createWallet = async (userId: string) => {
  const options = {
    method: 'POST',
    headers: {
      'X-API-KEY': '<x-api-key>',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'evm-smart-wallet',
      config: {
        adminSigner: {
          type: 'evm-keypair',
          address: import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS,
        },
      },
      linkedUser: `userId:${userId}`,
    }),
  };

  const res = await fetch(
    'https://staging.crossmint.com/api/v1-alpha2/wallets',
    options
  );

  const data = (await res.json()) as {
    type: 'evm-smart-wallet';
    linkedUser: string;
    address: string;
    config: {
      adminSigner: {
        type: 'evm-keypair';
        address: string;
        locator: string;
      };
    };
  };

  return data;
};
