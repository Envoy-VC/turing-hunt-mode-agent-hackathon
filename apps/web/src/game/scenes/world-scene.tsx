/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/turing-hunt.json';

import { Player } from '../entities';

export class WorldScene extends Phaser.Scene {
  public player!: Player;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  public collisionLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'WorldScene' });
  }

  preload() {
    Map.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, `assets/${tileset.image}`);
    });

    this.load.tilemapTiledJSON('world', 'assets/turing-hunt.json');

    const frameWidth = 64;
    const frameHeight = 64;
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth,
      frameHeight,
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
      }
      map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom);
    });

    this.player = new Player({ x: 50, y: 200, key: 'player' }, this);

    this.physics.world.setBounds(0, 0, 40 * 16 * zoom, 20 * 16 * zoom);
    this.collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player.sprite, this.collisionLayer);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.cameras.main.startFollow(this.player.sprite);
  }

  update() {
    this.player.update(this);
  }
}
