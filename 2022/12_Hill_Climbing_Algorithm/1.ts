const input = await Deno.readTextFile("./input.txt");

type Tile = {
  x: number;
  y: number;
  height: number;
  isStart: boolean;
  isEnd: boolean;
  isSeen: boolean;
  distance: number;
};

const map: Tile[][] = input.split("\n").map((row, rowIdx) =>
  row.split("").map((tile, colIdx) => {
    const char = tile === "S" ? "a" : tile === "E" ? "z" : tile;
    return {
      x: rowIdx,
      y: colIdx,
      height: char.charCodeAt(0) - "a".charCodeAt(0),
      isStart: tile === "S",
      isEnd: tile === "E",
      distance: 0,
      isSeen: false,
    };
  })
);

const bfs = () => {
  const q = [map.flat().find((t) => t.isEnd)];
  for (let tile = q.shift(); tile; tile = q.shift()) {
    if (tile.isStart) return tile;
    [
      map[tile.x][tile.y - 1],
      map[tile.x][tile.y + 1],
      map[tile.x - 1]?.[tile.y],
      map[tile.x + 1]?.[tile.y],
    ].forEach((n) => {
      if (tile && n && !n.isSeen && n.height >= tile.height - 1) {
        n.isSeen = true;
        n.distance = tile.distance + 1;
        q.push(n);
      }
    });
  }
};

console.log(bfs()?.distance);
