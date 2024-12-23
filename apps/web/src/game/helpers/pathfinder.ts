export const createGridFromTilemap = (
  layer: Phaser.Tilemaps.TilemapLayer
): number[][] => {
  const grid: number[][] = [];

  for (let y = 0; y < layer.tilemap.height; y++) {
    const row: number[] = [];
    for (let x = 0; x < layer.tilemap.width; x++) {
      const tile = layer.getTileAt(x, y) as Phaser.Tilemaps.Tile | null;
      let isColliding = false;
      if (!tile) {
        isColliding = false;
      } else {
        isColliding =
          'collides' in tile.properties
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
              Boolean(tile.properties.collides)
            : false;
      }

      row.push(isColliding ? 1 : 0);
    }
    grid.push(row);
  }

  return grid;
};
