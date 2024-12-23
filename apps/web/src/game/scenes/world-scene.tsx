/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import { js as EasyStar } from 'easystarjs';
import Phaser from 'phaser';
import Map from 'public/assets/turing-hunt.json';
import type { GameActions } from '~/hooks';

import { Agent, InteractionText, Player } from '../entities';
import { createGridFromTilemap } from '../helpers/pathfinder';

export class WorldScene extends Phaser.Scene {
  public player!: Player;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public map!: Phaser.Tilemaps.Tilemap;
  public collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  public interactionLayer!: Phaser.Tilemaps.TilemapLayer;
  public interactionText!: InteractionText;
  public actions: GameActions;
  public aiAgent!: Agent;
  public easyStar!: EasyStar;

  public tileSize = 16;

  constructor(actions: GameActions) {
    super({ key: 'WorldScene' });
    this.actions = actions;
  }

  preload() {
    Map.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, `assets/${tileset.image}`);
    });

    this.load.tilemapTiledJSON('world', 'assets/turing-hunt.json');
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.cameras.main.setZoom(2);
    const zoom = this.cameras.main.zoom;
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(0, 0, 40 * 16 * zoom, 20 * 16 * zoom);

    const map = this.make.tilemap({
      key: 'world',
      tileHeight: 16,
      tileWidth: 16,
    });

    this.map = map;

    const tilesets = Map.tilesets.map((tileset) => {
      return map.addTilesetImage(tileset.name, tileset.name)!;
    });

    map.layers.forEach((layer) => {
      if (layer.name === 'Collision') {
        this.collisionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
        return;
      } else if (layer.name === 'Interaction') {
        this.interactionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
        return;
      }
      map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom);
    });

    this.player = new Player({ x: 50, y: 200, key: 'player' }, this);

    // Set Collision with World Bounds and Collision Layer
    this.physics.world.setBounds(0, 0, 40 * 16 * zoom, 20 * 16 * zoom);
    this.collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player.sprite, this.collisionLayer);

    // Set Collision with Interaction Layer
    this.physics.add.collider(this.player.sprite, this.interactionLayer);
    this.interactionText = new InteractionText(this);

    // Create Cursor Keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Set Camera to Follow Player
    // this.cameras.main.startFollow(this.player.sprite);

    // Create Pathfinder Graph
    const easyStar = new EasyStar();
    const grid = createGridFromTilemap(this.collisionLayer);
    easyStar.setGrid(grid);
    easyStar.setAcceptableTiles([0]);
    easyStar.setIterationsPerCalculation(1000);
    easyStar.disableCornerCutting();

    this.easyStar = easyStar;
    // Add AI Agent
    this.aiAgent = new Agent(
      this,
      { x: 50, y: 200, key: 'ai-agent' },
      this.actions.chooseRandomTask,
      this.actions.aiCompletedTasks
    );

    this.cameras.main.startFollow(this.player.sprite);
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- safe
  async update(_time: number, delta: number) {
    this.input.keyboard?.enableGlobalCapture();
    if (this.actions.store.isChatOpen) {
      this.input.keyboard?.disableGlobalCapture();
    }
    this.player.update(this);
    this.interactionText.update(this);
    await this.aiAgent.update(delta, this);
  }
}
