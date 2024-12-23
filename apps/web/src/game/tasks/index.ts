import Phaser from 'phaser';

import { type Agent } from '../entities';
import { type WorldScene } from '../scenes';

export interface Task {
  id: string;
  name: string;
  weight: number;
  waitUntilNextTask: number;
  repeatable: boolean;
  execute: (agent: Agent, scene: WorldScene) => Promise<void> | void;
  checkIfCompleted: (agent: Agent, scene: WorldScene) => boolean;
}

const tasks: Task[] = [
  {
    id: 'move-to-random-tile',
    name: 'Move to random tile',
    weight: 1,
    waitUntilNextTask: 1000,
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
  },
];

export const chooseRandomTask = (completedIds: Set<string>): Task => {
  const filteredTasks = tasks.filter((task) => !completedIds.has(task.id));
  const totalWeight = filteredTasks.reduce((acc, task) => acc + task.weight, 0);
  const random = Phaser.Math.Between(0, totalWeight);
  let currentWeight = 0;
  for (const task of filteredTasks) {
    currentWeight += task.weight;
    if (random <= currentWeight) {
      return task;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should never happen
  return filteredTasks[0]!;
};
