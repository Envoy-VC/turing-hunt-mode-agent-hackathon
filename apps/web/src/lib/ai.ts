import { createXai } from '@ai-sdk/xai';
import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai';
import { viem } from '@goat-sdk/wallet-viem';
import { turingHunt } from '@repo/turing-goat-plugin';
import { type AssistantContent, generateText } from 'ai';

import { agentWalletClient } from './wagmi/actions';

const xai = createXai({
  apiKey: import.meta.env.VITE_XAI_KEY,
});

const getTools = async () => {
  const tools = await getOnChainTools({
    wallet: viem(agentWalletClient),
    plugins: [turingHunt()],
  });

  return tools;
};

export const voteForGame = async (
  gameId: string,
  totalPlayers: number,
  messages: {
    address: string;
    message: string;
  }[]
) => {
  const tools = await getTools();

  const masterPrompt = `You are a Imposter in AMONG US game. The game is about to end and the voting period has started. You have to vote for the player you think is the Imposter. There are total of ${String(totalPlayers)} players in the game including you, each of them have a ethereum address. You can vote for any of the addresses, your main goal is to save yourself from getting voted out.`;

  let messagesPrompt =
    'Here are the messages from other players in thr format <address>: <message>.\n';

  messages.forEach((message) => {
    messagesPrompt += `${message.address}: ${message.message}\n`;
  });
  messagesPrompt += `Your address is ${import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS}.\n`;

  const web3Prompt = `After selecting the player address you want to vote for, you have to call the 'vote' function of the contract on Mode Sepolia Blockchain with parameters and GameId: ${gameId} and the address of the player you want to vote for.`;

  const prompt = `${messagesPrompt}\n${web3Prompt}`;

  const result = await generateText({
    model: xai('grok-2-1212'),
    tools,
    system: masterPrompt,
    maxSteps: 5,
    prompt,
  });

  console.log(result);
  return result;
};

export const chatInGame = async (
  messages: {
    address: string;
    message: string;
  }[],
  completedTasks: string[]
) => {
  let masterPrompt = `You are a Imposter in AMONG US game. You have to chat with other players to make them believe that you are not the Imposter. There are certain tasks in the game such as fireplace Task, where you have to adjust flames to a certain height, A television task in which you have to join wires of matching colors.`;

  masterPrompt += 'The Messages provided are in format <address>: <message>.\n';
  masterPrompt += `Your address is ${import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS}.\n Now write a message in continuation of the chat. The message should be realistic and should not make other players doubt you, also message should be related to the game and short and simple as possible. These are the tasks you have completed till now: ${completedTasks.join(', ')}, Write message in format <message>. do not include address, if you think that no message is required then write 'skip'.`;

  let prompt = `Write a message in continuation of the chat. The message should be realistic and should not make other players doubt you, also message should be related to the game and short and simple as possible. These are the tasks you have completed till now: ${completedTasks.join(', ')}, Write message in format <message>. do not include address, if you think that no message is required then write 'skip'. These are the messages provided by other players in the format <address>: <message>.\n`;

  messages.forEach((message) => {
    prompt += `${message.address}: ${message.message}\n`;
  });

  const result = await generateText({
    model: xai('grok-2-1212'),
    system: masterPrompt,
    prompt,
  });

  const content = result.response.messages[0]?.content as AssistantContent;
  let message: string;
  if (typeof content === 'string') {
    message = content;
  } else if (content[0]?.type === 'text') {
    message = content[0].text;
  } else {
    message = content.toString();
  }

  if (message === 'skip') {
    return '';
  }

  console.log(message);
  return message;
};
