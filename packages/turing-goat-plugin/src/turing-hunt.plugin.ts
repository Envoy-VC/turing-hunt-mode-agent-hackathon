import { type Chain, PluginBase } from '@goat-sdk/core';
import type { EVMWalletClient } from '@goat-sdk/wallet-evm';

import { getTools } from './tools';

export class TuringHuntPlugin extends PluginBase<EVMWalletClient> {
  constructor() {
    super('erc721', []);
  }

  supportsChain = (chain: Chain) => chain.type === 'evm';

  getTools(walletClient: EVMWalletClient) {
    const network = walletClient.getChain();

    if (!network.id) {
      throw new Error('Network ID is required');
    }

    return getTools(walletClient);
  }
}

export function turingHunt() {
  return new TuringHuntPlugin();
}
