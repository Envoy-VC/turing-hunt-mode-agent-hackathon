import { useMemo } from 'react';

import { chatInGame } from '~/lib/ai';

import { useMutation } from 'convex/react';
import Phaser from 'phaser';

import { api } from '../../convex/_generated/api';
import { type Agent } from '../game/entities';
import { type WorldScene } from '../game/scenes';

import type { ChatMessage, Game } from '~/types/game';

export interface Task {
  id: string;
  name: string;
  weight: () => number;
  waitUntilNextTask: () => number;
  repeatable: boolean;
  execute: (agent: Agent, scene: WorldScene) => Promise<void> | void;
  checkIfCompleted: (
    agent: Agent,
    scene: WorldScene
  ) => Promise<boolean> | boolean;
  onComplete: (agent: Agent, scene: WorldScene) => Promise<void> | void;
}

const tasksList = [
  {
    id: 'fireplace',
    name: 'Fireplace Task',
    weight: () => 5,
    waitUntilNextTask: () => {
      return Phaser.Math.Between(8000, 10000);
    },
    position: [4, 13] as [number, number],
  },
  {
    id: 'television-set',
    name: 'Television Set Task',
    weight: () => 5,
    waitUntilNextTask: () => {
      return Phaser.Math.Between(8000, 10000);
    },
    position: [25, 4] as [number, number],
  },
] as const;

export const useGameTasks = (game: Game) => {
  const completeTask = useMutation(api.tasks.completeTask);
  const playerAlreadyVoted = game.players.filter(
    (player) => player.hasVoted
  ).length;
  const hasAiAgentVoted =
    game.players.find(
      (p) => p.address === import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS
    )?.hasVoted ?? false;

  const sendMessage = useMutation(api.chat.sendChatMessage);
  const getChats = useMutation(api.chat.getChatMessagesMutation);

  const tasks: Task[] = [
    {
      id: 'move-to-random-tile',
      name: 'Move to random tile',
      weight: () => 1,
      waitUntilNextTask: () => {
        return Phaser.Math.Between(3000, 5000);
      },
      repeatable: true,
      execute: (agent: Agent, scene: WorldScene) => {
        const getRandomNonCollidingTile = () => {
          const randomX = Phaser.Math.Between(0, scene.map.width - 1);
          const randomY = Phaser.Math.Between(0, scene.map.height - 1);

          const tile = scene.map.getTileAt(randomX, randomY);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
          const isColliding = Boolean(tile?.properties?.collides);
          if (isColliding) {
            return getRandomNonCollidingTile();
          }
          return { x: randomX, y: randomY };
        };

        const randomTile = getRandomNonCollidingTile();
        console.log(randomTile);
        agent.moveTo(randomTile.x, randomTile.y, scene);
      },
      checkIfCompleted: (agent: Agent) => {
        return agent.targetPath.length === 0;
      },
      onComplete: () => {
        // do nothing
      },
    },
    {
      id: 'chat',
      name: 'Chat Task',
      weight: () => 2,
      waitUntilNextTask: () => {
        return Phaser.Math.Between(8000, 10000);
      },
      repeatable: true,
      execute: async (agent) => {
        const m = await getChats({ gameId: game._id });
        const messages = m.map((m) => {
          return {
            address: m.player.address,
            message: m.content,
            timestamp: m._creationTime,
          };
        });

        // sort by timestamp in ascending order
        m.sort((a, b) => a._creationTime - b._creationTime);
        console.log(messages);
        if (messages.length === 0) {
          return;
        }

        if (
          messages[messages.length - 1]?.address ===
          import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS
        ) {
          return;
        }

        const message = await chatInGame(
          messages,
          Array.from(agent.completedTasks)
        );
        if (message === '') return;
        await sendMessage({
          address: import.meta.env.VITE_PUBLIC_ADMIN_ADDRESS,
          content: message,
          gameId: game._id,
        });
      },
      checkIfCompleted: () => {
        return true;
      },
      onComplete: () => {
        // do nothing
      },
    },
    // {
    //   id: 'vote',
    //   name: 'Vote Task',
    //   weight: () => {
    //     if (hasAiAgentVoted) {
    //       return 0;
    //     }

    //     return playerAlreadyVoted ** 2;
    //   },
    //   waitUntilNextTask: () => {
    //     return Phaser.Math.Between(8000, 10000);
    //   },
    //   repeatable: false,
    //   execute: (agent: Agent, scene: WorldScene) => {},
    //   checkIfCompleted: () => {
    //     return true;
    //   },
    //   onComplete: () => {
    //     // do nothing
    //   },
    // },
    ...tasksList.map((task) => {
      return {
        id: task.id,
        name: task.name,
        weight: () => 1,
        onComplete: async () => {
          // do nothing
        },
        waitUntilNextTask: () => {
          return Phaser.Math.Between(8000, 10000);
        },
        repeatable: true,
        execute: (agent: Agent, scene: WorldScene) => {
          agent.moveTo(task.position[0], task.position[1], scene);
        },
        checkIfCompleted: (agent: Agent) => {
          return agent.targetPath.length === 0;
        },
      };
    }),
  ];

  const chooseRandomTask = (completedIds: Set<string>): Task => {
    const filteredTasks = tasks.filter((task) => !completedIds.has(task.id));
    const totalWeight = filteredTasks.reduce(
      (acc, task) => acc + task.weight(),
      0
    );
    const random = Phaser.Math.Between(0, totalWeight);
    let currentWeight = 0;
    for (const task of filteredTasks) {
      currentWeight += task.weight();
      if (random <= currentWeight) {
        return task;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should never happen
    return filteredTasks[0]!;
  };

  return { chooseRandomTask };
};
