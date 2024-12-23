import Phaser from 'phaser';

import type { Task } from '../../hooks/use-game-tasks';
import type { WorldScene } from '../scenes';

interface AgentCreateProps {
  x: number;
  y: number;
  key: string;
}

export class Agent {
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public speed: number;
  public targetPath: { x: number; y: number }[] = [];
  public currentDirection: string;

  private currentTask: Task | null;
  private lastTaskCompletedAt: number;
  private nextTaskStartTime: number;
  public completedTasks: Set<string>;
  private isTaskRunning: boolean;
  private chooseRandomTask: (completedIds: Set<string>) => Task;

  constructor(
    scene: WorldScene,
    props: AgentCreateProps,
    chooseRandomTask: (completedIds: Set<string>) => Task,
    completedTasks: string[]
  ) {
    this.createAnims(scene, props.key);
    this.speed = 50;
    this.currentDirection = 'south';
    this.chooseRandomTask = chooseRandomTask;
    this.currentTask = null;

    this.completedTasks = new Set(...completedTasks);
    this.isTaskRunning = false;
    this.lastTaskCompletedAt = Date.now();
    this.nextTaskStartTime = Date.now();

    this.sprite = scene.physics.add
      .sprite(props.x, props.y, 'player2')
      .setScale(1)
      .setBodySize(24, 24)
      .setOffset(20, 38);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.anims.play({ key: 'idle-south-2', repeat: -1 }, true);

    // scene.input.on(
    //   'pointerdown',
    //   (pointer: Phaser.Input.Pointer) => {
    //     this.handlePointerDown(pointer, scene);
    //   },
    //   this
    // );
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer, scene: WorldScene) {
    const zoom = scene.cameras.main.zoom;
    const tileX = Math.floor(pointer.worldX / (scene.tileSize * zoom));
    const tileY = Math.floor(pointer.worldY / (scene.tileSize * zoom));
    console.log(tileX, tileY);
    this.moveTo(tileX, tileY, scene);
  }

  public moveTo(tileX: number, tileY: number, scene: WorldScene) {
    const zoom = scene.cameras.main.zoom;

    const playerTileX = Math.floor(this.sprite.x / (scene.tileSize * zoom));
    const playerTileY = Math.floor(this.sprite.y / (scene.tileSize * zoom));

    scene.easyStar.findPath(
      playerTileX,
      playerTileY,
      tileX,
      tileY,
      (path: { x: number; y: number }[] | null) => {
        if (path) {
          this.targetPath = path.map((tile) => {
            return {
              x: tile.x * scene.tileSize * zoom + (scene.tileSize * zoom) / 2,
              y: tile.y * scene.tileSize * zoom + (scene.tileSize * zoom) / 2,
            };
          });
        }
      }
    );

    scene.easyStar.calculate();
  }

  async update(delta: number, scene: WorldScene) {
    // Handle No Current Task
    if (!this.currentTask) {
      const randomTask = this.chooseRandomTask(this.completedTasks);
      console.log(randomTask);
      this.currentTask = randomTask;
      this.isTaskRunning = true;
      await randomTask.execute(this, scene);
    } else if (this.isTaskRunning) {
      const completed = this.currentTask.checkIfCompleted(this, scene);
      if (completed) {
        await this.currentTask.onComplete(this, scene);
        this.isTaskRunning = false;
        this.lastTaskCompletedAt = Date.now();
        const waitTime = this.currentTask.waitUntilNextTask();
        console.log('Waiting for ', waitTime, ' ms');
        this.nextTaskStartTime = Date.now() + waitTime;
        if (!this.currentTask.repeatable) {
          this.completedTasks.add(this.currentTask.id);
        }
      }
    } else if (this.nextTaskStartTime <= Date.now()) {
      this.currentTask = null;
    }

    if (this.targetPath.length > 0) {
      const target = this.targetPath[0];
      if (!target) return;

      const dx = target.x - this.sprite.x;
      const dy = target.y - this.sprite.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const moveStep = (this.speed * delta) / 1000;

      if (distance < moveStep) {
        this.sprite.x = target.x;
        this.sprite.y = target.y;
        this.targetPath.shift();
      } else {
        const angle = Math.atan2(dy, dx);
        this.sprite.x += Math.cos(angle) * moveStep;
        this.sprite.y += Math.sin(angle) * moveStep;

        const newDirection = this.getDirectionFromAngle(angle);

        if (this.currentDirection !== newDirection) {
          this.currentDirection = newDirection;
          this.sprite.anims.play(`walk-${newDirection}-2`, true);
        } else if (!this.sprite.anims.isPlaying) {
          this.sprite.anims.play(`walk-${newDirection}-2`, true);
        }
      }
    } else {
      this.sprite.setVelocity(0);
      this.sprite.anims.play('idle-south-2', true);
    }
  }

  private getDirectionFromAngle(angle: number): string {
    const deg = Phaser.Math.RadToDeg(angle);

    if (deg >= -45 && deg <= 45) {
      return 'east';
    } else if (deg > 45 && deg <= 135) {
      return 'south';
    } else if (deg < -45 && deg >= -135) {
      return 'north';
    }
    return 'west';
  }

  private createAnims(scene: WorldScene, key: string) {
    const framesPerRow = 13;
    const directions = [
      {
        key: 'north',
        rowIndex: 8,
      },
      {
        key: 'west',
        rowIndex: 9,
      },
      {
        key: 'south',
        rowIndex: 10,
      },
      {
        key: 'east',
        rowIndex: 11,
      },
    ];
    directions.forEach((direction) => {
      scene.anims.create({
        key: `walk-${direction.key}-2`,
        frames: scene.anims.generateFrameNumbers(key, {
          start: direction.rowIndex * framesPerRow,
          end: direction.rowIndex * framesPerRow + 8,
        }),
        frameRate: 9,
        repeat: -1,
      });
    });

    directions.forEach((direction) => {
      scene.anims.create({
        key: `idle-${direction.key}-2`,
        frames: scene.anims.generateFrameNumbers(key, {
          start: direction.rowIndex * framesPerRow,
          end: direction.rowIndex * framesPerRow,
        }),
        frameRate: 10,
        repeat: -1,
      });
    });
  }
}
