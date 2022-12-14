const input = await Deno.readTextFile("./input.txt");

const walls = input
  .split("\n")
  .map((l) => l.split(" -> ").map((pair) => pair.split(",").map(Number)));

const abyssY =
  Math.max(...walls.map((wall) => Math.max(...wall.map(([_, y]) => y)))) + 1;

const isWall = ({ x, y }: { x: number; y: number }) => {
  return walls.some((wall) =>
    wall.some((from, idx, array) => {
      const to = array[idx + 1];
      if (!to) return false;
      const fromX = Math.min(from[0], to[0]);
      const fromY = Math.min(from[1], to[1]);
      const toX = Math.max(from[0], to[0]);
      const toY = Math.max(from[1], to[1]);
      return x >= fromX && x <= toX && y >= fromY && y <= toY;
    })
  );
};

const sands: { x: number; y: number }[] = [];

const isOccupied = ({ x, y }: { x: number; y: number }) =>
  !!sands.find((sand) => sand.x === x && sand.y === y) || isWall({ x, y });

const fall = () => {
  const sand = { x: 500, y: 0 };
  while (true) {
    if (sand.y === abyssY) return;
    const down = { x: sand.x, y: sand.y + 1 };
    const downLeft = { x: sand.x - 1, y: sand.y + 1 };
    const downRight = { x: sand.x + 1, y: sand.y + 1 };
    if (!isOccupied(down)) {
      sand.x = down.x;
      sand.y = down.y;
    } else if (!isOccupied(downLeft)) {
      sand.x = downLeft.x;
      sand.y = downLeft.y;
    } else if (!isOccupied(downRight)) {
      sand.x = downRight.x;
      sand.y = downRight.y;
    } else {
      sands.push({ ...sand });
      sand.x = 500;
      sand.y = 0;
    }
  }
};

fall();

console.log(sands.length);
