/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/turing-hunt.json';

export class WorldScene extends Phaser.Scene {
  public player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
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

    const frameWidth = 384 / 8;
    const frameHeight = 1152 / 24;

    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth,
      frameHeight,
    });
  }

  create() {
    this.cameras.main.setZoom(2.5);
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

    this.anims.create({
      key: 'idle-front',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.player = this.physics.add
      .sprite(50, 250, 'player')
      .setScale(2.5)
      .setBodySize(12, 16)
      .setOffset(16, 16);

    this.physics.world.setBounds(0, 0, 40 * 16 * zoom, 20 * 16 * zoom);
    this.collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.collisionLayer);
    this.player.setCollideWorldBounds(true);

    // repeat infinite
    this.player.anims.play({ key: 'idle-front', repeat: -1 }, true);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.cameras.main.startFollow(this.player);
  }

  update() {
    // Movement speed
    const speed = 100;

    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    } else if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    }

    // Vertical movement
    else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Stop animations if no input
    else {
      // this.player.anims.stop();
    }
  }
}
