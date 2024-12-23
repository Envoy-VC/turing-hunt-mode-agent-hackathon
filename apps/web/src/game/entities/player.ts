import type { WorldScene } from '../scenes/world-scene';

interface PlayerCreateProps {
  x: number;
  y: number;
  key: string;
}

export class Player {
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private speed;

  constructor(props: PlayerCreateProps, scene: WorldScene) {
    this.createAnims(scene, props.key);
    this.speed = 50;

    this.sprite = scene.physics.add
      .sprite(props.x, props.y, props.key)
      .setScale(1)
      .setBodySize(24, 24)
      .setOffset(20, 38);

    this.sprite.setCollideWorldBounds(true);
    this.sprite.anims.play({ key: 'idle-south', repeat: -1 }, true);
  }

  update(scene: WorldScene) {
    if (!scene.cursors) return;
    const { left, right, up, down } = scene.cursors;

    // Reset velocity
    let velocityX = 0;
    let velocityY = 0;
    let animationKey = '';

    // Check input for movement
    if (left.isDown) {
      velocityX = -this.speed;
      animationKey = 'walk-west';
    } else if (right.isDown) {
      velocityX = this.speed;
      animationKey = 'walk-east';
    } else if (up.isDown) {
      velocityY = -this.speed;
      animationKey = 'walk-north';
    } else if (down.isDown) {
      velocityY = this.speed;
      animationKey = 'walk-south';
    }

    // Set sprite velocity
    this.sprite.body.setVelocity(velocityX, velocityY);

    // Play animation or idle
    if (velocityX !== 0 || velocityY !== 0) {
      this.sprite.anims.play(animationKey, true);
    } else {
      // Set idle animation based on last played direction
      const currentAnimation = this.sprite.anims.currentAnim?.key;
      if (currentAnimation) {
        const idleKey = currentAnimation.replace('walk', 'idle');
        this.sprite.anims.play(idleKey, true);
      }
    }
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
        key: `walk-${direction.key}`,
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
        key: `idle-${direction.key}`,
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
