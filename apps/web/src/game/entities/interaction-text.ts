/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */
import Phaser from 'phaser';

import type { WorldScene } from '../scenes';

import type { InteractionType } from '~/types/game';

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe  */
export class InteractionText {
  private interactionKey!: Phaser.Input.Keyboard.Key;
  private interactionText!: Phaser.GameObjects.Text;
  private blinkingTimer!: Phaser.Time.TimerEvent | null;

  constructor(scene: WorldScene) {
    this.interactionKey = scene.input.keyboard!.addKey('E');
    this.blinkingTimer = null;

    this.interactionText = scene.add.text(0, 0, 'Press E to interact', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    this.interactionText.setAlpha(0);
    this.interactionText.setDepth(10);
  }

  checkInteractionTile(scene: WorldScene): Phaser.Tilemaps.Tile | null {
    const playerX = scene.player.sprite.x;
    const playerY = scene.player.sprite.y;

    const tile = scene.interactionLayer.getTileAtWorldXY(
      playerX,
      playerY,
      true
    );

    if ('interactionType' in tile.properties) {
      return tile;
    }
    return null;
  }

  handleInteraction(tile: Phaser.Tilemaps.Tile, scene: WorldScene) {
    // Perform interaction based on the tile's properties
    const interactionType = (
      tile.properties as {
        interactionType: InteractionType;
      }
    ).interactionType;
    this.interactionText.setText(
      `Press E to interact for Task ${interactionType}`
    );
    // Middle of screen in x and towards the bottom in y
    this.interactionText.setPosition(
      scene.player.sprite.x - this.interactionText.width / 2,
      scene.player.sprite.y - 30
    );

    this.interactionText.setVisible(true);

    if (!this.blinkingTimer) {
      this.startBlinkingText(scene);
    }

    if (Phaser.Input.Keyboard.JustDown(this.interactionKey)) {
      // TODO: Implement interaction logic
      console.log(`Interacted with Task ${interactionType}`, tile);
      scene.actions.startTask(interactionType);
    }
  }

  startBlinkingText(scene: WorldScene) {
    this.blinkingTimer = scene.time.addEvent({
      delay: 1000,
      callback: () => {
        const currentAlpha = this.interactionText.alpha;
        this.interactionText.setAlpha(currentAlpha === 1 ? 0 : 1);
      },
      loop: true,
    });
  }

  stopBlinkingText() {
    if (this.blinkingTimer) {
      this.blinkingTimer.remove();
      this.blinkingTimer = null;
    }
    this.interactionText.setAlpha(0);
  }

  update(scene: WorldScene) {
    const tile = this.checkInteractionTile(scene);
    if (tile) {
      this.handleInteraction(tile, scene);
    } else {
      this.interactionText.setAlpha(0);
      this.stopBlinkingText();
    }
  }
}
