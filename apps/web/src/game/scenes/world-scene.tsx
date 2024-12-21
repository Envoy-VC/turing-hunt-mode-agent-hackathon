/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/turing-hunt.json';

import { InteractionText, Player } from '../entities';

export class WorldScene extends Phaser.Scene {
  public player!: Player;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  public interactionLayer!: Phaser.Tilemaps.TilemapLayer;
  public interactionText!: InteractionText;

  constructor() {
    super({ key: 'WorldScene' });
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
          .setAlpha(0.25);
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
    this.cameras.main.startFollow(this.player.sprite);
  }

  update() {
    this.player.update(this);
    this.interactionText.update(this);
  }
}
